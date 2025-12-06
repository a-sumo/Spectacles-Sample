# Component Orchestration Architecture Guide

## Problem Statement
Your Spectacles project has many interacting scripts with complex dependencies, leading to initialization timing issues like "GamutProjector not ready (waiting for encoder)". This guide provides a scalable solution.

## Architecture Overview

The new architecture introduces three core systems:

1. **ComponentOrchestrator** - Manages component lifecycle and dependencies
2. **ServiceLocator** - Provides dependency injection and service discovery
3. **IInitializable Interface** - Standardizes component initialization

## Implementation Steps

### 1. Scene Setup

Add a single `ComponentOrchestrator` component to your scene root:

```
Scene Root
├── ComponentOrchestrator (add this first)
├── Your existing components...
```

### 2. Convert Components to Use New Architecture

For each component (like PigmentGamutEncoder), follow this pattern:

```typescript
import { IInitializable, ComponentOrchestrator } from "../Core/ComponentOrchestrator";
import { ServiceLocator, Service } from "../Core/ServiceLocator";

@Service("YourComponentName")
@component
export class YourComponent extends BaseScriptComponent implements IInitializable {
    // Declare dependencies
    readonly componentId = "YourComponentName";
    readonly dependencies: string[] = ["DependencyComponent1", "DependencyComponent2"];

    private isComponentReady: boolean = false;

    onAwake(): void {
        // Register with orchestrator
        const orchestrator = ComponentOrchestrator.getInstance();
        if (orchestrator) {
            orchestrator.registerComponent(this);
        }

        const locator = ServiceLocator.getInstance();
        locator.registerService(this.componentId, this);
    }

    // Implement IInitializable
    public initialize(): boolean {
        if (this.isComponentReady) return true;

        try {
            // Your initialization logic here
            // Return false if dependencies aren't ready
            // Return true when successfully initialized

            this.isComponentReady = true;
            return true;
        } catch (error) {
            print(`${this.componentId}: Initialization failed: ${error}`);
            return false;
        }
    }

    public isReady(): boolean {
        return this.isComponentReady;
    }

    // Optional: Called when all dependencies are ready
    public onDependenciesReady?(): void {
        print(`${this.componentId}: Dependencies ready, initializing...`);
        this.initialize();
    }
}
```

### 3. Component Dependencies Map

For your specific components:

```
PigmentGamutEncoder
├── dependencies: [] (no dependencies)
├── provides: Encoder render targets, gamut data

GamutProjector
├── dependencies: ["PigmentGamutEncoder"]
├── provides: Projection functionality, projected textures

PipelineTester
├── dependencies: ["GamutProjector"]
├── provides: Testing and validation
```

### 4. Service Access Pattern

Instead of direct component references, use the service locator:

```typescript
// Old way (fragile)
if (!this.projector.isReady()) { /* error */ }

// New way (robust)
const projector = ServiceLocator.getInstance().getService<GamutProjector>("GamutProjector");
if (!projector || !projector.isReady()) {
    // Handle gracefully or wait for component
}

// Async waiting
const orchestrator = ComponentOrchestrator.getInstance();
const isReady = await orchestrator.waitForComponent("GamutProjector", 5000);
if (isReady) {
    // Component is ready to use
}
```

### 5. Migration Priority Order

1. **Start with leaf components** (no dependencies): PigmentGamutEncoder
2. **Move to components with dependencies**: GamutProjector
3. **Finish with orchestration components**: PipelineTester

### 6. Testing Your Implementation

1. Add ComponentOrchestrator to scene
2. Convert PigmentGamutEncoder first
3. Check logs for proper registration
4. Convert GamutProjector next
5. Verify dependency resolution in logs

Expected log sequence:
```
ComponentOrchestrator: Starting component orchestration system
ComponentOrchestrator: Registering component PigmentGamutEncoder
ComponentOrchestrator: Registering component GamutProjector
ComponentOrchestrator: Initialization order: PigmentGamutEncoder → GamutProjector
ComponentOrchestrator: Initializing component PigmentGamutEncoder
PigmentGamutEncoder: Initialization complete
ComponentOrchestrator: Initializing component GamutProjector
GamutProjector: Dependencies ready, initializing...
GamutProjector: Initialized (6 colors)
```

## Benefits

✅ **Deterministic initialization order** based on dependency graph
✅ **Automatic dependency resolution**
✅ **Graceful error handling** with timeouts
✅ **Service discovery** without tight coupling
✅ **Scalable architecture** for complex scenes
✅ **Clear separation of concerns**

## Advanced Features

### Conditional Dependencies
```typescript
readonly dependencies = this.useAdvancedMode ? ["AdvancedEncoder"] : ["BasicEncoder"];
```

### Async Initialization
```typescript
public async initialize(): Promise<boolean> {
    await this.loadResources();
    return this.setupComponents();
}
```

### Circular Dependency Detection
The orchestrator automatically detects and logs circular dependencies.

## Migration Checklist

- [ ] Add ComponentOrchestrator to scene
- [ ] Convert PigmentGamutEncoder
- [ ] Convert GamutProjector
- [ ] Convert PipelineTester
- [ ] Test initialization order
- [ ] Remove old polling/retry logic
- [ ] Update component references to use service locator

## Troubleshooting

**"Component not found"** - Ensure `@Service("Name")` decorator matches `componentId`
**"Circular dependency"** - Review dependency declarations in `readonly dependencies`
**"Timeout waiting"** - Check if dependencies are properly registered and initializing
**"Service not available"** - Verify service registration in `onAwake()`