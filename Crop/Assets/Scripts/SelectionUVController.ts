import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { InteractionManager } from "SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager";
import Event, { PublicApi, unsubscribe } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { OneEuroFilterConfig, OneEuroFilterVec2 } from "SpectaclesInteractionKit.lspkg/Utils/OneEuroFilter";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { validate } from "SpectaclesInteractionKit.lspkg/Utils/validate";

const TAG = "[SelectionUVController]";

/**
 * SelectionUVController
 * 
 * Handles drag interaction on a mesh to update a material's selectionUV parameter.
 * Attach to any SceneObject with a RenderMeshVisual and collider.
 * 
 * Refactored to use robust event handling patterns from InteractableManipulation.
 */
@component
export class SelectionUVController extends BaseScriptComponent {
    @input
    @hint("Main object with the material whose selectionUV will be updated. If not set, uses this SceneObject.")
    mainObject: SceneObject;

    @input
    @hint("Initial selection UV position")
    initialUV: vec2 = new vec2(0.5, 0.5);

    @input
    @hint("Cursor plane that follows the selection with normal offset. Will be scaled to match mainObject's aspect ratio.")
    cursorPlane: SceneObject;

    @input
    @hint("Offset distance along the plane's normal direction (positive = towards viewer)")
    normalOffset: number = 0.5;

    @input
    @hint("Additional offset in UV space (applied before world conversion)")
    uvOffset: vec2 = new vec2(0, 0);

    @input
    @hint("Grid size for cursor plane texture (odd number, e.g., 9 = 9x9 grid)")
    gridSize: number = 9;

    @input
    @hint("Apply filtering to smooth interaction")
    useFilter: boolean = true;

    @input
    @showIf("useFilter", true)
    @hint("Filter min cutoff - lower = smoother but more lag")
    minCutoff: number = 2;

    @input
    @showIf("useFilter", true)
    @hint("Filter beta - higher = less lag but more jitter")
    beta: number = 0.015;

    @input
    @showIf("useFilter", true)
    @hint("Filter derivative cutoff")
    dcutoff: number = 1;

    // Core references
    private log = new NativeLogger(TAG);
    private interactionManager = InteractionManager.getInstance();
    private transform: Transform;
    private interactable: Interactable | null = null;
    private collider: ColliderComponent | null = null;
    private material: any = null;

    // State tracking
    private isDragging: boolean = false;
    private isHovered: boolean = false;
    private selectionUV: vec2 = new vec2(0.5, 0.5);

    // Interactor caching (pattern from MapManipulation)
    private hoveringInteractor: Interactor | null = null;
    private triggeringInteractor: Interactor | null = null;

    // Event cleanup tracking
    private unsubscribeBag: unsubscribe[] = [];

    // Filtering
    private uvFilter: OneEuroFilterVec2 | null = null;

    // Object transforms
    private mainObjectTransform: Transform | null = null;
    private cursorPlaneTransform: Transform | null = null;
    private cursorPlaneOriginalScale: vec3 = vec3.one();

    // Cursor plane material (for texture updates)
    private cursorPlaneMaterial: any = null;
    private validatedGridSize: number = 9;

    // Public events
    private onSelectionChangedEvent = new Event<vec2>();
    readonly onSelectionChanged: PublicApi<vec2> = this.onSelectionChangedEvent.publicApi();

    private onDragStartEvent = new Event<vec2>();
    readonly onDragStart: PublicApi<vec2> = this.onDragStartEvent.publicApi();

    private onDragEndEvent = new Event<vec2>();
    readonly onDragEnd: PublicApi<vec2> = this.onDragEndEvent.publicApi();

