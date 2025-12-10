import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";

/**
 * Event data emitted when a color is sampled or hovered
 */
export class ColorSampleEvent {
    /** Sampled color as vec4 (0-1 range) */
    color: vec4;
    /** Hex string representation */
    hex: string;
    /** UV coordinates where sample was taken */
    uv: vec2;
    /** The target SceneObject that was sampled */
    target: SceneObject;

    constructor(color: vec4, hex: string, uv: vec2, target: SceneObject) {
        this.color = color;
        this.hex = hex;
        this.uv = uv;
        this.target = target;
    }
}

/**
 * Internal tracking for each target
 */
interface TargetData {
    sceneObject: SceneObject;
    interactable: Interactable;
    transform: Transform;
    material: any;
    unsubscribers: (() => void)[];
}

/**
 * ColorSampler - Sample pixel colors from textures via hover interaction
 *
 * Provides color picking functionality for Image or RenderMeshVisual components.
 * Emits events when hovering and when the user triggers (pinch/tap).
 *
 * TARGET REQUIREMENTS:
 * Each target SceneObject must have:
 *   1. Image OR RenderMeshVisual component (with a texture)
 *   2. Interactable component (from SpectaclesInteractionKit)
 *   3. Physics Collider component (e.g., ColliderComponent)
 * Without all three, hover detection will not work.
 */
@component
export class ColorSampler extends BaseScriptComponent {

    // ==================== TARGETS ====================

    @input
    @hint("Objects to sample from. Each needs: Image/RenderMeshVisual + Interactable + Collider")
    targets: SceneObject[] = [];

    // ==================== VISUAL FEEDBACK (all optional) ====================

    @input
    @allowUndefined
    @hint("Cursor that follows hover position")
    cursor: SceneObject;

    @input
    @allowUndefined
    @hint("Grid preview showing sampled pixels around cursor")
    previewGrid: SceneObject;

    @input
    @hint("Offset for preview grid from cursor position (world units)")
    previewGridOffset: vec3 = new vec3(0, 0.02, 0);

    @input
    @allowUndefined
    @hint("Text component to display hex color value")
    hexLabel: Text;

    @input
    @allowUndefined
    @hint("Image or RenderMeshVisual to show sampled color swatch")
    colorSwatch: SceneObject;

    // ==================== SETTINGS ====================

    @input
    @hint("Grid size for pixel sampling (odd number, 1-31)")
    gridSize: number = 9;

    @input
    @hint("Material texture property name")
    textureProperty: string = "baseTex";

    // ==================== EVENTS ====================

    private onColorHoveredEvent = new Event<ColorSampleEvent>();
    private onColorSampledEvent = new Event<ColorSampleEvent>();

    /** Fired continuously while hovering over a target */
    public readonly onColorHovered: PublicApi<ColorSampleEvent> = this.onColorHoveredEvent.publicApi();
    /** Fired when user triggers (pinch/tap) on a target */
    public readonly onColorSampled: PublicApi<ColorSampleEvent> = this.onColorSampledEvent.publicApi();

    // ==================== INTERNAL STATE ====================

    private targetDataMap: Map<SceneObject, TargetData> = new Map();
    private activeTarget: TargetData | null = null;
    private currentEvent: ColorSampleEvent | null = null;

    private pixelBuffer: Uint8Array;
    private gridTexture: Texture | null = null;
    private gridTextureProvider: ProceduralTextureProvider | null = null;
    private previewGridMaterial: any = null;
    private swatchMaterial: any = null;

    private cursorTransform: Transform | null = null;
    private previewGridTransform: Transform | null = null;

    // ==================== LIFECYCLE ====================

    onAwake(): void {
        this.gridSize = this.forceOdd(Math.max(1, Math.min(31, this.gridSize)));
        this.initializeResources();
        this.setupVisuals();

        this.createEvent("OnStartEvent").bind(() => {
            for (const target of this.targets) {
                if (target) this.addTarget(target);
            }
        });

        this.createEvent("OnDestroyEvent").bind(() => this.cleanup());
    }

    // ==================== PUBLIC API ====================

