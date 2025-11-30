/**
 * ScalingBehavior
 * 
 * Automatically updates this object's material surfaceWorldScale parameter
 * to match a target object's world scale. Useful for procedural materials
 * that need to adapt to their parent's scale (e.g., grid overlays, patterns).
 * 
 * Usage:
 * 1. Attach to an object with RenderMeshVisual
 * 2. Assign a target SceneObject (typically the parent)
 * 3. Material's surfaceWorldScale will update every frame to match target's scale
 */
@component
export class ScalingBehavior extends BaseScriptComponent {
    @input
    @hint("Target object whose world scale to track (typically parent)")
    targetObject: SceneObject;

    @input
    @hint("Update every frame? Disable if target scale is static for better performance")
    continuousUpdate: boolean = true;

    @input
    @hint("Which scale component to use: 'x', 'y', 'z', 'uniform' (average), or 'max'")
    scaleMode: string = "uniform";

    // Component references
    private renderMesh: RenderMeshVisual | null = null;
    private material: any = null;
    private targetTransform: Transform | null = null;

    // Cache for performance
    private lastScale: number = 1.0;

    onAwake() {
        // Get this object's RenderMeshVisual
        this.renderMesh = this.sceneObject.getComponent("RenderMeshVisual");
        
        if (!this.renderMesh) {
            print("ScalingBehavior: Error - No RenderMeshVisual found on this object");
            return;
        }

        // Get material
        this.material = this.renderMesh.mainPass;
        
        if (!this.material) {
            print("ScalingBehavior: Error - No material found on RenderMeshVisual");
            return;
        }

        // Validate target
        if (!this.targetObject) {
            print("ScalingBehavior: Warning - No target object assigned, using parent");
            this.targetObject = this.sceneObject.getParent();
        }

        if (!this.targetObject) {
            print("ScalingBehavior: Error - No target object available");
            return;
        }

        this.targetTransform = this.targetObject.getTransform();

        // Initial update
        this.updateScale();

        // Setup continuous updates if enabled
        if (this.continuousUpdate) {
            this.createEvent("UpdateEvent").bind(() => this.updateScale());
        }

        print("ScalingBehavior: Initialized, tracking " + this.targetObject.name);
    }

    /**
     * Update the material's surfaceWorldScale parameter
     */
    private updateScale(): void {
        if (!this.targetTransform || !this.material) return;

        const worldScale = this.targetTransform.getWorldScale();
        const scaleValue = this.computeScaleValue(worldScale);

        // Only update if changed (performance optimization)
        if (scaleValue !== this.lastScale) {
            this.material.surfaceWorldScale = scaleValue;
            this.lastScale = scaleValue;
        }
    }

    /**
     * Compute the scale value based on scaleMode
     */
    private computeScaleValue(worldScale: vec3): number {
        switch (this.scaleMode.toLowerCase()) {
            case "x":
                return worldScale.x;
            
            case "y":
                return worldScale.y;
            
            case "z":
                return worldScale.z;
            
            case "max":
                return Math.max(worldScale.x, worldScale.y, worldScale.z);
            
            case "min":
                return Math.min(worldScale.x, worldScale.y, worldScale.z);
            
            case "uniform":
            default:
                // Average of all components
                return (worldScale.x + worldScale.y + worldScale.z) / 3.0;
        }
    }

    /**
     * Manually trigger a scale update (useful when continuousUpdate is false)
     */
    public forceUpdate(): void {
        this.updateScale();
    }

    /**
     * Change the target object at runtime
     */
    public setTarget(newTarget: SceneObject): void {
        this.targetObject = newTarget;
        this.targetTransform = newTarget ? newTarget.getTransform() : null;
        this.updateScale();
    }

    /**
     * Get current scale value being applied
     */
    public getCurrentScale(): number {
        return this.lastScale;
    }
}