    // Public getters
    get currentlyDragging(): boolean { return this.isDragging; }
    get currentlyHovered(): boolean { return this.isHovered; }
    get currentSelectionUV(): vec2 { return this.selectionUV; }

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
    }

    private onStart(): void {
        this.transform = this.sceneObject.getTransform();

        // Validate grid size (must be odd)
        this.validatedGridSize = this.computeValidGridSize();

        // Setup main object (the one with the material)
        const mainObj = this.mainObject ?? this.sceneObject;
        this.mainObjectTransform = mainObj.getTransform();
        
        const renderMesh = mainObj.getComponent("RenderMeshVisual");
        if (renderMesh) {
            this.material = renderMesh.mainPass;
        } else {
            this.log.w("No RenderMeshVisual found on main object");
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

        // Set initial UV
        this.updateSelectionUV(this.initialUV);
    }

    private computeValidGridSize(): number {
        let size = Math.max(1, Math.floor(this.gridSize));
        if (size % 2 === 0) {
            size += 1; // Ensure odd number for center pixel
        }
        return size;
    }

    private onDestroy(): void {
        // Clean up all event subscriptions (critical pattern from MapManipulation)
        this.unsubscribeBag.forEach((unsubscribeCallback: unsubscribe) => {
            unsubscribeCallback();
        });
        this.unsubscribeBag = [];
    }

    private setupCollider(): void {
        this.collider = this.sceneObject.getComponent("Physics.ColliderComponent");
        if (!this.collider) {
            this.collider = this.sceneObject.createComponent("Physics.ColliderComponent");
            this.collider.fitVisual = true;
            this.log.d("Created ColliderComponent with fitVisual");
        }
    }

    private setupInteractable(): void {
        this.interactable = this.sceneObject.getComponent(Interactable.getTypeName());
        if (!this.interactable) {
            this.interactable = this.sceneObject.createComponent(Interactable.getTypeName());
            this.log.d("Created Interactable component");
        }
        this.interactable.allowMultipleInteractors = false;

        // Setup all event handlers with proper cleanup tracking
        this.setupHoverEvents();
        this.setupTriggerEvents();
    }

    private setupHoverEvents(): void {
        validate(this.interactable);

        // Hover Enter
        this.unsubscribeBag.push(
            this.interactable.onInteractorHoverEnter.add((event: InteractorEvent) => {
                if (event.propagationPhase === "Target" || 
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onHoverEnter(event);
                }
            })
        );

        // Hover Exit
        this.unsubscribeBag.push(
            this.interactable.onInteractorHoverExit.add((event: InteractorEvent) => {
                if (event.propagationPhase === "Target" || 
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onHoverExit(event);
                }
            })
        );

        // Hover Update
        this.unsubscribeBag.push(
            this.interactable.onHoverUpdate.add((event: InteractorEvent) => {
                if (event.propagationPhase === "Target" || 
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onHoverUpdate(event);
                }
            })
        );
    }

    private setupTriggerEvents(): void {
        validate(this.interactable);

        // Trigger Start
        this.unsubscribeBag.push(
            this.interactable.onInteractorTriggerStart.add((event: InteractorEvent) => {
                if (event.propagationPhase === "Target" || 
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerStart(event);
                }
            })
        );

        // Trigger Update
        this.unsubscribeBag.push(
            this.interactable.onTriggerUpdate.add((event: InteractorEvent) => {
                if (event.propagationPhase === "Target" || 
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerUpdate(event);
                }
            })
        );

        // Trigger End
        this.unsubscribeBag.push(
            this.interactable.onInteractorTriggerEnd.add((event: InteractorEvent) => {
                if (event.propagationPhase === "Target" || 
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerEnd(event);
                }
            })
        );

        // Trigger Canceled (important for robustness)
        this.unsubscribeBag.push(
            this.interactable.onTriggerCanceled.add((event: InteractorEvent) => {
                if (event.propagationPhase === "Target" || 
                    event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerEnd(event);
                }
            })
        );
    }

    private setupFilter(): void {
        if (this.useFilter) {
            const filterConfig: OneEuroFilterConfig = {
                frequency: 60,
                minCutoff: this.minCutoff,
                beta: this.beta,
                dcutoff: this.dcutoff
            };
            this.uvFilter = new OneEuroFilterVec2(filterConfig);
        }
    }

    // ==================== Event Handlers ====================

    private onHoverEnter(event: InteractorEvent): void {
        if (!this.enabled) return;

        this.hoveringInteractor = this.getHoveringInteractor();
        this.isHovered = true;
        this.log.d("Hover started");
    }

    private onHoverExit(event: InteractorEvent): void {
        if (!this.enabled) return;

        this.hoveringInteractor = null;
        this.isHovered = false;
        this.log.d("Hover ended");
    }

    private onHoverUpdate(event: InteractorEvent): void {
        if (!this.enabled || !this.hoveringInteractor) return;

        // Optional: track hover position if needed
        const hitPoint = this.hoveringInteractor.planecastPoint;
        if (hitPoint === null || hitPoint === undefined) return;

        // You could emit a hover UV event here if needed
    }

    private onTriggerStart(event: InteractorEvent): void {
        if (!this.enabled) return;

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

    private onTriggerUpdate(event: InteractorEvent): void {
        if (!this.enabled || !this.isDragging) return;

        if (!this.triggeringInteractor) {
            this.triggeringInteractor = this.getTriggeringInteractor();
        }

        if (!this.triggeringInteractor) return;

        const hitPoint = this.triggeringInteractor.planecastPoint;
        if (hitPoint === null || hitPoint === undefined) return;

        let uv = this.worldToUV(hitPoint);

        // Clamp to bounds during drag (optional: you could also stop drag)
        uv = this.clampToBounds(uv);

        this.updateSelectionUV(uv);
    }

    private onTriggerEnd(event: InteractorEvent): void {
        if (!this.enabled) return;

        if (this.isDragging) {
            this.onDragEndEvent.invoke(this.selectionUV);
            this.log.d("Drag ended at UV: " + this.selectionUV.toString());
        }

        this.isDragging = false;
        this.triggeringInteractor = null;
    }

    // ==================== Interactor Retrieval (from MapManipulation) ====================

    private getHoveringInteractor(): Interactor | null {
        validate(this.interactable);

        const interactors: Interactor[] = this.interactionManager.getInteractorsByType(
            this.interactable.hoveringInteractor
        );

        if (interactors.length === 0) {
            return null;
        }

        return interactors[0];
    }

    private getTriggeringInteractor(): Interactor | null {
        validate(this.interactable);

        const interactors: Interactor[] = this.interactionManager.getInteractorsByType(
            this.interactable.triggeringInteractor
        );

        if (interactors.length === 0) {
            return null;
        }

        return interactors[0];
    }

    // ==================== UV Computation ====================

    private worldToUV(worldPosition: vec3): vec2 {
        const localPos = this.transform.getInvertedWorldTransform().multiplyPoint(worldPosition);
        // Assuming the mesh is a unit plane centered at origin
        // Adjust these calculations based on your actual mesh dimensions
        return new vec2(localPos.x + 0.5, localPos.y + 0.5);
    }

    private isWithinBounds(uv: vec2): boolean {
        return uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
    }

    private clampToBounds(uv: vec2): vec2 {
        return new vec2(
            Math.max(0.0, Math.min(1.0, uv.x)),
            Math.max(0.0, Math.min(1.0, uv.y))
        );
    }

    private updateSelectionUV(uv: vec2): void {
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
    private updateCursorPlane(uv: vec2): void {
        if (!this.cursorPlaneTransform || !this.mainObjectTransform) return;

        // Get the world scale of the mainObject (the texture plane)
        const mainObjectScale = this.mainObjectTransform.getWorldScale();

        // Apply UV offset before converting to world position
        const offsetUV = new vec2(
            uv.x + this.uvOffset.x,
            uv.y + this.uvOffset.y
        );

        // Convert UV (0-1) to local position on the plane
        // UV (0.5, 0.5) = center = local (0, 0)
        // Use mainObject's world scale to determine actual plane dimensions
        const localX = (offsetUV.x - 0.5) * mainObjectScale.x;
        const localY = (offsetUV.y - 0.5) * mainObjectScale.y;
        const localPos = new vec3(localX, localY, 0);

        // Transform to world position using mainObject's rotation and position
        const worldRotation = this.mainObjectTransform.getWorldRotation();
        const worldPosition = this.mainObjectTransform.getWorldPosition();
        let cursorPosition = worldPosition.add(worldRotation.multiplyVec3(localPos));

        // Add normal offset along mainObject's forward direction
        const planeNormal = worldRotation.multiplyVec3(vec3.forward());
        cursorPosition = cursorPosition.add(planeNormal.uniformScale(this.normalOffset));

        // Set the cursor plane's world position (no filtering - instant follow)
        this.cursorPlaneTransform.setWorldPosition(cursorPosition);

        // Compensate cursor plane scale for mainObject's aspect ratio
        const aspectRatioCompensation = mainObjectScale.y / mainObjectScale.x;
        this.cursorPlaneTransform.setLocalScale(new vec3(
            this.cursorPlaneOriginalScale.x * aspectRatioCompensation,
            this.cursorPlaneOriginalScale.y,
            this.cursorPlaneOriginalScale.z
        ));

        // Update cursor plane texture with sampled grid from source texture
        this.updateCursorPlaneTexture(uv);
    }

    // ==================== Texture Sampling ====================

    /**
     * Samples a gridSize x gridSize region from the source texture (mainObject's captureImage)
     * centered at the given UV and applies it to the cursor plane's material.
     * 
     * All texture operations are self-contained - no class-level texture state needed.
     */
    private updateCursorPlaneTexture(uv: vec2): void {
        if (!this.cursorPlaneMaterial || !this.material) return;

        // Get source texture fresh each frame from mainObject's material
        const sourceTexture: Texture = this.material.captureImage;
        if (!sourceTexture) return;

        const width = sourceTexture.getWidth();
        const height = sourceTexture.getHeight();
        if (width <= 0 || height <= 0) return;

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
        const sourceProvider = proceduralTexture.control as ProceduralTextureProvider;

        // Sample pixels from source texture
        const pixelBuffer = new Uint8Array(gridSize * gridSize * 4);
        sourceProvider.getPixels(startPixelX, startPixelY, gridSize, gridSize, pixelBuffer);

        // Create output texture and apply sampled pixels
        const sampledTexture = ProceduralTextureProvider.createWithFormat(
            gridSize,
            gridSize,
            TextureFormat.RGBA8Unorm
        );
        const outputProvider = sampledTexture.control as ProceduralTextureProvider;
        outputProvider.setPixels(0, 0, gridSize, gridSize, pixelBuffer);

        // Apply to cursor plane material
        this.cursorPlaneMaterial.mainTexture = sampledTexture;
    }

    // ==================== Public API ====================

    /**
     * Programmatically set the selection UV position
     */
    public setSelectionUV(uv: vec2): void {
        if (this.uvFilter) {
            this.uvFilter.reset();
        }
        this.updateSelectionUV(uv);
    }

    /**
     * Programmatically set the cursor plane's world position
     */
    public setCursorPlanePosition(worldPosition: vec3): void {
        if (this.cursorPlaneTransform) {
            this.cursorPlaneTransform.setWorldPosition(worldPosition);
        }
    }

    /**
     * Reset selection to initial UV position
     */
    public resetSelection(): void {
        this.setSelectionUV(this.initialUV);
    }

    /**
     * Enable or disable the controller
     */
    public setEnabled(enabled: boolean): void {
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
    public getGridSize(): number {
        return this.validatedGridSize;
    }
}