    /**
     * Add a target for color sampling.
     * Target must have: Image/RenderMeshVisual + Interactable + Collider
     */
    public addTarget(target: SceneObject): boolean {
        if (this.targetDataMap.has(target)) return false;

        // Check for Interactable
        const interactable = target.getComponent(Interactable.getTypeName()) as Interactable;
        if (!interactable) {
            print(`ColorSampler: "${target.name}" missing Interactable component`);
            return false;
        }

        // Check for Collider
        const collider = target.getComponent("Physics.ColliderComponent");
        if (!collider) {
            print(`ColorSampler: "${target.name}" missing Physics Collider component`);
            return false;
        }

        // Try Image first, then RenderMeshVisual
        let material: any = null;

        const image = target.getComponent("Component.Image") as Image;
        if (image?.mainPass) {
            material = image.mainPass;
        } else {
            const mesh = target.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (mesh?.mainPass) {
                material = mesh.mainPass;
            }
        }

        if (!material) {
            print(`ColorSampler: "${target.name}" needs Image or RenderMeshVisual with material`);
            return false;
        }

        const data: TargetData = {
            sceneObject: target,
            interactable: interactable,
            transform: target.getTransform(),
            material: material,
            unsubscribers: []
        };

        this.setupTargetEvents(data);
        this.targetDataMap.set(target, data);
        return true;
    }

    /**
     * Remove a target from tracking
     */
    public removeTarget(target: SceneObject): boolean {
        const data = this.targetDataMap.get(target);
        if (!data) return false;

        for (const unsub of data.unsubscribers) unsub();

        if (this.activeTarget === data) {
            this.activeTarget = null;
            this.hideVisuals();
        }

        this.targetDataMap.delete(target);
        return true;
    }

    /**
     * Replace all targets
     */
    public setTargets(newTargets: SceneObject[]): void {
        for (const target of Array.from(this.targetDataMap.keys())) {
            this.removeTarget(target);
        }
        for (const target of newTargets) {
            if (target) this.addTarget(target);
        }
    }

    /**
     * Get current hovered color event (null if not hovering)
     */
    public getCurrentColor(): ColorSampleEvent | null {
        return this.currentEvent;
    }

    /**
     * Update grid size (1-31, forced to odd)
     */
    public setGridSize(size: number): void {
        this.gridSize = this.forceOdd(Math.max(1, Math.min(31, size)));
        this.reallocateResources();
    }

    // ==================== PRIVATE ====================

    private forceOdd(n: number): number {
        return n % 2 === 0 ? n + 1 : n;
    }

    private initializeResources(): void {
        const size = this.gridSize;
        this.pixelBuffer = new Uint8Array(size * size * 4);
        this.gridTexture = ProceduralTextureProvider.createWithFormat(size, size, TextureFormat.RGBA8Unorm);
        this.gridTextureProvider = this.gridTexture.control as ProceduralTextureProvider;
    }

    private reallocateResources(): void {
        const size = this.gridSize;
        this.pixelBuffer = new Uint8Array(size * size * 4);
        this.gridTexture = ProceduralTextureProvider.createWithFormat(size, size, TextureFormat.RGBA8Unorm);
        this.gridTextureProvider = this.gridTexture.control as ProceduralTextureProvider;

        if (this.previewGridMaterial) {
            this.previewGridMaterial.gridScale = size;
            this.previewGridMaterial.mainTexture = this.gridTexture;
        }
    }

    private setupVisuals(): void {
        // Cursor
        if (this.cursor) {
            this.cursorTransform = this.cursor.getTransform();
        }

        // Preview grid
        if (this.previewGrid) {
            this.previewGridTransform = this.previewGrid.getTransform();
            const mesh = this.previewGrid.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            const image = this.previewGrid.getComponent("Component.Image") as Image;
            this.previewGridMaterial = mesh?.mainPass || image?.mainPass;

            if (this.previewGridMaterial && this.gridTexture) {
                this.previewGridMaterial.gridScale = this.gridSize;
                this.previewGridMaterial.mainTexture = this.gridTexture;
            }
        }

        // Color swatch
        if (this.colorSwatch) {
            const mesh = this.colorSwatch.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            const image = this.colorSwatch.getComponent("Component.Image") as Image;
            this.swatchMaterial = mesh?.mainPass || image?.mainPass;
        }

        this.hideVisuals();
    }

    private setupTargetEvents(data: TargetData): void {
        const { interactable } = data;

        data.unsubscribers.push(
            interactable.onHoverEnter((e: InteractorEvent) => {
                this.activeTarget = data;
                this.handleHover(e, data);
            }),
            interactable.onHoverUpdate((e: InteractorEvent) => {
                if (this.activeTarget === data) this.handleHover(e, data);
            }),
            interactable.onHoverExit(() => {
                if (this.activeTarget === data) {
                    this.activeTarget = null;
                    this.currentEvent = null;
                    this.hideVisuals();
                }
            }),
            interactable.onTriggerStart(() => {
                if (this.currentEvent) this.onColorSampledEvent.invoke(this.currentEvent);
            })
        );
    }

