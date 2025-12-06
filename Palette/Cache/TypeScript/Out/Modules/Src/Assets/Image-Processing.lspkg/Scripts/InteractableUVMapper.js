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
exports.InteractableUVMapper = void 0;
var __selfType = requireType("./InteractableUVMapper");
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
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const PictureController_1 = require("./PictureController");
/**
 * Maps interaction points on the active scanner's cameraCrop to UV coordinates (0-1 space).
 * Automatically finds and subscribes to PictureController via singleton.
 *
 * This is a pure mapper - it doesn't update materials or visuals,
 * just provides UV coordinates for other components to use.
 */
let InteractableUVMapper = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractableUVMapper = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.clampToBounds = this.clampToBounds;
            this.cameraCropPath = this.cameraCropPath;
            // Events
            this.onUVChangedEvent = new Event_1.default();
            this.onUVChanged = this.onUVChangedEvent.publicApi();
            this.onHoverStartEvent = new Event_1.default();
            this.onHoverStart = this.onHoverStartEvent.publicApi();
            this.onHoverEndEvent = new Event_1.default();
            this.onHoverEnd = this.onHoverEndEvent.publicApi();
            // State
            this.controller = null;
            this.activeScanner = null;
            this.activeInteractable = null;
            this.activeCameraCrop = null;
            this.activeCameraCropTransform = null;
            this.activeInteractableComponent = null;
            this.activeScannerId = null;
            this.currentUV = new vec2(0.5, 0.5);
            this.isHovering = false;
            // Event cleanup
            this.unsubscribeInteractable = [];
        }
        __initialize() {
            super.__initialize();
            this.clampToBounds = this.clampToBounds;
            this.cameraCropPath = this.cameraCropPath;
            // Events
            this.onUVChangedEvent = new Event_1.default();
            this.onUVChanged = this.onUVChangedEvent.publicApi();
            this.onHoverStartEvent = new Event_1.default();
            this.onHoverStart = this.onHoverStartEvent.publicApi();
            this.onHoverEndEvent = new Event_1.default();
            this.onHoverEnd = this.onHoverEndEvent.publicApi();
            // State
            this.controller = null;
            this.activeScanner = null;
            this.activeInteractable = null;
            this.activeCameraCrop = null;
            this.activeCameraCropTransform = null;
            this.activeInteractableComponent = null;
            this.activeScannerId = null;
            this.currentUV = new vec2(0.5, 0.5);
            this.isHovering = false;
            // Event cleanup
            this.unsubscribeInteractable = [];
        }
        onAwake() {
            // Get PictureController via singleton
            this.controller = PictureController_1.PictureController.getInstance();
            if (!this.controller) {
                print("InteractableUVMapper: PictureController singleton not found");
                return;
            }
            // Subscribe to active scanner changes
            this.controller.onActiveScannerChanged.add(this.onActiveScannerChanged.bind(this));
        }
        onActiveScannerChanged(event) {
            // Cleanup previous interactable events
            this.cleanupInteractableEvents();
            this.activeScanner = event.scanner;
            this.activeInteractable = event.interactableObject;
            this.activeScannerId = event.scannerId;
            if (this.activeScanner && this.activeInteractable) {
                // Find cameraCrop in scanner hierarchy
                this.activeCameraCrop = this.findCameraCropInScanner(this.activeScanner);
                if (this.activeCameraCrop) {
                    this.activeCameraCropTransform = this.activeCameraCrop.getTransform();
                    // Get the Interactable component from the interactable object
                    this.activeInteractableComponent = this.activeInteractable.getComponent(Interactable_1.Interactable.getTypeName());
                    if (this.activeInteractableComponent) {
                        this.setupInteractableEvents();
                        print("InteractableUVMapper: Tracking scanner " + this.activeScannerId);
                    }
                    else {
                        print("InteractableUVMapper: No Interactable component found");
                    }
                }
                else {
                    print("InteractableUVMapper: Could not find cameraCrop in scanner hierarchy");
                }
            }
            else {
                this.activeCameraCropTransform = null;
                this.activeCameraCrop = null;
                this.activeInteractableComponent = null;
                print("InteractableUVMapper: No active scanner");
            }
        }
        /**
         * Find the cameraCrop object within a scanner's hierarchy
         */
        findCameraCropInScanner(scanner) {
            if (!this.cameraCropPath) {
                return scanner;
            }
            const pathParts = this.cameraCropPath.split('/');
            let current = scanner;
            for (let part of pathParts) {
                let found = false;
                for (let i = 0; i < current.getChildrenCount(); i++) {
                    let child = current.getChild(i);
                    if (child.name === part) {
                        current = child;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    print("InteractableUVMapper: Could not find path part '" + part + "' in scanner hierarchy");
                    return null;
                }
            }
            return current;
        }
        setupInteractableEvents() {
            if (!this.activeInteractableComponent)
                return;
            // Hover Enter - Start tracking UV
            this.unsubscribeInteractable.push(this.activeInteractableComponent.onHoverEnter((e) => {
                if (!this.activeCameraCropTransform)
                    return;
                if (e.interactor && e.interactor.planecastPoint) {
                    const uv = this.worldToUV(e.interactor.planecastPoint);
                    this.currentUV = uv;
                    this.isHovering = true;
                    this.onHoverStartEvent.invoke(uv);
                    this.onUVChangedEvent.invoke(uv);
                    print("InteractableUVMapper: Hover started at UV: " + uv.toString());
                }
            }));
            // Hover Update - Continuously update UV while hovering
            this.unsubscribeInteractable.push(this.activeInteractableComponent.onHoverUpdate((e) => {
                if (!this.activeCameraCropTransform || !this.isHovering)
                    return;
                if (e.interactor && e.interactor.planecastPoint) {
                    const uv = this.worldToUV(e.interactor.planecastPoint);
                    this.currentUV = uv;
                    print("uv" + uv);
                    this.onUVChangedEvent.invoke(uv);
                }
            }));
            // Hover Exit - Stop tracking
            this.unsubscribeInteractable.push(this.activeInteractableComponent.onHoverExit(() => {
                if (this.isHovering) {
                    this.isHovering = false;
                    this.onHoverEndEvent.invoke();
                    print("InteractableUVMapper: Hover ended at UV: " + this.currentUV.toString());
                }
            }));
        }
        cleanupInteractableEvents() {
            this.unsubscribeInteractable.forEach(unsub => unsub());
            this.unsubscribeInteractable = [];
        }
        /**
         * Convert world position to UV coordinates on the active cameraCrop plane
         */
        worldToUV(worldPosition) {
            if (!this.activeCameraCropTransform) {
                return new vec2(0.5, 0.5);
            }
            const localPos = this.activeCameraCropTransform.getInvertedWorldTransform()
                .multiplyPoint(worldPosition);
            let uv = new vec2(localPos.x + 0.5, localPos.y + 0.5);
            if (this.clampToBounds) {
                uv = new vec2(Math.max(0.0, Math.min(1.0, uv.x)), Math.max(0.0, Math.min(1.0, uv.y)));
            }
            return uv;
        }
        // Public API
        getCurrentUV() {
            return this.currentUV;
        }
        isCurrentlyHovering() {
            return this.isHovering;
        }
        getActiveScanner() {
            return this.activeScanner;
        }
        getActiveInteractable() {
            return this.activeInteractable;
        }
        getActiveCameraCrop() {
            return this.activeCameraCrop;
        }
        getActiveScannerId() {
            return this.activeScannerId;
        }
    };
    __setFunctionName(_classThis, "InteractableUVMapper");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractableUVMapper = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractableUVMapper = _classThis;
})();
exports.InteractableUVMapper = InteractableUVMapper;
//# sourceMappingURL=InteractableUVMapper.js.map