"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentOrchestrator = void 0;
var __selfType = requireType("./ComponentOrchestrator");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
let ComponentOrchestrator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ComponentOrchestrator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.components = new Map();
            this.services = new Map();
            this.initializationOrder = [];
            this.initializedComponents = new Set();
            this.isOrchestrating = false;
        }
        __initialize() {
            super.__initialize();
            this.components = new Map();
            this.services = new Map();
            this.initializationOrder = [];
            this.initializedComponents = new Set();
            this.isOrchestrating = false;
        }
        onAwake() {
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
        registerComponent(component) {
            print(`ComponentOrchestrator: Registering component ${component.componentId}`);
            this.components.set(component.componentId, component);
        }
        // Register a service with the orchestrator
        registerService(service) {
            print(`ComponentOrchestrator: Registering service ${service.serviceId}`);
            this.services.set(service.serviceId, service);
        }
        // Get a service by ID
        getService(serviceId) {
            return this.services.get(serviceId) || null;
        }
        // Get a component by ID
        getComponent(componentId) {
            return this.components.get(componentId) || null;
        }
        // Check if a component is ready
        isComponentReady(componentId) {
            const component = this.components.get(componentId);
            return component ? component.isReady() : false;
        }
        // Wait for a component to be ready (returns Promise)
        async waitForComponent(componentId, timeout = 5000) {
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
        startOrchestration() {
            if (this.isOrchestrating)
                return;
            this.isOrchestrating = true;
            print("ComponentOrchestrator: Starting component initialization orchestration");
            // Calculate initialization order based on dependencies
            this.calculateInitializationOrder();
            // Initialize components in dependency order
            this.initializeComponents();
        }
        calculateInitializationOrder() {
            const visited = new Set();
            const visiting = new Set();
            const order = [];
            const visit = (componentId) => {
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
        async initializeComponents() {
            for (const componentId of this.initializationOrder) {
                await this.initializeComponent(componentId);
            }
            print("ComponentOrchestrator: All components initialized");
        }
        async initializeComponent(componentId) {
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
                }
                else {
                    print(`ComponentOrchestrator: Component ${componentId} initialization failed`);
                }
            }
            catch (error) {
                print(`ComponentOrchestrator: Error initializing component ${componentId}: ${error}`);
            }
        }
        static getInstance() {
            return ComponentOrchestrator.instance;
        }
    };
    __setFunctionName(_classThis, "ComponentOrchestrator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComponentOrchestrator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    // Static singleton access
    _classThis.instance = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComponentOrchestrator = _classThis;
})();
exports.ComponentOrchestrator = ComponentOrchestrator;
//# sourceMappingURL=ComponentOrchestrator.js.map