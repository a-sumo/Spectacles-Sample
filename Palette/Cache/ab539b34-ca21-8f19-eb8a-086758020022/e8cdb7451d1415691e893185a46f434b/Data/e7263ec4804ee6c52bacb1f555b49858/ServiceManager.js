"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceManager = void 0;
/**
 * A service manager that allows registration and retrieval of services by their interface types
 */
class ServiceManager {
    /**
     * Gets the singleton instance of the ServiceManager
     */
    static getInstance() {
        if (!ServiceManager.instance) {
            ServiceManager.instance = new ServiceManager();
        }
        return ServiceManager.instance;
    }
    constructor() {
        this.services = new Map();
        // Private constructor to enforce singleton pattern
    }
    /**
     * Register an implementation for an interface
     * @param interfaceType The interface constructor function
     * @param implementation The implementation instance
     */
    register(interfaceType, implementationType) {
        let serviceName = 'Unknown implementation';
        if (typeof interfaceType === 'function') {
            serviceName = interfaceType.name || 'Anonymous implementation';
        }
        if (this.services.has(interfaceType)) {
            print(`Service for ${serviceName} is being overwritten`);
        }
        print(`Registering service for ${serviceName}`);
        this.services.set(interfaceType, implementationType);
    }
    /**
     * Get an implementation for an interface
     * @param interfaceType The interface constructor function
     * @returns The implementation instance or null if not found
     */
    get(interfaceType) {
        return this.services.get(interfaceType) || null;
    }
    /**
     * Remove an implementation for an interface
     * @param interfaceType The interface constructor function
     * @returns True if the implementation was removed, false otherwise
     */
    remove(interfaceType) {
        return this.services.delete(interfaceType);
    }
    /**
     * Clears all registered services
     */
    clear() {
        this.services.clear();
    }
}
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=ServiceManager.js.map