    private handleHover(e: InteractorEvent, data: TargetData): void {
        const hitInfo = e.interactor?.targetHitInfo;
        if (!hitInfo?.hit?.position) return;

        const worldPos = hitInfo.hit.position;
        const uv = this.worldToUV(worldPos, data.transform);

        this.positionVisuals(worldPos, data.transform);
        const result = this.sampleColor(uv, data);

        if (result) {
            this.currentEvent = new ColorSampleEvent(result.color, result.hex, uv, data.sceneObject);
            this.updateDisplays(result.color, result.hex);
            this.onColorHoveredEvent.invoke(this.currentEvent);
        }
    }

    private worldToUV(worldPos: vec3, targetTransform: Transform): vec2 {
        const localPos = targetTransform.getInvertedWorldTransform().multiplyPoint(worldPos);
        return new vec2(
            Math.max(0, Math.min(1, localPos.x + 0.5)),
            Math.max(0, Math.min(1, localPos.y + 0.5))
        );
    }

    private positionVisuals(worldPos: vec3, targetTransform: Transform): void {
        const worldRot = targetTransform.getWorldRotation();

        if (this.cursorTransform) {
            this.cursorTransform.setWorldPosition(worldPos);
            this.cursorTransform.setWorldRotation(worldRot);
        }

        if (this.previewGridTransform) {
            const offsetPos = worldPos.add(this.previewGridOffset);
            this.previewGridTransform.setWorldPosition(offsetPos);
            this.previewGridTransform.setWorldRotation(worldRot);
        }
    }

    private hideVisuals(): void {
        const hidePos = new vec3(0, 10000, 0);
        if (this.cursorTransform) this.cursorTransform.setWorldPosition(hidePos);
        if (this.previewGridTransform) this.previewGridTransform.setWorldPosition(hidePos);
    }

    private updateDisplays(color: vec4, hex: string): void {
        if (this.hexLabel) {
            this.hexLabel.text = hex;
        }

        if (this.swatchMaterial) {
            this.swatchMaterial.baseColor = color;
        }
    }

    private sampleColor(uv: vec2, data: TargetData): { color: vec4; hex: string } | null {
        const texture = this.getTexture(data.material);
        if (!texture) return null;

        const width = texture.getWidth();
        const height = texture.getHeight();
        if (width <= 0 || height <= 0) return null;

        const halfGrid = Math.floor(this.gridSize / 2);
        const centerX = Math.round(uv.x * (width - 1));
        const centerY = Math.round(uv.y * (height - 1));
        const startX = Math.max(0, Math.min(width - this.gridSize, centerX - halfGrid));
        const startY = Math.max(0, Math.min(height - this.gridSize, centerY - halfGrid));

        // Get pixel data
        let provider: ProceduralTextureProvider;
        if (texture.control && typeof (texture.control as any).getPixels === 'function') {
            provider = texture.control as ProceduralTextureProvider;
        } else {
            const temp = ProceduralTextureProvider.createFromTexture(texture);
            provider = temp.control as ProceduralTextureProvider;
        }

        provider.getPixels(startX, startY, this.gridSize, this.gridSize, this.pixelBuffer);

        // Update preview grid texture
        if (this.gridTextureProvider) {
            this.gridTextureProvider.setPixels(0, 0, this.gridSize, this.gridSize, this.pixelBuffer);
        }

        // Get center pixel
        const idx = (halfGrid * this.gridSize + halfGrid) * 4;
        const r = this.pixelBuffer[idx];
        const g = this.pixelBuffer[idx + 1];
        const b = this.pixelBuffer[idx + 2];

        return {
            color: new vec4(r / 255, g / 255, b / 255, 1),
            hex: '#' + [r, g, b].map(v => v.toString(16).toUpperCase().padStart(2, '0')).join('')
        };
    }

    private getTexture(material: any): Texture | null {
        if (material[this.textureProperty]) return material[this.textureProperty];

        const fallbacks = ['baseTex', 'mainTexture', 'captureImage', 'diffuseTexture'];
        for (const prop of fallbacks) {
            if (material[prop]) return material[prop];
        }
        return null;
    }

    private cleanup(): void {
        for (const target of Array.from(this.targetDataMap.keys())) {
            this.removeTarget(target);
        }
        this.targetDataMap.clear();
        this.activeTarget = null;
        this.currentEvent = null;
    }
}
