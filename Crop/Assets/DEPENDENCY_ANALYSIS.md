# Project Dependency Analysis

## Scene Hierarchy (Simplified)

```
Scene
├── Lighting (Envmap, Light)
├── SpectaclesInteractionKit ← MUST BE EARLY (before Camera)
│   ├── [REQUIRED] Core
│   │   ├── Configuration
│   │   ├── LeftHandInteractor
│   │   ├── RightHandInteractor
│   │   ├── MouseInteractor
│   │   └── MobileInteractor
│   └── [OPTIONAL] Visuals
│       ├── HandVisuals
│       └── InteractorCursors
├── Camera Object
│   ├── LeftSpecsCamera
│   ├── RightSpecsCamera
│   └── DebugText
├── TextLogger
├── CameraService
├── ImageAnchor/Scanner (Picture capture)
├── ComponentOrchestrator
├── Cursor Plane Controller (Color sampling UI)
├── Palette Controller (Color slots + presets)
├── Color Gamut Frame (Encoders + Decoders)
│   ├── LAB Decoder (VFX)
│   ├── Encoder_FullRGB
│   ├── Pigment Gamut Decoder (VFX)
│   ├── Encoder_PigmentMix
│   ├── Encoder_Projector_Gamut
│   └── Decoder_Projector_Gamut (VFX)
├── TexturePositionSync
├── PaletteExtractor
├── Image Regenerator
├── Image Pipeline
├── PipelineTester
└── Image Input/Output
```

---

## Script Dependency Graph

```
                                    ┌─────────────────────┐
                                    │  SwitchToggleGroup  │
                                    │     Extended        │
                                    └──────────┬──────────┘
                                               │ onSelectionChanged
                                               │ onAllDeselected
                                               ▼
┌─────────────────┐    getAllColors()    ┌─────────────────────┐
│ PictureController│◄────────────────────│  PaletteController  │
└────────┬────────┘                      └──────────┬──────────┘
         │ onActiveScannerChanged                   │ onPresetChanged
         ▼                                          │ syncPigmentColors()
┌─────────────────────┐                             ▼
│CursorPlaneController│    setActiveItemColor() ┌─────────────────────┐
└────────┬────────────┘◄────────────────────────│  Encoder_PigmentMix │
         │ onColorSampled                       └──────────┬──────────┘
         ▼                                                 │ posRenderTarget
┌─────────────────────┐                                    │ colorRenderTarget
│  PaletteController  │                                    ▼
└─────────────────────┘                         ┌─────────────────────┐
                                                │   Projector_Gamut   │
                                                └──────────┬──────────┘
                                                           │ projectedColors
                                                           ▼
┌─────────────────┐   inputTexture   ┌─────────────────────────────────┐
│ PaletteExtractor│─────────────────►│        Image Pipeline           │
└────────┬────────┘                  │  (orchestrates full pipeline)   │
         │ extractedPalette          └──────────────┬──────────────────┘
         ▼                                          │
┌─────────────────┐                                 ▼
│ Projector_Gamut │◄─────────────────────┌─────────────────────┐
└────────┬────────┘                      │  Image Regenerator  │
         │ projectedColors               └─────────────────────┘
         ▼                                          │
┌─────────────────┐                                 ▼
│Image Regenerator│                         Output Texture
└─────────────────┘

┌─────────────────────┐
│ TexturePositionSync │◄──── Projector_Gamut (reads textures)
└─────────────────────┘

┌─────────────────────┐
│   PipelineTester    │◄──── All pipeline components (testing)
└─────────────────────┘
```

---

## Event Flow Diagram

```
USER ACTIONS                         SYSTEM EVENTS                      RESULTS
─────────────────────────────────────────────────────────────────────────────────

Tap Preset Toggle ──► SwitchToggleGroupExtended
                              │
                              ├─► onSelectionChanged ──► PaletteController
                              │                                 │
                              │                                 ├─► applyPreset()
                              │                                 │       │
                              │                                 │       ├─► syncPigmentColors()
                              │                                 │       │       │
                              │                                 │       │       ▼
                              │                                 │       │  Encoder_PigmentMix
                              │                                 │       │       │
                              │                                 │       │       ▼
                              │                                 │       │  onPresetChanged ──► Projector_Gamut
                              │                                 │       │                            │
                              │                                 │       │                            ▼
                              │                                 │       │                     Re-project colors
                              │                                 │       │
                              └─► onAllDeselected ──► PaletteController
                                                             │
                                                             ├─► restorePrePresetPalette()
                                                             │
                                                             ▼
                                                      Restore saved colors


Pinch on Scanner ──► CursorPlaneController
                              │
                              ├─► Sample color at UV
                              │
                              ├─► onColorSampled ──► PaletteController
                              │                            │
                              │                            ▼
                              │                     setActiveItemColor()
                              │
                              └─► Update UI (hex display, indicator)


Two-Hand Pinch ──► PictureController
                        │
                        ├─► createScanner()
                        │
                        └─► onActiveScannerChanged ──► CursorPlaneController
                                                              │
                                                              ▼
                                                       Track new scanner
```

---

## Initialization Order (Critical)

