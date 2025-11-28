import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";

/**
 * SelectionUVController
 * 
 * Handles drag interaction on a mesh to update a material's selectionUV parameter.
 * Attach to any SceneObject with a RenderMeshVisual and collider.
 */
@component
export class SelectionUVController extends BaseScriptComponent {
    @input
    @hint("Target mesh whose material selectionUV will be updated. If not set, uses this SceneObject.")
    targetMesh: SceneObject;

    @input
    @hint("Initial selection UV position")
    initialUV: vec2 = new vec2(0.5, 0.5);

    private _transform: Transform;
    private _interactable: Interactable;
    private _collider: ColliderComponent;
    private _material: any = null;

    private _isDragging: boolean = false;
    private _isHovered: boolean = false;
    private _selectionUV: vec2 = new vec2(0.5, 0.5);

    private _onSelectionChangedEvent = new Event<vec2>();
    readonly onSelectionChanged: PublicApi<vec2> = this._onSelectionChangedEvent.publicApi();

    get isDragging(): boolean { return this._isDragging; }
    get isHovered(): boolean { return this._isHovered; }
    get selectionUV(): vec2 { return this._selectionUV; }

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
    }

    private initialize(): void {
        this._transform = this.sceneObject.getTransform();
        
        const target = this.targetMesh ?? this.sceneObject;
        const renderMesh = target.getComponent("RenderMeshVisual");
        if (renderMesh) {
            this._material = renderMesh.mainPass;
        }

        this.setupCollider();
        this.setupInteractable();
        this.updateSelectionUV(this.initialUV);

        this.createEvent("OnDestroyEvent").bind(() => this.cleanup());
    }

    private setupCollider(): void {
        this._collider = this.sceneObject.getComponent("Physics.ColliderComponent");
        if (!this._collider) {
            this._collider = this.sceneObject.createComponent("Physics.ColliderComponent");
            this._collider.fitVisual = true;
        }
    }

    private setupInteractable(): void {
        this._interactable = this.sceneObject.getComponent(Interactable.getTypeName());
        if (!this._interactable) {
            this._interactable = this.sceneObject.createComponent(Interactable.getTypeName());
        }
        this._interactable.allowMultipleInteractors = false;

        this._interactable.onHoverEnter(() => {
            this._isHovered = true;
        });

        this._interactable.onHoverExit(() => {
            this._isHovered = false;
        });

        this._interactable.onDragStart((e: InteractorEvent) => {
            if (!e.interactor.targetHitInfo) {
                return;
            }
            const uv = this.computeUV(e.interactor);
            if (!this.isWithinBounds(uv)) {
                return;
            }
            this._isDragging = true;
            this.updateSelectionUV(uv);
        });

        this._interactable.onDragUpdate((e: InteractorEvent) => {
            if (!this._isDragging || !e.interactor.targetHitInfo) {
                return;
            }
            const uv = this.computeUV(e.interactor);
            if (!this.isWithinBounds(uv)) {
                return;
            }
            this.updateSelectionUV(uv);
        });

        this._interactable.onDragEnd(() => {
            this._isDragging = false;
        });
    }

    private computeUV(interactor: Interactor): vec2 {
        const worldPosition = interactor.targetHitInfo?.hit?.position ?? vec3.zero();
        const localPos = this._transform.getInvertedWorldTransform().multiplyPoint(worldPosition);
        return new vec2(localPos.x + 0.5, localPos.y + 0.5);
    }

    private isWithinBounds(uv: vec2): boolean {
        return uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
    }

    private updateSelectionUV(uv: vec2): void {
        print("updating");
        this._selectionUV = new vec2(
            Math.max(0.0, Math.min(1.0, uv.x)),
            Math.max(0.0, Math.min(1.0, uv.y))
        );
        if (this._material) {
            this._material.selectionUV = this._selectionUV;
        }
        this._onSelectionChangedEvent.invoke(this._selectionUV);
    }

    public setSelectionUV(uv: vec2): void {
        this.updateSelectionUV(uv);
    }

    private cleanup(): void {
        if (this._interactable) {
            this._interactable.destroy();
        }
    }
}