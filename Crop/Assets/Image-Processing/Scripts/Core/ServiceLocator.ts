// ServiceLocator.ts
// Simple service locator pattern for managing shared services and dependencies

export interface IServiceProvider {
    provideServices(locator: ServiceLocator): void;
}

export class ServiceLocator {
    private static instance: ServiceLocator | null = null;
    private services: Map<string, any> = new Map();
    private factories: Map<string, () => any> = new Map();

    public static getInstance(): ServiceLocator {
        if (!ServiceLocator.instance) {
            ServiceLocator.instance = new ServiceLocator();
        }
        return ServiceLocator.instance;
    }

    // Register a service instance
    public registerService<T>(serviceId: string, service: T): void {
        print(`ServiceLocator: Registering service ${serviceId}`);
        this.services.set(serviceId, service);
    }

    // Register a service factory
    public registerFactory<T>(serviceId: string, factory: () => T): void {
        print(`ServiceLocator: Registering factory for ${serviceId}`);
        this.factories.set(serviceId, factory);
    }

    // Get a service by ID
    public getService<T>(serviceId: string): T | null {
        // Check if service is already instantiated
        if (this.services.has(serviceId)) {
            return this.services.get(serviceId) as T;
        }

        // Try to create from factory
        const factory = this.factories.get(serviceId);
        if (factory) {
            const service = factory();
            this.services.set(serviceId, service);
            return service;
        }

        return null;
    }

    // Check if a service is available
    public hasService(serviceId: string): boolean {
        return this.services.has(serviceId) || this.factories.has(serviceId);
    }

    // Get all available service IDs
    public getAvailableServices(): string[] {
        const serviceIds = new Set<string>();

        for (const id of this.services.keys()) {
            serviceIds.add(id);
        }

        for (const id of this.factories.keys()) {
            serviceIds.add(id);
        }

        return Array.from(serviceIds);
    }

    // Clear all services (useful for testing)
    public clear(): void {
        this.services.clear();
        this.factories.clear();
    }
}

// Helper decorator for automatic service registration
export function Service(serviceId: string) {
    return function<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                const locator = ServiceLocator.getInstance();
                locator.registerService(serviceId, this);
            }
        };
    };
}

// Helper function for dependency injection
export function inject<T>(serviceId: string): T | null {
    const locator = ServiceLocator.getInstance();
    return locator.getService<T>(serviceId);
}