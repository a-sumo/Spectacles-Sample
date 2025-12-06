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
exports.SelectionUVController = void 0;
var __selfType = requireType("./SelectionUVController");
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
const InteractionManager_1 = require("SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const OneEuroFilter_1 = require("SpectaclesInteractionKit.lspkg/Utils/OneEuroFilter");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
const TAG = "[SelectionUVController]";
const ONE_OVER_255 = 0.00392156862;
/**
 * Convert RGB values (0-255) to hex string
 */
function rgbToHex(r, g, b) {
    const toHex = (value) => {
        const hex = Math.round(value).toString(16).toUpperCase();
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}
/**
 * SelectionUVController
 *
 * Handles drag interaction on a mesh to update a material's selectionUV parameter.
 * Attach to any SceneObject with a RenderMeshVisual and collider.
 *
 * Refactored to use robust event handling patterns from InteractableManipulation.
 */
let SelectionUVController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SelectionUVController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.cameraCrop = this.cameraCrop;
            this.initialUV = this.initialUV;
            this.cursorPlane = this.cursorPlane;
            this.sampledColorText = this.sampledColorText;
            this.sampledColorObject = this.sampledColorObject;
            this.normalOffset = this.normalOffset;
            this.uvOffset = this.uvOffset;
            this.gridSize = this.gridSize;
            this.useFilter = this.useFilter;
            this.minCutoff = this.minCutoff;
            this.beta = this.beta;
            this.dcutoff = this.dcutoff;
            // Core references
            this.log = new NativeLogger_1.default(TAG);
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            this.interactable = null;
            this.collider = null;
            this.material = null;
            // State tracking
            this.isDragging = false;
            this.isHovered = false;
            this.selectionUV = new vec2(0.5, 0.5);
            // Interactor caching (pattern from MapManipulation)
            this.hoveringInteractor = null;
            this.triggeringInteractor = null;
            // Event cleanup tracking
            this.unsubscribeBag = [];
            // Filtering
            this.uvFilter = null;
            // Object transforms
            this.cameraCropTransform = null;
            this.cursorPlaneTransform = null;
            this.cursorPlaneOriginalScale = vec3.one();
            // Cursor plane material (for texture updates)
            this.cursorPlaneMaterial = null;
            this.sampledColorMaterial = null;
            this.validatedGridSize = 9;
            // Public events
            this.onSelectionChangedEvent = new Event_1.default();
            this.onSelectionChanged = this.onSelectionChangedEvent.publicApi();
            this.onDragStartEvent = new Event_1.default();
            this.onDragStart = this.onDragStartEvent.publicApi();
            this.onDragEndEvent = new Event_1.default();
            this.onDragEnd = this.onDragEndEvent.publicApi();
        }
        __initialize() {
            super.__initialize();
            this.cameraCrop = this.cameraCrop;
            this.initialUV = this.initialUV;
            this.cursorPlane = this.cursorPlane;
            this.sampledColorText = this.sampledColorText;
            this.sampledColorObject = this.sampledColorObject;
            this.normalOffset = this.normalOffset;
            this.uvOffset = this.uvOffset;
            this.gridSize = this.gridSize;
            this.useFilter = this.useFilter;
            this.minCutoff = this.minCutoff;
            this.beta = this.beta;
            this.dcutoff = this.dcutoff;
            // Core references
            this.log = new NativeLogger_1.default(TAG);
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            this.interactable = null;
            this.collider = null;
            this.material = null;
            // State tracking
            this.isDragging = false;
            this.isHovered = false;
            this.selectionUV = new vec2(0.5, 0.5);
            // Interactor caching (pattern from MapManipulation)
            this.hoveringInteractor = null;
            this.triggeringInteractor = null;
            // Event cleanup tracking
            this.unsubscribeBag = [];
            // Filtering
            this.uvFilter = null;
            // Object transforms
            this.cameraCropTransform = null;
            this.cursorPlaneTransform = null;
            this.cursorPlaneOriginalScale = vec3.one();
            // Cursor plane material (for texture updates)
            this.cursorPlaneMaterial = null;
            this.sampledColorMaterial = null;
            this.validatedGridSize = 9;
            // Public events
            this.onSelectionChangedEvent = new Event_1.default();
            this.onSelectionChanged = this.onSelectionChangedEvent.publicApi();
            this.onDragStartEvent = new Event_1.default();
            this.onDragStart = this.onDragStartEvent.publicApi();
            this.onDragEndEvent = new Event_1.default();
            this.onDragEnd = this.onDragEndEvent.publicApi();
        }
        // Public getters
        get currentlyDragging() { return this.isDragging; }
        get currentlyHovered() { return this.isHovered; }
        get currentSelectionUV() { return this.selectionUV; }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.onStart());
            this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
        }
        onStart() {
            this.transform = this.sceneObject.getTransform();
            // Validate grid size (must be odd)
            this.validatedGridSize = this.computeValidGridSize();
            // Setup camera crop
            if (!this.cameraCrop) {
                print("No CameraCrop object");
                return;
            }
            this.cameraCropTransform = this.cameraCrop.getTransform();
            const renderMesh = this.cameraCrop.getComponent("RenderMeshVisual");
            if (renderMesh) {
                this.material = renderMesh.mainPass;
            }
            else {
                this.log.w("No RenderMeshVisual found on camera crop");
            }
            // Setup components
            this.setupCollider();
            this.setupInteractable();
            this.setupFilter();
            // Setup cursor plane transform and material
            if (this.cursorPlane) {
                this.cursorPlaneTransform = this.cursorPlane.getTransform();
                this.cursorPlaneOriginalScale = this.cursorPlaneTransform.getLocalScale();
                const cursorRenderMesh = this.cursorPlane.getComponent("RenderMeshVisual");
                if (cursorRenderMesh) {
                    this.cursorPlaneMaterial = cursorRenderMesh.mainPass;
                    this.cursorPlaneMaterial.gridScale = this.validatedGridSize;
                }
            }
            // Setup sampled color object material
            if (this.sampledColorObject) {
                const colorRenderMesh = this.sampledColorObject.getComponent("RenderMeshVisual");
                if (colorRenderMesh) {
                    this.sampledColorMaterial = colorRenderMesh.mainPass;
                }
            }
            // Set initial UV
            this.updateSelectionUV(this.initialUV);
        }
        computeValidGridSize() {
            let size = Math.max(1, Math.floor(this.gridSize));
            if (size % 2 === 0) {
                size += 1; // Ensure odd number for center pixel
            }
            return size;
        }
        onDestroy() {
            // Clean up all event subscriptions (critical pattern from MapManipulation)
            this.unsubscribeBag.forEach((unsubscribeCallback) => {
                unsubscribeCallback();
            });
            this.unsubscribeBag = [];
        }
        setupCollider() {
            this.collider = this.sceneObject.getComponent("Physics.ColliderComponent");
            if (!this.collider) {
                this.collider = this.sceneObject.createComponent("Physics.ColliderComponent");
                this.collider.fitVisual = true;
                this.log.d("Created ColliderComponent with fitVisual");
            }
        }
        setupInteractable() {
            this.interactable = this.sceneObject.getComponent(Interactable_1.Interactable.getTypeName());
            if (!this.interactable) {
                this.interactable = this.sceneObject.createComponent(Interactable_1.Interactable.getTypeName());
                this.log.d("Created Interactable component");
            }
            this.interactable.allowMultipleInteractors = false;
            // Setup all event handlers with proper cleanup tracking
            this.setupHoverEvents();
            this.setupTriggerEvents();
        }
        setupHoverEvents() {
            (0, validate_1.validate)(this.interactable);
            // Hover Enter
            this.unsubscribeBag.push(this.interactable.onInteractorHoverEnter.add((event) => {
                if (event.propagationPhase === "Target" ||
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onHoverEnter(event);
                }
            }));
            // Hover Exit
            this.unsubscribeBag.push(this.interactable.onInteractorHoverExit.add((event) => {
                if (event.propagationPhase === "Target" ||
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onHoverExit(event);
                }
            }));
            // Hover Update
            this.unsubscribeBag.push(this.interactable.onHoverUpdate.add((event) => {
                if (event.propagationPhase === "Target" ||
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onHoverUpdate(event);
                }
            }));
        }
        setupTriggerEvents() {
            (0, validate_1.validate)(this.interactable);
            // Trigger Start
            this.unsubscribeBag.push(this.interactable.onInteractorTriggerStart.add((event) => {
                if (event.propagationPhase === "Target" ||
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerStart(event);
                }
            }));
            // Trigger Update
            this.unsubscribeBag.push(this.interactable.onTriggerUpdate.add((event) => {
                if (event.propagationPhase === "Target" ||
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerUpdate(event);
                }
            }));
            // Trigger End
            this.unsubscribeBag.push(this.interactable.onInteractorTriggerEnd.add((event) => {
                if (event.propagationPhase === "Target" ||
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerEnd(event);
                }
            }));
            // Trigger Canceled (important for robustness)
            this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add((event) => {
                if (event.propagationPhase === "Target" ||
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerEnd(event);
                }
            }));
        }
        setupFilter() {
            if (this.useFilter) {
                const filterConfig = {
                    frequency: 60,
                    minCutoff: this.minCutoff,
                    beta: this.beta,
                    dcutoff: this.dcutoff
                };
                this.uvFilter = new OneEuroFilter_1.OneEuroFilterVec2(filterConfig);
            }
        }
        // ==================== Event Handlers ====================
        onHoverEnter(event) {
            if (!this.enabled)
                return;
            this.hoveringInteractor = this.getHoveringInteractor();
            this.isHovered = true;
            this.log.d("Hover started");
        }
        onHoverExit(event) {
            if (!this.enabled)
                return;
            this.hoveringInteractor = null;
            this.isHovered = false;
            this.log.d("Hover ended");
        }
        onHoverUpdate(event) {
            if (!this.enabled || !this.hoveringInteractor)
                return;
            // Optional: track hover position if needed
            const hitPoint = this.hoveringInteractor.planecastPoint;
            if (hitPoint === null || hitPoint === undefined)
                return;
            // You could emit a hover UV event here if needed
        }
        onTriggerStart(event) {
            if (!this.enabled)
                return;
            // Cache the triggering interactor
            this.triggeringInteractor = this.getTriggeringInteractor();
            if (!this.triggeringInteractor) {
                this.log.w("No triggering interactor found on trigger start");
                return;
            }
            const hitPoint = this.triggeringInteractor.planecastPoint;
            if (hitPoint === null || hitPoint === undefined) {
                this.log.w("No planecast point available on trigger start");
                return;
            }
            const uv = this.worldToUV(hitPoint);
            if (!this.isWithinBounds(uv)) {
                this.log.d("Trigger start outside bounds, ignoring");
                return;
            }
            // Reset filter on new drag
            if (this.uvFilter) {
                this.uvFilter.reset();
            }
            this.isDragging = true;
            this.updateSelectionUV(uv);
            this.onDragStartEvent.invoke(this.selectionUV);
            this.log.d("Drag started at UV: " + uv.toString());
        }
        onTriggerUpdate(event) {
            if (!this.enabled || !this.isDragging)
                return;
            if (!this.triggeringInteractor) {
                this.triggeringInteractor = this.getTriggeringInteractor();
            }
            if (!this.triggeringInteractor)
                return;
            const hitPoint = this.triggeringInteractor.planecastPoint;
            if (hitPoint === null || hitPoint === undefined)
                return;
            let uv = this.worldToUV(hitPoint);
            // Clamp to bounds during drag (optional: you could also stop drag)
            uv = this.clampToBounds(uv);
            this.updateSelectionUV(uv);
        }
        onTriggerEnd(event) {
            if (!this.enabled)
                return;
            if (this.isDragging) {
                this.onDragEndEvent.invoke(this.selectionUV);
                this.log.d("Drag ended at UV: " + this.selectionUV.toString());
            }
            this.isDragging = false;
            this.triggeringInteractor = null;
        }
        // ==================== Interactor Retrieval (from MapManipulation) ====================
        getHoveringInteractor() {
            (0, validate_1.validate)(this.interactable);
            const interactors = this.interactionManager.getInteractorsByType(this.interactable.hoveringInteractor);
            if (interactors.length === 0) {
                return null;
            }
            return interactors[0];
        }
        getTriggeringInteractor() {
            (0, validate_1.validate)(this.interactable);
            const interactors = this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor);
            if (interactors.length === 0) {
                return null;
            }
            return interactors[0];
        }
        // ==================== UV Computation ====================
        worldToUV(worldPosition) {
            const localPos = this.transform.getInvertedWorldTransform().multiplyPoint(worldPosition);
            // Assuming the mesh is a unit plane centered at origin
            // Adjust these calculations based on your actual mesh dimensions
            return new vec2(localPos.x + 0.5, localPos.y + 0.5);
        }
        isWithinBounds(uv) {
            return uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
        }
        clampToBounds(uv) {
            return new vec2(Math.max(0.0, Math.min(1.0, uv.x)), Math.max(0.0, Math.min(1.0, uv.y)));
        }
        updateSelectionUV(uv) {
            // Apply filtering if enabled
            if (this.useFilter && this.uvFilter) {
                uv = this.uvFilter.filter(uv, getTime());
            }
            // Clamp final value
            this.selectionUV = this.clampToBounds(uv);
            // Update material
            if (this.material) {
                this.material.selectionUV = this.selectionUV;
            }
            // Update cursor plane position based on UV
            if (this.cursorPlaneTransform) {
                this.updateCursorPlane(this.selectionUV);
            }
            // Emit event
            this.onSelectionChangedEvent.invoke(this.selectionUV);
        }
        /**
         * Update cursor plane position, scale, and texture.
         */
        updateCursorPlane(uv) {
            if (!this.cursorPlaneTransform || !this.cameraCropTransform)
                return;
            // Get the world scale of the cameraCrop (the texture plane)
            const cameraCropScale = this.cameraCropTransform.getWorldScale();
            // Apply UV offset before converting to world position
            const offsetUV = new vec2(uv.x + this.uvOffset.x, uv.y + this.uvOffset.y);
            // Convert UV (0-1) to local position on the plane
            // UV (0.5, 0.5) = center = local (0, 0)
            // Use cameraCrop's world scale to determine actual plane dimensions
            const localX = (offsetUV.x - 0.5) * cameraCropScale.x;
            const localY = (offsetUV.y - 0.5) * cameraCropScale.y;
            const localPos = new vec3(localX, localY, 0);
            // Transform to world position using cameraCrop's rotation and position
            const worldRotation = this.cameraCropTransform.getWorldRotation();
            const worldPosition = this.cameraCropTransform.getWorldPosition();
            let cursorPosition = worldPosition.add(worldRotation.multiplyVec3(localPos));
            // Add normal offset along cameraCrop's forward direction
            const planeNormal = worldRotation.multiplyVec3(vec3.forward());
            cursorPosition = cursorPosition.add(planeNormal.uniformScale(this.normalOffset));
            // Set the cursor plane's world position (no filtering - instant follow)
            this.cursorPlaneTransform.setWorldPosition(cursorPosition);
            // Compensate cursor plane scale for cameraCrop's aspect ratio
            const aspectRatioCompensation = cameraCropScale.y / cameraCropScale.x;
            this.cursorPlaneTransform.setLocalScale(new vec3(this.cursorPlaneOriginalScale.x * aspectRatioCompensation, this.cursorPlaneOriginalScale.y, this.cursorPlaneOriginalScale.z));
            // Update cursor plane texture with sampled grid from source texture
            this.updateCursorPlaneTexture(uv);
        }
        // ==================== Texture Sampling ====================
        /**
         * Samples a gridSize x gridSize region from the source texture (cameraCrop's captureImage)
         * centered at the given UV and applies it to the cursor plane's material.
         * Also extracts the center pixel color for display.
         *
         * All texture operations are self-contained - no class-level texture state needed.
         */
        updateCursorPlaneTexture(uv) {
            if (!this.cursorPlaneMaterial || !this.material)
                return;
            // Get source texture fresh each frame from cameraCrop's material
            const sourceTexture = this.material.captureImage;
            if (!sourceTexture)
                return;
            const width = sourceTexture.getWidth();
            const height = sourceTexture.getHeight();
            if (width <= 0 || height <= 0)
                return;
            const gridSize = this.validatedGridSize;
            const halfGrid = Math.floor(gridSize / 2);
            // Convert UV to pixel coordinates
            const centerPixelX = Math.round(uv.x * (width - 1));
            const centerPixelY = Math.round(uv.y * (height - 1));
            // Clamp to ensure we don't sample outside texture bounds
            const startPixelX = Math.max(0, Math.min(width - gridSize, centerPixelX - halfGrid));
            const startPixelY = Math.max(0, Math.min(height - gridSize, centerPixelY - halfGrid));
            // Create procedural texture provider for pixel access
            const proceduralTexture = ProceduralTextureProvider.createFromTexture(sourceTexture);
            const sourceProvider = proceduralTexture.control;
            // Sample pixels from source texture
            const pixelBuffer = new Uint8Array(gridSize * gridSize * 4);
            sourceProvider.getPixels(startPixelX, startPixelY, gridSize, gridSize, pixelBuffer);
            // Create output texture and apply sampled pixels
            const sampledTexture = ProceduralTextureProvider.createWithFormat(gridSize, gridSize, TextureFormat.RGBA8Unorm);
            const outputProvider = sampledTexture.control;
            outputProvider.setPixels(0, 0, gridSize, gridSize, pixelBuffer);
            // Apply to cursor plane material
            this.cursorPlaneMaterial.mainTexture = sampledTexture;
            // Extract center pixel color and update sampled color display
            this.updateSampledColor(pixelBuffer, gridSize, halfGrid);
        }
        /**
         * Extracts the center pixel color from the sampled buffer and updates
         * the sampled color text and object material.
         */
        updateSampledColor(pixelBuffer, gridSize, halfGrid) {
            // Calculate center pixel index in the buffer
            // Center is at (halfGrid, halfGrid) in the grid
            const centerPixelIndex = (halfGrid * gridSize + halfGrid) * 4;
            // Extract RGBA values (0-255)
            const r = pixelBuffer[centerPixelIndex];
            const g = pixelBuffer[centerPixelIndex + 1];
            const b = pixelBuffer[centerPixelIndex + 2];
            const a = pixelBuffer[centerPixelIndex + 3];
            // Update text with hex code
            if (this.sampledColorText) {
                this.sampledColorText.text = rgbToHex(r, g, b);
            }
            // Update color object material
            if (this.sampledColorMaterial) {
                const sampledColor = new vec4(r * ONE_OVER_255, g * ONE_OVER_255, b * ONE_OVER_255, 1.0);
                this.sampledColorMaterial.mainColor = sampledColor;
            }
        }
        // ==================== Public API ====================
        /**
         * Programmatically set the selection UV position
         */
        setSelectionUV(uv) {
            if (this.uvFilter) {
                this.uvFilter.reset();
            }
            this.updateSelectionUV(uv);
        }
        /**
         * Programmatically set the cursor plane's world position
         */
        setCursorPlanePosition(worldPosition) {
            if (this.cursorPlaneTransform) {
                this.cursorPlaneTransform.setWorldPosition(worldPosition);
            }
        }
        /**
         * Reset selection to initial UV position
         */
        resetSelection() {
            this.setSelectionUV(this.initialUV);
        }
        /**
         * Enable or disable the controller
         */
        setEnabled(enabled) {
            this.enabled = enabled;
            if (!enabled && this.isDragging) {
                this.isDragging = false;
                this.triggeringInteractor = null;
                this.onDragEndEvent.invoke(this.selectionUV);
            }
        }
        /**
         * Get the validated grid size being used
         */
        getGridSize() {
            return this.validatedGridSize;
        }
    };
    __setFunctionName(_classThis, "SelectionUVController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SelectionUVController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SelectionUVController = _classThis;
})();
exports.SelectionUVController = SelectionUVController;
//# sourceMappingURL=SelectionUVController.js.map