```
1. SpectaclesInteractionKit (MUST be first - provides HandInputData, Camera)
   └── Provides: WorldCameraFinderProvider, TrackedHand, Interactable system

2. Camera Object
   └── Provides: Render targets, device tracking

3. CameraService (if exists)
   └── Provides: Camera access for textures

4. Encoders (can be parallel)
   ├── Encoder_FullRGB
   └── Encoder_PigmentMix ◄── Needs PaletteController colors

5. Projector_Gamut
   └── Needs: Encoder ready (for gamut textures)

6. PaletteController
   └── Needs: Encoder_PigmentMix (for syncPigmentColors)
   └── Needs: SwitchToggleGroupExtended (for preset selection)

7. PaletteExtractor
   └── Needs: Input texture source

8. Image Regenerator
   └── Needs: Material with shader

9. Image Pipeline / PipelineTester
   └── Needs: All above components ready
```

---

## Identified Issues & Improvements

### 1. **Initialization Race Conditions**
**Problem:** Components don't wait for dependencies properly.
```
Current: PipelineTester checks isReady() but may miss timing
Better:  Use ComponentOrchestrator with explicit dependency declarations
```

**Fix:** Each component should declare dependencies:
```typescript
// Example
class Projector_Gamut implements IInitializable {
    readonly componentId = "Projector_Gamut";
    readonly dependencies = ["Encoder_PigmentMix"];

    async initialize(): Promise<boolean> {
        // Wait for encoder
    }
}
```

### 2. **Circular Event Dependencies**
**Problem:** PaletteController ↔ Encoder_PigmentMix bidirectional coupling
```
PaletteController.syncPigmentColors() → writes to Encoder_PigmentMix properties
Encoder_PigmentMix.onPresetChanged() → reads from PaletteController
```

**Fix:** Use unidirectional data flow:
```
PaletteController (source of truth)
       │
       ▼ (events only)
Encoder_PigmentMix (consumer)
       │
       ▼ (textures only)
Projector_Gamut
```

### 3. **Scattered Scene References**
**Problem:** Scripts use string paths to find siblings
```typescript
@input pigmentEncoderPath: string = "Encoder_PigmentMix"  // Fragile!
```

**Fix:** Use direct SceneObject references or a service locator:
```typescript
@input pigmentEncoder: ScriptComponent  // Direct reference
// OR
ComponentOrchestrator.getComponent("Encoder_PigmentMix")
```

### 4. **Missing Type Safety**
**Problem:** Heavy use of `as any` for cross-component calls
```typescript
const controller = this.paletteController as any;
controller.onPresetChanged.add(...)  // No type checking
```

**Fix:** Define shared interfaces:
```typescript
// Shared interfaces file
interface IPaletteProvider {
    onPresetChanged: PublicApi<PresetChangedEvent>;
    getAllColors(): vec4[];
}

interface IEncoder {
    isReady(): boolean;
    getPosRenderTarget(): Texture;
    getColorRenderTarget(): Texture;
}
```

### 5. **Duplicate Pipeline Logic**
**Problem:** Both `ImagePipeline` and `PipelineTester` implement similar flows

**Fix:** Extract shared pipeline runner:
```typescript
class PipelineRunner {
    async runExtraction(): Promise<vec3[]> { ... }
    async runProjection(colors: vec3[]): Promise<vec3[]> { ... }
    async runRegeneration(original: vec3[], projected: vec3[]): Promise<Texture> { ... }
}
```

### 6. **VFX Property Coupling**
**Problem:** Scripts directly set VFX properties by string name
```typescript
props["posMap"] = this.posRenderTarget;  // Magic strings
props["colorMap"] = this.colorRenderTarget;
```

**Fix:** Create VFX adapter class:
```typescript
class GamutVFXAdapter {
    constructor(vfx: VFXComponent) { ... }
    setPositionMap(tex: Texture) { ... }
    setColorMap(tex: Texture) { ... }
}
```

---

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ComponentOrchestrator    ColorService    PipelineService           │
│  (dependency injection)   (palette mgmt)  (image processing)        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CORE COMPONENTS                               │
├─────────────────────────────────────────────────────────────────────┤
│  Encoder_PigmentMix    Projector_Gamut    PaletteExtractor          │
│  Encoder_FullRGB       ImageRegenerator                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          UI LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│  PaletteController     CursorPlaneController    PictureController   │
│  SwitchToggleGroup     TexturePositionSync                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Quick Fixes (Priority Order)

1. **Move SIK before Camera** - Already identified, fixes null camera error
2. **Add isReady() guards** - Prevent null reference errors
3. **Use ComponentOrchestrator** - Centralize initialization
4. **Create shared interfaces** - Type safety for cross-component calls
5. **Consolidate pipeline logic** - Single source of truth for processing flow

---

## File Reference Map

| Script | Location | Primary Responsibility |
|--------|----------|----------------------|
| PaletteController | `Image-Processing/Scripts/` | Color slot management, presets |
| Encoder_PigmentMix | `Color-Space.lspkg/Scripts/` | Pigment gamut encoding |
| Projector_Gamut | `Color-Space.lspkg/Scripts/` | Color gamut projection |
| PaletteExtractor | `Image-Processing/Scripts/Image Processing/` | K-means palette extraction |
| ImageRegenerator | `Image-Processing/Scripts/Image Processing/` | Palette-based image remap |
| ImagePipeline | `Image-Processing/Scripts/Image Processing/` | Pipeline orchestration |
| PipelineTester | `Image-Processing/Scripts/Image Processing/` | Testing harness |
| CursorPlaneController | `Image-Processing/Scripts/` | Color sampling from images |
| PictureController | `Image-Processing/Scripts/` | Scanner instance management |
| SwitchToggleGroupExtended | `Image-Processing/Scripts/UI/` | Preset toggle UI |
| TexturePositionSync | `Image-Processing/Scripts/` | 3D object positioning from textures |
| ComponentOrchestrator | `Image-Processing/Scripts/Core/` | Dependency management |
