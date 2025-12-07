/**
 * MeshCornerProvider
 *
 * Attach to a mesh SceneObject. Creates 4 child SceneObjects at the mesh corners
 * that update with the mesh's transform. Feed these to CropRegion.pointsToTrack.
 */
@component
export class MeshCornerProvider extends BaseScriptComponent {
    @input
    @hint("If true, creates corner objects automatically on start")
    autoCreateCorners: boolean = true;

    @input
    @hint("Optional: manually assign corner objects instead of auto-creating")
    cornerTopLeft: SceneObject;
    @input
    cornerTopRight: SceneObject;
    @input
    cornerBottomLeft: SceneObject;
    @input
    cornerBottomRight: SceneObject;

    private transform: Transform;
    private meshVisual: RenderMeshVisual;
    private corners: SceneObject[] = [];
    private cornerTransforms: Transform[] = [];

    // Local corner offsets (unit plane, will be scaled by mesh size)
    private localOffsets: vec3[] = [
        new vec3(-0.5, 0.5, 0),   // top-left
        new vec3(0.5, 0.5, 0),    // top-right
        new vec3(-0.5, -0.5, 0),  // bottom-left
        new vec3(0.5, -0.5, 0),   // bottom-right
    ];

    onAwake() {
        this.transform = this.sceneObject.getTransform();
        this.meshVisual = this.sceneObject.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;

        this.createEvent("OnStartEvent").bind(() => this.initialize());
    }

    private initialize(): void {
        if (this.autoCreateCorners) {
            this.createCornerObjects();
        } else {
            this.useManualCorners();
        }

        if (this.corners.length === 4) {
            this.createEvent("UpdateEvent").bind(() => this.updateCornerPositions());
            print(`MeshCornerProvider: Tracking 4 corners for ${this.sceneObject.name}`);
        }
    }

    private createCornerObjects(): void {
        const names = ["Corner_TL", "Corner_TR", "Corner_BL", "Corner_BR"];

        for (let i = 0; i < 4; i++) {
            const corner = global.scene.createSceneObject(names[i]);
            corner.setParent(this.sceneObject);
            this.corners.push(corner);
            this.cornerTransforms.push(corner.getTransform());
        }

        this.updateCornerPositions();
    }

    private useManualCorners(): void {
        const manualCorners = [
            this.cornerTopLeft,
            this.cornerTopRight,
            this.cornerBottomLeft,
            this.cornerBottomRight
        ];

        for (const corner of manualCorners) {
            if (corner) {
                this.corners.push(corner);
                this.cornerTransforms.push(corner.getTransform());
            }
        }

        if (this.corners.length !== 4) {
            print(`MeshCornerProvider: Warning - expected 4 corners, got ${this.corners.length}`);
        }
    }

    private updateCornerPositions(): void {
        const worldTransform = this.transform.getWorldTransform();

        for (let i = 0; i < this.corners.length; i++) {
            const worldPos = worldTransform.multiplyPoint(this.localOffsets[i]);
            this.cornerTransforms[i].setWorldPosition(worldPos);
        }
    }

    /**
     * Get the corner SceneObjects for use with CropRegion.pointsToTrack
     */
    public getCorners(): SceneObject[] {
        return this.corners;
    }

    /**
     * Get corner world positions directly
     */
    public getCornerPositions(): vec3[] {
        const worldTransform = this.transform.getWorldTransform();
        return this.localOffsets.map(offset => worldTransform.multiplyPoint(offset));
    }
}
