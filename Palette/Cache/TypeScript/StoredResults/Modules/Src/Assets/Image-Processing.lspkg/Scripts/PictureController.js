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
exports.PictureController = exports.ActiveScannerEvent = void 0;
exports.makeTween = makeTween;
var __selfType = requireType("./PictureController");
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
const SIK_1 = require("SpectaclesInteractionKit.lspkg/SIK");
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const LensConfig_1 = require("SpectaclesInteractionKit.lspkg/Utils/LensConfig");
class ActiveScannerEvent {
    constructor(scanner, interactableObject, scannerId) {
        this.scanner = scanner;
        this.interactableObject = interactableObject;
        this.scannerId = scannerId;
    }
}
exports.ActiveScannerEvent = ActiveScannerEvent;
let PictureController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PictureController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.scannerPrefab = this.scannerPrefab;
            this.interactablePath = this.interactablePath;
            this.isEditor = global.deviceInfoSystem.isEditor();
            this.rightHand = SIK_1.SIK.HandInputData.getHand("right");
            this.leftHand = SIK_1.SIK.HandInputData.getHand("left");
            this.leftDown = false;
            this.rightDown = false;
            this.scannerInstances = [];
            this.scannerData = new Map();
            this.activeScanner = null;
            this.activeInteractable = null;
            this.activeScannerId = null;
            this.onActiveScannerChanged = new Event_1.default();
            this.leftPinchDown = () => {
                this.leftDown = true;
                if (this.rightDown && this.isPinchClose()) {
                    this.createScanner();
                }
            };
            this.leftPinchUp = () => {
                this.leftDown = false;
            };
            this.rightPinchDown = () => {
                this.rightDown = true;
                if (this.leftDown && this.isPinchClose()) {
                    this.createScanner();
                }
            };
            this.rightPinchUp = () => {
                this.rightDown = false;
            };
        }
        __initialize() {
            super.__initialize();
            this.scannerPrefab = this.scannerPrefab;
            this.interactablePath = this.interactablePath;
            this.isEditor = global.deviceInfoSystem.isEditor();
            this.rightHand = SIK_1.SIK.HandInputData.getHand("right");
            this.leftHand = SIK_1.SIK.HandInputData.getHand("left");
            this.leftDown = false;
            this.rightDown = false;
            this.scannerInstances = [];
            this.scannerData = new Map();
            this.activeScanner = null;
            this.activeInteractable = null;
            this.activeScannerId = null;
            this.onActiveScannerChanged = new Event_1.default();
            this.leftPinchDown = () => {
                this.leftDown = true;
                if (this.rightDown && this.isPinchClose()) {
                    this.createScanner();
                }
            };
            this.leftPinchUp = () => {
                this.leftDown = false;
            };
            this.rightPinchDown = () => {
                this.rightDown = true;
                if (this.leftDown && this.isPinchClose()) {
                    this.createScanner();
                }
            };
            this.rightPinchUp = () => {
                this.rightDown = false;
            };
        }
        onAwake() {
            PictureController.instance = this;
            this.rightHand.onPinchUp.add(this.rightPinchUp);
            this.rightHand.onPinchDown.add(this.rightPinchDown);
            this.leftHand.onPinchUp.add(this.leftPinchUp);
            this.leftHand.onPinchDown.add(this.leftPinchDown);
            if (this.isEditor) {
                // this.createEvent("TouchStartEvent").bind(this.editorTest.bind(this));
            }
            else {
                var obj = this.getSceneObject();
                if (obj && obj.getChildrenCount() > 0) {
                    obj.getChild(0).destroy();
                }
            }
            this.createEvent("UpdateEvent").bind(this.update.bind(this));
        }
        static getInstance() {
            return PictureController.instance;
        }
        generateUniqueId() {
            return (Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15));
        }
        /**
         * Check if a SceneObject is valid (not null and not destroyed)
         */
        isValidSceneObject(obj) {
            if (!obj)
                return false;
            try {
                // Accessing a property on a destroyed object will throw
                const _ = obj.name;
                return true;
            }
            catch (e) {
                return false;
            }
        }
        /**
         * Extract scanner ID from scanner name
         */
        extractScannerId(scanner) {
            if (!this.isValidSceneObject(scanner))
                return null;
            try {
                const name = scanner.name;
                if (!name)
                    return null;
                const idMatch = name.match(/Scanner_(\w+)/);
                if (!idMatch || !idMatch[1])
                    return null;
                return idMatch[1];
            }
            catch (e) {
                return null;
            }
        }
        /**
         * Clean up destroyed scanners from the instances array
         */
        cleanupDestroyedScanners() {
            const validScanners = [];
            const invalidIds = [];
            for (const scanner of this.scannerInstances) {
                if (this.isValidSceneObject(scanner)) {
                    validScanners.push(scanner);
                }
                else {
                    // Try to find and remove associated data
                    // Since we can't get the ID from a destroyed object, we'll need to check data validity separately
                }
            }
            // Also clean up scannerData entries that reference destroyed interactables
            for (const [scannerId, data] of this.scannerData.entries()) {
                // Check if this scanner still exists in our valid list
                const scannerExists = validScanners.some((s) => {
                    const id = this.extractScannerId(s);
                    return id === scannerId;
                });
                if (!scannerExists) {
                    invalidIds.push(scannerId);
                }
            }
            // Remove invalid data entries
            for (const id of invalidIds) {
                this.scannerData.delete(id);
            }
            this.scannerInstances = validScanners;
        }
        update() {
            // Periodically clean up destroyed scanners
            this.cleanupDestroyedScanners();
            let previousActiveScanner = this.activeScanner;
            this.activeScanner = null;
            this.activeInteractable = null;
            this.activeScannerId = null;
            for (let i = 0; i < this.scannerInstances.length; i++) {
                const scanner = this.scannerInstances[i];
                // Validate scanner
                if (!this.isValidSceneObject(scanner)) {
                    continue;
                }
                const scannerId = this.extractScannerId(scanner);
                if (!scannerId)
                    continue;
                const data = this.scannerData.get(scannerId);
                if (!data)
                    continue;
                const interactableObj = data.interactableObject;
                // Validate interactable object
                if (!this.isValidSceneObject(interactableObj)) {
                    // Update data to reflect destroyed interactable
                    data.interactableObject = null;
                    continue;
                }
                try {
                    const interactable = interactableObj.getComponent(Interactable_1.Interactable.getTypeName());
                    if (interactable &&
                        (interactable.hoveringInteractor || interactable.triggeringInteractor)) {
                        this.activeScanner = scanner;
                        this.activeInteractable = interactableObj;
                        this.activeScannerId = scannerId;
                        break;
                    }
                }
                catch (e) {
                    // Component access failed, skip this scanner
                    continue;
                }
            }
            // Only fire event if active scanner actually changed
            const activeChanged = previousActiveScanner !== this.activeScanner;
            const previousWasValid = this.isValidSceneObject(previousActiveScanner);
            const currentIsValid = this.isValidSceneObject(this.activeScanner);
            if (activeChanged || (previousWasValid !== currentIsValid)) {
                this.onActiveScannerChanged.invoke(new ActiveScannerEvent(this.activeScanner, this.activeInteractable, this.activeScannerId));
            }
        }
        findInteractableInScanner(scanner) {
            if (!this.isValidSceneObject(scanner))
                return null;
            if (!this.interactablePath)
                return scanner;
            const pathParts = this.interactablePath.split("/");
            let current = scanner;
            for (const part of pathParts) {
                if (!current || !this.isValidSceneObject(current)) {
                    return null;
                }
                let found = false;
                const childCount = current.getChildrenCount();
                for (let i = 0; i < childCount; i++) {
                    const child = current.getChild(i);
                    if (child && child.name === part) {
                        current = child;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    print("PictureController: Could not find path part '" + part + "'");
                    return null;
                }
            }
            return current;
        }
        getActiveScanner() {
            return this.isValidSceneObject(this.activeScanner) ? this.activeScanner : null;
        }
        getActiveInteractable() {
            return this.isValidSceneObject(this.activeInteractable) ? this.activeInteractable : null;
        }
        getActiveScannerId() {
            return this.activeScannerId;
        }
        getScannerData(scannerId) {
            return this.scannerData.get(scannerId);
        }
        getScannerCount() {
            this.cleanupDestroyedScanners();
            return this.scannerInstances.length;
        }
        getAllScannerIds() {
            this.cleanupDestroyedScanners();
            return Array.from(this.scannerData.keys());
        }
        editorTest() {
            this.createScanner();
        }
        isPinchClose() {
            try {
                const leftThumb = this.leftHand?.thumbTip?.position;
                const rightThumb = this.rightHand?.thumbTip?.position;
                if (!leftThumb || !rightThumb)
                    return false;
                return leftThumb.distance(rightThumb) < 10;
            }
            catch (e) {
                return false;
            }
        }
        createScanner() {
            if (!this.scannerPrefab) {
                print("PictureController: No scanner prefab assigned");
                return null;
            }
            const parent = this.getSceneObject();
            if (!this.isValidSceneObject(parent)) {
                print("PictureController: Invalid parent object");
                return null;
            }
            const scannerId = this.generateUniqueId();
            const scanner = this.scannerPrefab.instantiate(parent);
            if (!scanner) {
                print("PictureController: Failed to instantiate scanner");
                return null;
            }
            scanner.name = `Scanner_${scannerId}`;
            const interactableObj = this.findInteractableInScanner(scanner);
            this.scannerData.set(scannerId, {
                id: scannerId,
                creationTime: getTime(),
                interactableObject: interactableObj,
            });
            this.scannerInstances.push(scanner);
            print("Scanner created with ID: " +
                scannerId +
                " (Total: " +
                this.scannerInstances.length +
                ")");
            return scanner;
        }
        removeScanner(scannerId) {
            if (!scannerId)
                return false;
            const data = this.scannerData.get(scannerId);
            if (!data) {
                print("PictureController: Scanner not found: " + scannerId);
                return false;
            }
            // Find and destroy the scanner object
            for (const scanner of this.scannerInstances) {
                const id = this.extractScannerId(scanner);
                if (id === scannerId && this.isValidSceneObject(scanner)) {
                    try {
                        scanner.destroy();
                    }
                    catch (e) {
                        print("PictureController: Error destroying scanner: " + e);
                    }
                    break;
                }
            }
            // Remove from arrays
            this.scannerInstances = this.scannerInstances.filter((scanner) => {
                const id = this.extractScannerId(scanner);
                return id !== scannerId;
            });
            this.scannerData.delete(scannerId);
            // Clear active scanner if it was removed
            if (this.activeScannerId === scannerId) {
                this.activeScanner = null;
                this.activeInteractable = null;
                this.activeScannerId = null;
                this.onActiveScannerChanged.invoke(new ActiveScannerEvent(null, null, null));
            }
            print("Scanner removed: " + scannerId + " (Remaining: " + this.scannerInstances.length + ")");
            return true;
        }
        arrangeScannersInGrid(centerPosition = new vec3(0, 0, 0), spacing = 10) {
            this.cleanupDestroyedScanners();
            const nodeCount = this.scannerInstances.length;
            if (nodeCount === 0)
                return;
            // Calculate grid dimensions (roughly square)
            const cols = Math.ceil(Math.sqrt(nodeCount));
            const rows = Math.ceil(nodeCount / cols);
            // Calculate starting position to center the grid
            const startX = centerPosition.x - ((cols - 1) * spacing) / 2;
            const startY = centerPosition.z - ((rows - 1) * spacing) / 2;
            for (let i = 0; i < nodeCount; i++) {
                const scanner = this.scannerInstances[i];
                if (!this.isValidSceneObject(scanner))
                    continue;
                const row = Math.floor(i / cols);
                const col = i % cols;
                const x = startX + col * spacing;
                const y = startY + row * spacing;
                const z = centerPosition.y;
                try {
                    const transform = scanner.getTransform();
                    if (transform) {
                        transform.setWorldPosition(new vec3(x, y, z));
                    }
                }
                catch (e) {
                    print("PictureController: Error positioning scanner: " + e);
                }
            }
            print("Arranged " + nodeCount + " scanners in " + rows + "x" + cols + " grid");
        }
    };
    __setFunctionName(_classThis, "PictureController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PictureController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.instance = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PictureController = _classThis;
})();
exports.PictureController = PictureController;
// |Time| Will call a callback function every frame for a set duration with a number increasing from 0 to 1.
function makeTween(callback, duration) {
    const updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
    const lateUpdateEvent = updateDispatcher.createLateUpdateEvent("Tween");
    const startTime = getTime();
    let hasRemovedEvent = false;
    lateUpdateEvent.bind(() => {
        if (getTime() > startTime + duration) {
            hasRemovedEvent = true;
            updateDispatcher.removeEvent(lateUpdateEvent);
            callback(1);
        }
        else {
            callback((getTime() - startTime) / duration);
        }
    });
    // Create a Cancelation function to stop this animation at any time
    function cancel() {
        if (!hasRemovedEvent) {
            hasRemovedEvent = true;
            updateDispatcher.removeEvent(lateUpdateEvent);
        }
    }
    return cancel;
}
//# sourceMappingURL=PictureController.js.map