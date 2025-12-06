// ComponentOrchestrator.ts
// Central orchestration system for managing component dependencies and initialization order

export interface IInitializable {
    readonly componentId: string;
    readonly dependencies: string[];
    initialize(): Promise<boolean> | boolean;
    isReady(): boolean;
    onDependenciesReady?(): void;
}

export interface IService {
    readonly serviceId: string;
    isReady(): boolean;
}

@component
export class ComponentOrchestrator extends BaseScriptComponent {
    private components: Map<string, IInitializable> = new Map();
    private services: Map<string, IService> = new Map();
    private initializationOrder: string[] = [];
    private initializedComponents: Set<string> = new Set();
    private isOrchestrating: boolean = false;

    onAwake(): void {
        // Set singleton instance first
        ComponentOrchestrator.instance = this;

        print("ComponentOrchestrator: Starting component orchestration system");

        // Start orchestration after all components have registered
        this.createEvent("DelayedCallbackEvent").bind((event) => {
            event.reset(0.1);
            this.startOrchestration();
        });
    }

    // Register a component with the orchestrator
    public registerComponent(component: IInitializable): void {
        print(`ComponentOrchestrator: Registering component ${component.componentId}`);
        this.components.set(component.componentId, component);
    }

    // Register a service with the orchestrator
    public registerService(service: IService): void {
        print(`ComponentOrchestrator: Registering service ${service.serviceId}`);
        this.services.set(service.serviceId, service);
    }

    // Get a service by ID
    public getService<T extends IService>(serviceId: string): T | null {
        return this.services.get(serviceId) as T || null;
    }

    // Get a component by ID
    public getComponent<T extends IInitializable>(componentId: string): T | null {
        return this.components.get(componentId) as T || null;
    }

    // Check if a component is ready
    public isComponentReady(componentId: string): boolean {
        const component = this.components.get(componentId);
        return component ? component.isReady() : false;
    }

    // Wait for a component to be ready (returns Promise)
    public async waitForComponent(componentId: string, timeout: number = 5000): Promise<boolean> {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const checkReady = () => {
                if (this.isComponentReady(componentId)) {
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    print(`ComponentOrchestrator: Timeout waiting for component ${componentId}`);
                    resolve(false);
                    return;
                }

                this.createEvent("DelayedCallbackEvent").bind((event) => {
                    event.reset(0.1);
                    checkReady();
                });
            };

            checkReady();
        });
    }

    private startOrchestration(): void {
        if (this.isOrchestrating) return;
        this.isOrchestrating = true;

        print("ComponentOrchestrator: Starting component initialization orchestration");

        // Calculate initialization order based on dependencies
        this.calculateInitializationOrder();

        // Initialize components in dependency order
        this.initializeComponents();
    }

    private calculateInitializationOrder(): void {
        const visited = new Set<string>();
        const visiting = new Set<string>();
        const order: string[] = [];

        const visit = (componentId: string): boolean => {
            if (visiting.has(componentId)) {
                print(`ComponentOrchestrator: Circular dependency detected involving ${componentId}`);
                return false;
            }

            if (visited.has(componentId)) {
                return true;
            }

            visiting.add(componentId);

            const component = this.components.get(componentId);
            if (component) {
                // Visit all dependencies first
                for (const depId of component.dependencies) {
                    if (this.components.has(depId) && !visit(depId)) {
                        return false;
                    }
                }
            }

            visiting.delete(componentId);
            visited.add(componentId);
            order.push(componentId);

            return true;
        };

        // Visit all components
        for (const componentId of this.components.keys()) {
            visit(componentId);
        }

        this.initializationOrder = order;
        print(`ComponentOrchestrator: Initialization order: ${order.join(' → ')}`);
    }

    private async initializeComponents(): Promise<void> {
        for (const componentId of this.initializationOrder) {
            await this.initializeComponent(componentId);
        }

        print("ComponentOrchestrator: All components initialized");
    }

    private async initializeComponent(componentId: string): Promise<void> {
        const component = this.components.get(componentId);
        if (!component || this.initializedComponents.has(componentId)) {
            return;
        }

        print(`ComponentOrchestrator: Initializing component ${componentId}`);

        // Wait for all dependencies to be ready
        for (const depId of component.dependencies) {
            if (this.components.has(depId)) {
                await this.waitForComponent(depId);
            }
        }

        // Notify component that dependencies are ready
        if (component.onDependenciesReady) {
            component.onDependenciesReady();
        }

        // Initialize the component
        try {
            const result = await component.initialize();
            if (result) {
                this.initializedComponents.add(componentId);
                print(`ComponentOrchestrator: Component ${componentId} initialized successfully`);
            } else {
                print(`ComponentOrchestrator: Component ${componentId} initialization failed`);
            }
        } catch (error) {
            print(`ComponentOrchestrator: Error initializing component ${componentId}: ${error}`);
        }
    }

    // Static singleton access
    private static instance: ComponentOrchestrator | null = null;

    public static getInstance(): ComponentOrchestrator | null {
        return ComponentOrchestrator.instance;
    }
}