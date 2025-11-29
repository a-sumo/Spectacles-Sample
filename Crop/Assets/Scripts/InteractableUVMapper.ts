import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { PictureController, ActiveScannerEvent } from "./PictureController";

/**
 * Maps interaction points on the active scanner's cameraCrop to UV coordinates (0-1 space).
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

    @input
    @hint("Path to cameraCrop within scanner hierarchy (e.g., 'ImageAnchor/CameraCrop')")
    cameraCropPath: string = "ImageAnchor/CameraCrop";

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
    private activeCameraCrop: SceneObject | null = null;
    private activeCameraCropTransform: Transform | null = null;
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
    }

    private onActiveScannerChanged(event: ActiveScannerEvent) {
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
                print("InteractableUVMapper: Could not find cameraCrop in scanner hierarchy");
            }
        } else {
            this.activeCameraCropTransform = null;
            this.activeCameraCrop = null;
            this.activeInteractableComponent = null;
            print("InteractableUVMapper: No active scanner");
        }
    }

    /**
     * Find the cameraCrop object within a scanner's hierarchy
     */
    private findCameraCropInScanner(scanner: SceneObject): SceneObject | null {
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

    private setupInteractableEvents() {
        if (!this.activeInteractableComponent) return;

        // Trigger Start
        this.unsubscribeInteractable.push(
            this.activeInteractableComponent.onInteractorTriggerStart.add((e: InteractorEvent) => {
                if (!this.activeCameraCropTransform) return;
                
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
                if (!this.activeCameraCropTransform) return;
                
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
     * Convert world position to UV coordinates on the active cameraCrop plane
     */
    private worldToUV(worldPosition: vec3): vec2 {
        if (!this.activeCameraCropTransform) {
            return new vec2(0.5, 0.5);
        }

        const localPos = this.activeCameraCropTransform.getInvertedWorldTransform()
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

    public getActiveCameraCrop(): SceneObject | null {
        return this.activeCameraCrop;
    }

    public getActiveScannerId(): string | null {
        return this.activeScannerId;
    }
}