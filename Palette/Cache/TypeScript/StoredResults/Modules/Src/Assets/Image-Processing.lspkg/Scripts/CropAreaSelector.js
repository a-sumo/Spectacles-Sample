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
exports.CropAreaSelector = void 0;
var __selfType = requireType("./CropAreaSelector");
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
const ONE_OVER_255 = 0.00392156862;
/**
 * CropAreaSelector
 *
 * Allows users to capture a snapshot of a screen texture and select a crop region.
 *
 * Workflow:
 * 1. User pinches snapshot button to capture current screen state
 * 2. The captured snapshot is displayed on this SceneObject's mesh
 * 3. User drags on the snapshot to select a crop region
 * 4. The cropped pixels are displayed on cropAreaMesh with grid overlay
 * 5. Center pixel color is shown on selectedPixelMesh
 */
let CropAreaSelector = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CropAreaSelector = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.gridScale = this.gridScale;
            this.screenCropTexture = this.screenCropTexture;
            this.cropAreaMesh = this.cropAreaMesh;
            this.selectedPixelMesh = this.selectedPixelMesh;
            this.snapshotButton = this.snapshotButton;
            // Texture providers and materials
            this.screenCropProvider = null;
            this.snapshotMaterial = null;
            this.cropAreaMaterial = null;
            this.selectedColorMaterial = null;
            // Texture dimensions
            this.screenCropWidth = 0;
            this.screenCropHeight = 0;
            // Validated grid scale
            this._validatedGridScale = 9;
            // Interaction state
            this._isHovered = false;
            this._isDragging = false;
            this._currentHitInfo = null;
            this._currentInteractor = null;
            this._isTextureReady = false;
            // Events
            this._onHoverStartEvent = new Event_1.default();
            this.onHoverStart = this._onHoverStartEvent.publicApi();
            this._onHoverUpdateEvent = new Event_1.default();
            this.onHoverUpdate = this._onHoverUpdateEvent.publicApi();
            this._onHoverEndEvent = new Event_1.default();
            this.onHoverEnd = this._onHoverEndEvent.publicApi();
            this._onCropAreaChangedEvent = new Event_1.default();
            this.onCropAreaChanged = this._onCropAreaChangedEvent.publicApi();
            this._onSnapshotTakenEvent = new Event_1.default();
            this.onSnapshotTaken = this._onSnapshotTakenEvent.publicApi();
        }
        __initialize() {
            super.__initialize();
            this.gridScale = this.gridScale;
            this.screenCropTexture = this.screenCropTexture;
            this.cropAreaMesh = this.cropAreaMesh;
            this.selectedPixelMesh = this.selectedPixelMesh;
            this.snapshotButton = this.snapshotButton;
            // Texture providers and materials
            this.screenCropProvider = null;
            this.snapshotMaterial = null;
            this.cropAreaMaterial = null;
            this.selectedColorMaterial = null;
            // Texture dimensions
            this.screenCropWidth = 0;
            this.screenCropHeight = 0;
            // Validated grid scale
            this._validatedGridScale = 9;
            // Interaction state
            this._isHovered = false;
            this._isDragging = false;
            this._currentHitInfo = null;
            this._currentInteractor = null;
            this._isTextureReady = false;
            // Events
            this._onHoverStartEvent = new Event_1.default();
            this.onHoverStart = this._onHoverStartEvent.publicApi();
            this._onHoverUpdateEvent = new Event_1.default();
            this.onHoverUpdate = this._onHoverUpdateEvent.publicApi();
            this._onHoverEndEvent = new Event_1.default();
            this.onHoverEnd = this._onHoverEndEvent.publicApi();
            this._onCropAreaChangedEvent = new Event_1.default();
            this.onCropAreaChanged = this._onCropAreaChangedEvent.publicApi();
            this._onSnapshotTakenEvent = new Event_1.default();
            this.onSnapshotTaken = this._onSnapshotTakenEvent.publicApi();
        }
        // Public getters
        get isHovered() { return this._isHovered; }
        get isDragging() { return this._isDragging; }
        get currentHitInfo() { return this._currentHitInfo; }
        get currentInteractor() { return this._currentInteractor; }
        get validatedGridScale() { return this._validatedGridScale; }
        get isTextureReady() { return this._isTextureReady; }
        onAwake() {
            this._validatedGridScale = this.computeValidGridScale();
            this.createEvent("OnStartEvent").bind(() => this.initialize());
        }
        computeValidGridScale() {
            let scale = Math.max(1, Math.floor(this.gridScale));
            if (scale % 2 === 0) {
                scale += 1;
            }
            return scale;
        }
        initialize() {
            this._transform = this.sceneObject.getTransform();
            this.cacheMaterialReferences();
            this.setupCollider();
            this.setupInteractable();
            this.setupSnapshotButton();
            this.createEvent("OnDestroyEvent").bind(() => this.cleanup());
            print("CropAreaSelector: Initialized, awaiting snapshot capture");
        }
        cacheMaterialReferences() {
            this.snapshotMaterial = this.sceneObject.getComponent("RenderMeshVisual").mainPass;
            this.cropAreaMaterial = this.cropAreaMesh.getComponent("RenderMeshVisual").mainPass;
            this.selectedColorMaterial = this.selectedPixelMesh.getComponent("RenderMeshVisual").mainPass;
            this.cropAreaMaterial.gridScale = this._validatedGridScale;
        }
        setupSnapshotButton() {
            if (!this.snapshotButton) {
                print("CropAreaSelector: Warning - No snapshot button assigned");
                return;
            }
            this.snapshotButton.onButtonPinched.add(() => {
                this.takeSnapshot();
            });
            print("CropAreaSelector: Snapshot button configured");
        }
        /**
         * Captures the current state of screenCropTexture as a static snapshot.
         * Updates this SceneObject's mesh with the captured image.
         */
        takeSnapshot() {
            if (!this.screenCropTexture) {
                print("CropAreaSelector: Error - No screen crop texture assigned");
                return;
            }
            const colorspace = this.screenCropTexture.getColorspace();
            const width = this.screenCropTexture.getWidth();
            const height = this.screenCropTexture.getHeight();
            if (colorspace !== 3 || width <= 0 || height <= 0) {
                print("CropAreaSelector: Warning - Texture not ready (colorspace: " + colorspace + ", size: " + width + "x" + height + ")");
                return;
            }
            // Create procedural texture from current screen state
            const proceduralTexture = ProceduralTextureProvider.createFromTexture(this.screenCropTexture);
            this.screenCropProvider = proceduralTexture.control;
            this.screenCropWidth = width;
            this.screenCropHeight = height;
            // Update snapshot display on this SceneObject's mesh
            this.updateSnapshotDisplay(proceduralTexture);
            this._isTextureReady = true;
            // Initialize crop area at center
            const position = this._currentHitInfo?.localPosition ?? new vec2(0, 0);
            this.updateCropArea(position);
            this._onSnapshotTakenEvent.invoke();
            print("CropAreaSelector: Snapshot captured (" + width + "x" + height + ")");
        }
        updateSnapshotDisplay(proceduralTexture) {
            this.snapshotMaterial.baseTex = proceduralTexture;
        }
        setupCollider() {
            this._collider = this.sceneObject.getComponent("Physics.ColliderComponent");
            if (!this._collider) {
                this._collider = this.sceneObject.createComponent("Physics.ColliderComponent");
                this._collider.fitVisual = true;
            }
        }
        setupInteractable() {
            this._interactable = this.sceneObject.getComponent(Interactable_1.Interactable.getTypeName());
            if (!this._interactable) {
                this._interactable = this.sceneObject.createComponent(Interactable_1.Interactable.getTypeName());
            }
            this._interactable.allowMultipleInteractors = false;
            this._interactable.onHoverEnter((e) => {
                this._isHovered = true;
                this._currentInteractor = e.interactor;
                const hitInfo = this.computeHitPosition(e.interactor);
                this._currentHitInfo = hitInfo;
                this._onHoverStartEvent.invoke(hitInfo);
            });
            this._interactable.onHoverUpdate((e) => {
                if (!e.interactor.targetHitInfo) {
                    return;
                }
                const hitInfo = this.computeHitPosition(e.interactor);
                if (!this.isWithinBounds(hitInfo.localPosition)) {
                    return;
                }
                this._currentHitInfo = hitInfo;
                this._onHoverUpdateEvent.invoke(hitInfo);
            });
            this._interactable.onHoverExit(() => {
                this._isHovered = false;
                this._currentInteractor = null;
                this._currentHitInfo = null;
                this._onHoverEndEvent.invoke();
            });
            this._interactable.onDragStart((e) => {
                if (!this._isTextureReady) {
                    print("CropAreaSelector: Snapshot required before selecting crop area");
                    return;
                }
                if (!e.interactor.targetHitInfo) {
                    return;
                }
                const hitInfo = this.computeHitPosition(e.interactor);
                if (!this.isWithinBounds(hitInfo.localPosition)) {
                    return;
                }
                this._isDragging = true;
                this._currentHitInfo = hitInfo;
                this.updateCropArea(hitInfo.localPosition);
            });
            this._interactable.onDragUpdate((e) => {
                if (!this._isDragging || !this._isTextureReady) {
                    return;
                }
                if (!e.interactor.targetHitInfo) {
                    return;
                }
                const hitInfo = this.computeHitPosition(e.interactor);
                if (!this.isWithinBounds(hitInfo.localPosition)) {
                    return;
                }
                this._currentHitInfo = hitInfo;
                this.updateCropArea(hitInfo.localPosition);
            });
            this._interactable.onDragEnd(() => {
                this._isDragging = false;
            });
        }
        isWithinBounds(localPosition) {
            return (localPosition.x >= -0.5 &&
                localPosition.x <= 0.5 &&
                localPosition.y >= -0.5 &&
                localPosition.y <= 0.5);
        }
        updateCropArea(localPosition) {
            if (!this.screenCropProvider || !this.cropAreaMaterial) {
                return;
            }
            const gridSize = this._validatedGridScale;
            const halfGrid = Math.floor(gridSize / 2);
            const centerPixel = this.localToPixelCoords(localPosition);
            const startPixel = this.clampCropRegion(centerPixel, gridSize, halfGrid);
            const croppedPixels = this.sampleCroppedPixels(startPixel, gridSize);
            this.updateCropAreaTexture(croppedPixels, gridSize);
            this.updateSelectedColor(croppedPixels, gridSize, halfGrid);
            this.resetSelectionToCenter();
            this._onCropAreaChangedEvent.invoke();
        }
        localToPixelCoords(localPosition) {
            return new vec2(Math.round((localPosition.x + 0.5) * (this.screenCropWidth - 1)), Math.round((localPosition.y + 0.5) * (this.screenCropHeight - 1)));
        }
        clampCropRegion(centerPixel, gridSize, halfGrid) {
            return new vec2(Math.max(0, Math.min(this.screenCropWidth - gridSize, centerPixel.x - halfGrid)), Math.max(0, Math.min(this.screenCropHeight - gridSize, centerPixel.y - halfGrid)));
        }
        sampleCroppedPixels(startPixel, gridSize) {
            const pixelBuffer = new Uint8Array(gridSize * gridSize * 4);
            this.screenCropProvider.getPixels(startPixel.x, startPixel.y, gridSize, gridSize, pixelBuffer);
            return pixelBuffer;
        }
        updateCropAreaTexture(croppedPixels, gridSize) {
            const cropAreaTexture = ProceduralTextureProvider.createWithFormat(gridSize, gridSize, TextureFormat.RGBA8Unorm);
            const texProvider = cropAreaTexture.control;
            texProvider.setPixels(0, 0, gridSize, gridSize, croppedPixels);
            this.cropAreaMaterial.mainTexture = cropAreaTexture;
        }
        updateSelectedColor(croppedPixels, gridSize, halfGrid) {
            const centerPixelIndex = halfGrid * gridSize + halfGrid;
            const i = centerPixelIndex * 4;
            const color = new vec4(croppedPixels[i] * ONE_OVER_255, croppedPixels[i + 1] * ONE_OVER_255, croppedPixels[i + 2] * ONE_OVER_255, 1.0);
            this.selectedColorMaterial.baseColor = color;
        }
        resetSelectionToCenter() {
            const gridSize = this._validatedGridScale;
            const centerCell = Math.floor(gridSize / 2);
            const centerUV = new vec2((centerCell + 0.5) / gridSize, (centerCell + 0.5) / gridSize);
            this.cropAreaMaterial.selectionUV = centerUV;
        }
        computeHitPosition(interactor) {
            const worldPosition = interactor.targetHitInfo?.hit?.position ?? vec3.zero();
            const invertedWorldTransform = this._transform.getInvertedWorldTransform();
            const localPos = invertedWorldTransform.multiplyPoint(worldPosition);
            return {
                localPosition: new vec2(localPos.x, localPos.y),
                normalizedPosition: new vec2(localPos.x * 2, localPos.y * 2),
                worldPosition: worldPosition,
            };
        }
        cleanup() {
            if (this._interactable) {
                this._interactable.destroy();
            }
        }
    };
    __setFunctionName(_classThis, "CropAreaSelector");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CropAreaSelector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CropAreaSelector = _classThis;
})();
exports.CropAreaSelector = CropAreaSelector;
//# sourceMappingURL=CropAreaSelector.js.map