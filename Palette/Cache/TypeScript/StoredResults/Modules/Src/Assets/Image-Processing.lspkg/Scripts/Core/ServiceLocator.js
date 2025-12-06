"use strict";
// ServiceLocator.ts
// Simple service locator pattern for managing shared services and dependencies
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceLocator = void 0;
exports.Service = Service;
exports.inject = inject;
class ServiceLocator {
    constructor() {
        this.services = new Map();
        this.factories = new Map();
    }
    static getInstance() {
        if (!ServiceLocator.instance) {
            ServiceLocator.instance = new ServiceLocator();
        }
        return ServiceLocator.instance;
    }
    // Register a service instance
    registerService(serviceId, service) {
        print(`ServiceLocator: Registering service ${serviceId}`);
        this.services.set(serviceId, service);
    }
    // Register a service factory
    registerFactory(serviceId, factory) {
        print(`ServiceLocator: Registering factory for ${serviceId}`);
        this.factories.set(serviceId, factory);
    }
    // Get a service by ID
    getService(serviceId) {
        // Check if service is already instantiated
        if (this.services.has(serviceId)) {
            return this.services.get(serviceId);
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
    hasService(serviceId) {
        return this.services.has(serviceId) || this.factories.has(serviceId);
    }
    // Get all available service IDs
    getAvailableServices() {
        const serviceIds = new Set();
        for (const id of this.services.keys()) {
            serviceIds.add(id);
        }
        for (const id of this.factories.keys()) {
            serviceIds.add(id);
        }
        return Array.from(serviceIds);
    }
    // Clear all services (useful for testing)
    clear() {
        this.services.clear();
        this.factories.clear();
    }
}
exports.ServiceLocator = ServiceLocator;
ServiceLocator.instance = null;
// Helper decorator for automatic service registration
function Service(serviceId) {
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                const locator = ServiceLocator.getInstance();
                locator.registerService(serviceId, this);
            }
        };
    };
}
// Helper function for dependency injection
function inject(serviceId) {
    const locator = ServiceLocator.getInstance();
    return locator.getService(serviceId);
}
//# sourceMappingURL=ServiceLocator.js.map