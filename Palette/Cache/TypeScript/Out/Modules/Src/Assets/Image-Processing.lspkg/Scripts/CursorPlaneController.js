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
exports.CursorPlaneController = exports.ColorSampledEvent = void 0;
var __selfType = requireType("./CursorPlaneController");
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
const PictureController_1 = require("./PictureController");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
/**
 * Event data for when a color is sampled via touch/trigger
 */
class ColorSampledEvent {
    constructor(color, hex, scannerId, uv) {
        this.color = color;
        this.hex = hex;
        this.scannerId = scannerId;
        this.uv = uv;
    }
}
exports.ColorSampledEvent = ColorSampledEvent;
/**
 * CursorPlaneController
 *
 * Manages a single cursor plane in the scene that tracks hover interactions
 * on active scanners. The cursor plane is a regular SceneObject (not prefab)
 * that gets repositioned when users interact with scanner cameraCrops.
 */
let CursorPlaneController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CursorPlaneController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.cursorPlane = this.cursorPlane;
            this.regionHoverPlane = this.regionHoverPlane;
            this.sampledColorText = this.sampledColorText;
            this.sampleColorIndicator = this.sampleColorIndicator;
            this.sampleRegionIndicator = this.sampleRegionIndicator;
            this.defaultGridSize = this.defaultGridSize;
            this.cameraCropPath = this.cameraCropPath;
            this.paletteController = this.paletteController;
            this.gridSizeSlider = this.gridSizeSlider;
            this.gridSizeText = this.gridSizeText;
            this.minGridSize = this.minGridSize;
            this.maxGridSize = this.maxGridSize;
            // State
            this.pictureController = null;
            this.activeScanner = null;
            this.activeInteractable = null;
            this.activeCameraCrop = null;
            this.activeCameraCropTransform = null;
            this.activeCameraCropMaterial = null;
            this.regionHoverPlaneTransform = null;
            // Material references
            this.sampleRegionMaterial = null;
            this.sampledColorMaterial = null;
            // Validated grid size
            this.validatedGridSize = 9;
            // Event cleanup
            this.unsubscribeInteractable = [];
            this.unsubscribeScannerChanged = null;
            // Reusable textures to avoid per-frame allocations
            this.sampledTexture = null;
            this.sampledTextureProvider = null;
            this.pixelBuffer = null;
            // Current sampled color state (updated on hover)
            this.currentSampledColor = new vec4(0, 0, 0, 1);
            this.currentSampledHex = "#000000";
            this.currentSampledUV = new vec2(0.5, 0.5);
            this.activeScannerId = null;
            // Public event for color sampling
            this.onColorSampledEvent = new Event_1.default();
            this.onColorSampled = this.onColorSampledEvent.publicApi();
            // Slider reference
            this.sliderComponent = null;
        }
        __initialize() {
            super.__initialize();
            this.cursorPlane = this.cursorPlane;
            this.regionHoverPlane = this.regionHoverPlane;
            this.sampledColorText = this.sampledColorText;
            this.sampleColorIndicator = this.sampleColorIndicator;
            this.sampleRegionIndicator = this.sampleRegionIndicator;
            this.defaultGridSize = this.defaultGridSize;
            this.cameraCropPath = this.cameraCropPath;
            this.paletteController = this.paletteController;
            this.gridSizeSlider = this.gridSizeSlider;
            this.gridSizeText = this.gridSizeText;
            this.minGridSize = this.minGridSize;
            this.maxGridSize = this.maxGridSize;
            // State
            this.pictureController = null;
            this.activeScanner = null;
            this.activeInteractable = null;
            this.activeCameraCrop = null;
            this.activeCameraCropTransform = null;
            this.activeCameraCropMaterial = null;
            this.regionHoverPlaneTransform = null;
            // Material references
            this.sampleRegionMaterial = null;
            this.sampledColorMaterial = null;
            // Validated grid size
            this.validatedGridSize = 9;
            // Event cleanup
            this.unsubscribeInteractable = [];
            this.unsubscribeScannerChanged = null;
            // Reusable textures to avoid per-frame allocations
            this.sampledTexture = null;
            this.sampledTextureProvider = null;
            this.pixelBuffer = null;
            // Current sampled color state (updated on hover)
            this.currentSampledColor = new vec4(0, 0, 0, 1);
            this.currentSampledHex = "#000000";
            this.currentSampledUV = new vec2(0.5, 0.5);
            this.activeScannerId = null;
            // Public event for color sampling
            this.onColorSampledEvent = new Event_1.default();
            this.onColorSampled = this.onColorSampledEvent.publicApi();
            // Slider reference
            this.sliderComponent = null;
        }
        onAwake() {
            if (!this.cursorPlane) {
                print("CursorPlaneController: Error - No cursor plane assigned");
                return;
            }
            this.cursorPlaneTransform = this.cursorPlane.getTransform();
            if (this.regionHoverPlane) {
                this.regionHoverPlaneTransform = this.regionHoverPlane.getTransform();
            }
            // Get PictureController via singleton
            this.pictureController = PictureController_1.PictureController.getInstance();
            if (!this.pictureController) {
                print("CursorPlaneController: PictureController singleton not found");
                return;
            }
            // Validate grid size
            this.validatedGridSize = this.computeValidGridSize();
            // Pre-allocate reusable resources
            this.initializeReusableResources();
            // Setup materials
            this.setupMaterials();
            // Subscribe to active scanner changes (store unsubscribe function)
            const callback = this.onActiveScannerChanged.bind(this);
            this.pictureController.onActiveScannerChanged.add(callback);
            this.unsubscribeScannerChanged = () => {
                this.pictureController?.onActiveScannerChanged.remove(callback);
            };
            // Subscribe to color sampled events to update palette
            if (this.paletteController) {
                this.onColorSampled.add((event) => {
                    this.paletteController.setActiveItemColor(event.color);
                });
            }
            // Setup grid size slider (deferred to OnStartEvent to ensure Slider is initialized)
            this.createEvent("OnStartEvent").bind(() => {
                this.setupGridSizeSlider();
            });
            // Hide planes initially (move far away)
            this.hidePlanes();
            // Register destroy event for cleanup
            this.createEvent("OnDestroyEvent").bind(this.onDestroy.bind(this));
            print("CursorPlaneController: Initialized");
        }
        initializeReusableResources() {
            const gridSize = this.validatedGridSize;
            // Pre-allocate pixel buffer
            this.pixelBuffer = new Uint8Array(gridSize * gridSize * 4);
            // Pre-allocate output texture
            this.sampledTexture = ProceduralTextureProvider.createWithFormat(gridSize, gridSize, TextureFormat.RGBA8Unorm);
            this.sampledTextureProvider = this.sampledTexture.control;
        }
        computeValidGridSize() {
            let size = Math.max(this.minGridSize, Math.min(this.maxGridSize, Math.floor(this.defaultGridSize)));
            if (size % 2 === 0) {
                size += 1;
            }
            return size;
        }
        setupGridSizeSlider() {
            if (!this.gridSizeSlider) {
                // No slider - just update text with current value
                this.updateGridSizeText();
                return;
            }
            // Find Slider component
            this.sliderComponent = this.gridSizeSlider.getComponent("Component.ScriptComponent");
            if (!this.sliderComponent) {
                // Try to find in children
                for (let i = 0; i < this.gridSizeSlider.getChildrenCount(); i++) {
                    const child = this.gridSizeSlider.getChild(i);
                    this.sliderComponent = child.getComponent("Component.ScriptComponent");
                    if (this.sliderComponent && typeof this.sliderComponent.currentValue !== 'undefined') {
                        break;
                    }
                }
            }
            if (!this.sliderComponent) {
                print("CursorPlaneController: No Slider component found on gridSizeSlider");
                this.updateGridSizeText();
                return;
            }
            // Use slider's current value as the source of truth
            // This allows the slider's default value (set in Inspector) to override defaultGridSize
            const sliderValue = this.sliderComponent.currentValue;
            const gridSizeFromSlider = this.sliderValueToGridSize(sliderValue);
            // Update our grid size to match slider (if different)
            if (gridSizeFromSlider !== this.validatedGridSize) {
                this.setGridSize(gridSizeFromSlider);
            }
            // Update text display
            this.updateGridSizeText();
            // Subscribe to slider value changes
            this.sliderComponent.onValueChange.add((value) => {
                const newGridSize = this.sliderValueToGridSize(value);
                this.setGridSize(newGridSize);
            });
            print(`CursorPlaneController: Grid size slider initialized (${this.minGridSize}-${this.maxGridSize}), current: ${this.validatedGridSize}`);
        }
        gridSizeToSliderValue(gridSize) {
            // Map grid size to 0-1 range
            return (gridSize - this.minGridSize) / (this.maxGridSize - this.minGridSize);
        }
        sliderValueToGridSize(sliderValue) {
            // Map 0-1 to grid size range, ensuring odd number
            const rawSize = this.minGridSize + sliderValue * (this.maxGridSize - this.minGridSize);
            let size = Math.round(rawSize);
            if (size % 2 === 0) {
                size += 1; // Ensure odd
            }
            return Math.max(this.minGridSize, Math.min(this.maxGridSize, size));
        }
        updateGridSizeText() {
            if (this.gridSizeText) {
                this.gridSizeText.text = `Grid Size: ${this.validatedGridSize}`;
            }
        }
        /**
         * Set the grid size for texture sampling
         */
        setGridSize(newSize) {
            // Validate and ensure odd
            let size = Math.max(this.minGridSize, Math.min(this.maxGridSize, Math.floor(newSize)));
            if (size % 2 === 0) {
                size += 1;
            }
            if (size === this.validatedGridSize)
                return;
            this.validatedGridSize = size;
            // Reallocate resources for new size
            this.pixelBuffer = new Uint8Array(size * size * 4);
            this.sampledTexture = ProceduralTextureProvider.createWithFormat(size, size, TextureFormat.RGBA8Unorm);
            this.sampledTextureProvider = this.sampledTexture.control;
            // Update material
            if (this.sampleRegionMaterial) {
                this.sampleRegionMaterial.gridScale = size;
                this.sampleRegionMaterial.mainTexture = this.sampledTexture;
            }
            // Update text display
            this.updateGridSizeText();
            print(`CursorPlaneController: Grid size changed to ${size}x${size}`);
        }
        /**
         * Get the current grid size
         */
        getGridSize() {
            return this.validatedGridSize;
        }
        setupMaterials() {
            if (this.sampleRegionIndicator) {
                const renderMesh = this.sampleRegionIndicator.getComponent("RenderMeshVisual");
                if (renderMesh) {
                    this.sampleRegionMaterial = renderMesh.mainPass;
                    if (this.sampleRegionMaterial) {
                        this.sampleRegionMaterial.gridScale = this.validatedGridSize;
                        // Assign the pre-allocated texture
                        if (this.sampledTexture) {
                            this.sampleRegionMaterial.mainTexture = this.sampledTexture;
                        }
                    }
                }
            }
            if (this.sampleColorIndicator) {
                const renderMesh = this.sampleColorIndicator.getComponent("RenderMeshVisual");
                if (renderMesh) {
                    this.sampledColorMaterial = renderMesh.mainPass;
                }
            }
        }
        onActiveScannerChanged(event) {
            this.cleanupInteractableEvents();
            this.activeScanner = event.scanner;
            this.activeScannerId = event.scannerId;
            if (this.activeScanner && event.interactableObject) {
                this.activeCameraCrop = this.findCameraCropInScanner(this.activeScanner);
                if (this.activeCameraCrop) {
                    this.activeCameraCropTransform = this.activeCameraCrop.getTransform();
                    const renderMesh = this.activeCameraCrop.getComponent("RenderMeshVisual");
                    if (renderMesh) {
                        this.activeCameraCropMaterial = renderMesh.mainPass;
                    }
                    this.activeInteractable = event.interactableObject.getComponent(Interactable_1.Interactable.getTypeName());
                    if (this.activeInteractable) {
                        this.setupHoverEvents();
                        print("CursorPlaneController: Tracking scanner " + event.scannerId);
                    }
                }
            }
            else {
                this.hidePlanes();
                this.activeCameraCropTransform = null;
                this.activeCameraCropMaterial = null;
                this.activeCameraCrop = null;
                this.activeInteractable = null;
                this.activeScannerId = null;
            }
        }
        findCameraCropInScanner(scanner) {
            if (!this.cameraCropPath)
                return scanner;
            const pathParts = this.cameraCropPath.split("/");
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
                    print("CursorPlaneController: Could not find '" + part + "' in hierarchy");
                    return null;
                }
            }
            return current;
        }
        setupHoverEvents() {
            if (!this.activeInteractable)
                return;
            this.unsubscribeInteractable.push(this.activeInteractable.onHoverEnter((e) => {
                if (!e.interactor?.targetHitInfo || !this.activeCameraCropTransform)
                    return;
                const worldPosition = e.interactor.targetHitInfo.hit?.position ?? vec3.zero();
                this.updatePlanesAtWorldPosition(worldPosition);
            }));
            this.unsubscribeInteractable.push(this.activeInteractable.onHoverUpdate((e) => {
                if (!e.interactor?.targetHitInfo || !this.activeCameraCropTransform)
                    return;
                const worldPosition = e.interactor.targetHitInfo.hit?.position ?? vec3.zero();
                this.updatePlanesAtWorldPosition(worldPosition);
            }));
            this.unsubscribeInteractable.push(this.activeInteractable.onHoverExit(() => {
                this.hidePlanes();
            }));
            // Trigger/touch events - emit the sampled color
            this.unsubscribeInteractable.push(this.activeInteractable.onTriggerStart((e) => {
                this.emitColorSampledEvent();
            }));
            this.unsubscribeInteractable.push(this.activeInteractable.onTriggerEnd((e) => {
                // Optional: could emit on end as well if needed
            }));
        }
        cleanupInteractableEvents() {
            this.unsubscribeInteractable.forEach((unsub) => unsub());
            this.unsubscribeInteractable = [];
        }
        updatePlanesAtWorldPosition(worldPosition) {
            if (!this.activeCameraCropTransform)
                return;
            const uv = this.worldToUV(worldPosition);
            this.currentSampledUV = uv;
            // Position planes directly at the hit position
            this.positionPlanes(worldPosition);
            this.updateCursorPlaneTexture(uv);
        }
        worldToUV(worldPosition) {
            if (!this.activeCameraCropTransform)
                return new vec2(0.5, 0.5);
            const invertedWorldTransform = this.activeCameraCropTransform.getInvertedWorldTransform();
            const localPos = invertedWorldTransform.multiplyPoint(worldPosition);
            return new vec2(Math.max(0.0, Math.min(1.0, localPos.x + 0.5)), Math.max(0.0, Math.min(1.0, localPos.y + 0.5)));
        }
        positionPlanes(worldPosition) {
            if (!this.activeCameraCropTransform)
                return;
            const worldRotation = this.activeCameraCropTransform.getWorldRotation();
            // Position cursor plane directly at hit position
            this.cursorPlaneTransform.setWorldPosition(worldPosition);
            this.cursorPlaneTransform.setWorldRotation(worldRotation);
            // Position region hover plane at same position
            if (this.regionHoverPlaneTransform) {
                this.regionHoverPlaneTransform.setWorldPosition(worldPosition);
                this.regionHoverPlaneTransform.setWorldRotation(worldRotation);
            }
        }
        hidePlanes() {
            const hidePosition = new vec3(0, 1000, 0);
            this.cursorPlaneTransform.setWorldPosition(hidePosition);
            if (this.regionHoverPlaneTransform) {
                this.regionHoverPlaneTransform.setWorldPosition(hidePosition);
            }
        }
        updateCursorPlaneTexture(uv) {
            if (!this.sampledTextureProvider || !this.pixelBuffer || !this.activeCameraCropMaterial)
                return;
            const sourceTexture = this.activeCameraCropMaterial.captureImage;
            if (!sourceTexture)
                return;
            const width = sourceTexture.getWidth();
            const height = sourceTexture.getHeight();
            if (width <= 0 || height <= 0)
                return;
            const gridSize = this.validatedGridSize;
            const halfGrid = Math.floor(gridSize / 2);
            const centerPixelX = Math.round(uv.x * (width - 1));
            const centerPixelY = Math.round(uv.y * (height - 1));
            const startPixelX = Math.max(0, Math.min(width - gridSize, centerPixelX - halfGrid));
            const startPixelY = Math.max(0, Math.min(height - gridSize, centerPixelY - halfGrid));
            // Use the source texture's control directly if available, otherwise create temporary
            let sourceProvider;
            let tempTexture = null;
            if (sourceTexture.control && typeof sourceTexture.control.getPixels === 'function') {
                sourceProvider = sourceTexture.control;
            }
            else {
                // Create temporary procedural texture from source (unavoidable for non-procedural sources)
                tempTexture = ProceduralTextureProvider.createFromTexture(sourceTexture);
                sourceProvider = tempTexture.control;
            }
            // Read pixels into pre-allocated buffer
            sourceProvider.getPixels(startPixelX, startPixelY, gridSize, gridSize, this.pixelBuffer);
            // Write to pre-allocated output texture
            this.sampledTextureProvider.setPixels(0, 0, gridSize, gridSize, this.pixelBuffer);
            // Clean up temporary texture if created
            if (tempTexture) {
                // Note: Lens Studio may not have explicit texture destroy, but nulling helps GC
                tempTexture = null;
            }
            this.updateSampledColor(this.pixelBuffer, gridSize, halfGrid);
        }
        updateSampledColor(pixelBuffer, gridSize, halfGrid) {
            const ONE_OVER_255 = 0.00392156862;
            const centerPixelIndex = (halfGrid * gridSize + halfGrid) * 4;
            const r = pixelBuffer[centerPixelIndex];
            const g = pixelBuffer[centerPixelIndex + 1];
            const b = pixelBuffer[centerPixelIndex + 2];
            // Store current sampled color
            this.currentSampledColor = new vec4(r * ONE_OVER_255, g * ONE_OVER_255, b * ONE_OVER_255, 1.0);
            this.currentSampledHex = this.rgbToHex(r, g, b);
            if (this.sampledColorText) {
                this.sampledColorText.text = this.currentSampledHex;
            }
            if (this.sampledColorMaterial) {
                this.sampledColorMaterial.mainColor = this.currentSampledColor;
            }
        }
        emitColorSampledEvent() {
            const event = new ColorSampledEvent(this.currentSampledColor, this.currentSampledHex, this.activeScannerId, this.currentSampledUV);
            this.onColorSampledEvent.invoke(event);
            print(`CursorPlaneController: Color sampled ${this.currentSampledHex} from scanner ${this.activeScannerId}`);
        }
        /**
         * Get the currently sampled color (updated on hover)
         */
        getCurrentSampledColor() {
            return this.currentSampledColor;
        }
        /**
         * Get the currently sampled color as hex string
         */
        getCurrentSampledHex() {
            return this.currentSampledHex;
        }
        rgbToHex(r, g, b) {
            const toHex = (value) => {
                const hex = Math.round(value).toString(16).toUpperCase();
                return hex.length === 1 ? "0" + hex : hex;
            };
            return "#" + toHex(r) + toHex(g) + toHex(b);
        }
        onDestroy() {
            // Cleanup interactable event subscriptions
            this.cleanupInteractableEvents();
            // Cleanup PictureController subscription
            if (this.unsubscribeScannerChanged) {
                this.unsubscribeScannerChanged();
                this.unsubscribeScannerChanged = null;
            }
            // Clear references
            this.pictureController = null;
            this.activeScanner = null;
            this.activeInteractable = null;
            this.activeCameraCrop = null;
            this.activeCameraCropTransform = null;
            this.activeCameraCropMaterial = null;
            this.sampleRegionMaterial = null;
            this.sampledColorMaterial = null;
            this.sampledTexture = null;
            this.sampledTextureProvider = null;
            this.pixelBuffer = null;
            print("CursorPlaneController: Destroyed and cleaned up");
        }
    };
    __setFunctionName(_classThis, "CursorPlaneController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CursorPlaneController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CursorPlaneController = _classThis;
})();
exports.CursorPlaneController = CursorPlaneController;
//# sourceMappingURL=CursorPlaneController.js.map