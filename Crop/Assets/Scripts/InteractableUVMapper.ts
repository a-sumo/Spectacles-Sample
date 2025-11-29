import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { PictureController, ActiveScannerEvent } from "./PictureController";

/**
 * Maps interaction points on the active scanner to UV coordinates (0-1 space).
 * Automatically finds and subscribes to PictureController via singleton.
 * 
 * This is a pure mapper - it doesn't update materials or visuals,
 * just provides UV coordinates for other components to use.
 */
@component
export class InteractableUVMapper extends BaseScriptComponent {
    @input
    @hint("Should UV coordinates be clamped to 0-1 range?")
    clampToBounds: boolean = true;

    // Events
    private onUVChangedEvent = new Event<vec2>();
    public readonly onUVChanged: PublicApi<vec2> = this.onUVChangedEvent.publicApi();

    private onDragStartEvent = new Event<vec2>();
    public readonly onDragStart: PublicApi<vec2> = this.onDragStartEvent.publicApi();

    private onDragEndEvent = new Event<vec2>();
    public readonly onDragEnd: PublicApi<vec2> = this.onDragEndEvent.publicApi();

    // State
    private controller: PictureController | null = null;
    private activeScanner: SceneObject | null = null;
    private activeInteractable: SceneObject | null = null;
    private activeInteractableTransform: Transform | null = null;
    private activeInteractableComponent: Interactable | null = null;
    private activeScannerId: string | null = null;
    private currentUV: vec2 = new vec2(0.5, 0.5);
    private isDragging: boolean = false;

    // Event cleanup
    private unsubscribeInteractable: (() => void)[] = [];

    onAwake() {
        // Get PictureController via singleton
        this.controller = PictureController.getInstance();

        if (!this.controller) {
            print("InteractableUVMapper: PictureController singleton not found");
            return;
        }

        // Subscribe to active scanner changes
        this.controller.onActiveScannerChanged.add(this.onActiveScannerChanged.bind(this));
        
        print("InteractableUVMapper: Initialized and subscribed to PictureController");
    }

    private onActiveScannerChanged(event: ActiveScannerEvent) {
        // Cleanup previous interactable events
        this.cleanupInteractableEvents();

        this.activeScanner = event.scanner;
        this.activeInteractable = event.interactableObject;
        this.activeScannerId = event.scannerId;
        
        if (this.activeInteractable) {
            this.activeInteractableTransform = this.activeInteractable.getTransform();
            
            // Get the Interactable component
            this.activeInteractableComponent = this.activeInteractable.getComponent(
                Interactable.getTypeName()
            ) as Interactable;
            
            if (this.activeInteractableComponent) {
                this.setupInteractableEvents();
                print("InteractableUVMapper: Tracking scanner " + this.activeScannerId);
            } else {
                print("InteractableUVMapper: No Interactable component found");
            }
        } else {
            this.activeInteractableTransform = null;
            this.activeInteractableComponent = null;
            print("InteractableUVMapper: No active scanner");
        }
    }

    private setupInteractableEvents() {
        if (!this.activeInteractableComponent) return;

        // Trigger Start
        this.unsubscribeInteractable.push(
            this.activeInteractableComponent.onInteractorTriggerStart.add((e: InteractorEvent) => {
                if (!this.activeInteractableTransform) return;
                
                if (e.interactor && e.interactor.planecastPoint) {
                    const uv = this.worldToUV(e.interactor.planecastPoint);
                    this.currentUV = uv;
                    this.isDragging = true;
                    this.onDragStartEvent.invoke(uv);
                    this.onUVChangedEvent.invoke(uv);
                    print("Drag started at UV: " + uv.toString());
                }
            })
        );

        // Trigger Update
        this.unsubscribeInteractable.push(
            this.activeInteractableComponent.onTriggerUpdate.add((e: InteractorEvent) => {
                if (!this.activeInteractableTransform) return;
                
                if (this.isDragging && e.interactor && e.interactor.planecastPoint) {
                    const uv = this.worldToUV(e.interactor.planecastPoint);
                    this.currentUV = uv;
                    this.onUVChangedEvent.invoke(uv);
                }
            })
        );

        // Trigger End
        this.unsubscribeInteractable.push(
            this.activeInteractableComponent.onInteractorTriggerEnd.add((e: InteractorEvent) => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.onDragEndEvent.invoke(this.currentUV);
                    print("Drag ended at UV: " + this.currentUV.toString());
                }
            })
        );
    }

    private cleanupInteractableEvents() {
        this.unsubscribeInteractable.forEach(unsub => unsub());
        this.unsubscribeInteractable = [];
    }

    /**
     * Convert world position to UV coordinates on the active interactable plane
     */
    private worldToUV(worldPosition: vec3): vec2 {
        if (!this.activeInteractableTransform) {
            return new vec2(0.5, 0.5);
        }

        const localPos = this.activeInteractableTransform.getInvertedWorldTransform()
            .multiplyPoint(worldPosition);
        
        let uv = new vec2(localPos.x + 0.5, localPos.y + 0.5);

        if (this.clampToBounds) {
            uv = new vec2(
                Math.max(0.0, Math.min(1.0, uv.x)),
                Math.max(0.0, Math.min(1.0, uv.y))
            );
        }

        return uv;
    }

    // Public API
    public getCurrentUV(): vec2 {
        return this.currentUV;
    }

    public isCurrentlyDragging(): boolean {
        return this.isDragging;
    }

    public getActiveScanner(): SceneObject | null {
        return this.activeScanner;
    }

    public getActiveInteractable(): SceneObject | null {
        return this.activeInteractable;
    }

    public getActiveScannerId(): string | null {
        return this.activeScannerId;
    }
}