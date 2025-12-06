/**
 * TransformFollower
 *
 * Makes Object B follow Object A's movement while maintaining their offset.
 * When A moves, B moves by the same delta - they stay the same distance apart.
 *
 * The controller can be positioned at an offset from the follower using setControllerOffset().
 */
@component
export class TransformFollower extends BaseScriptComponent {
    @input
    @hint("The controller object (A) - when this moves, the follower moves too")
    controller: SceneObject | null = null;

    @input
    @hint("The follower object (B) - maintains offset from controller")
    follower: SceneObject | null = null;

    @input
    @hint("Initial offset of controller from follower (in follower's local space)")
    controllerOffset: vec3 = new vec3(0, 0, 0);

    @input
    @hint("Also follow rotation changes")
    followRotation: boolean = false;

    @input
    @hint("Also follow scale changes")
    followScale: boolean = false;

    private controllerTransform: Transform | null = null;
    private followerTransform: Transform | null = null;

    private lastControllerPos: vec3 = vec3.zero();
    private lastControllerRot: quat = quat.quatIdentity();
    private lastControllerScale: vec3 = vec3.one();

    private isInitialized: boolean = false;

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    private initialize(): void {
        if (!this.controller || !this.follower) {
            // Silently skip - inputs not configured
            return;
        }

        this.controllerTransform = this.controller.getTransform();
        this.followerTransform = this.follower.getTransform();

        if (!this.controllerTransform || !this.followerTransform) {
            return;
        }

        // Position controller at offset from follower
        this.applyControllerOffset();

        // Store initial controller transform
        this.lastControllerPos = this.controllerTransform.getWorldPosition();
        this.lastControllerRot = this.controllerTransform.getWorldRotation();
        this.lastControllerScale = this.controllerTransform.getWorldScale();

        this.isInitialized = true;
        print("TransformFollower: Initialized with offset " + this.controllerOffset.toString());
    }

    private onUpdate(): void {
        if (!this.isInitialized || !this.controllerTransform || !this.followerTransform) {
            return;
        }

        const currentPos = this.controllerTransform.getWorldPosition();
        const currentRot = this.controllerTransform.getWorldRotation();
        const currentScale = this.controllerTransform.getWorldScale();

        // Calculate position delta and apply to follower
        const posDelta = currentPos.sub(this.lastControllerPos);
        if (posDelta.length > 0.0001) {
            const followerPos = this.followerTransform.getWorldPosition();
            this.followerTransform.setWorldPosition(followerPos.add(posDelta));
        }

        // Apply rotation delta if enabled
        if (this.followRotation) {
            const rotDelta = this.lastControllerRot.invert().multiply(currentRot);
            const followerRot = this.followerTransform.getWorldRotation();
            this.followerTransform.setWorldRotation(followerRot.multiply(rotDelta));
        }

        // Apply scale delta if enabled
        if (this.followScale) {
            const followerScale = this.followerTransform.getWorldScale();
            const scaleRatio = new vec3(
                currentScale.x / Math.max(this.lastControllerScale.x, 0.001),
                currentScale.y / Math.max(this.lastControllerScale.y, 0.001),
                currentScale.z / Math.max(this.lastControllerScale.z, 0.001)
            );
            this.followerTransform.setWorldScale(new vec3(
                followerScale.x * scaleRatio.x,
                followerScale.y * scaleRatio.y,
                followerScale.z * scaleRatio.z
            ));
        }

        // Update last known transform
        this.lastControllerPos = currentPos;
        this.lastControllerRot = currentRot;
        this.lastControllerScale = currentScale;
    }

    /**
     * Apply the controller offset - positions controller relative to follower
     */
    private applyControllerOffset(): void {
        if (!this.controllerTransform || !this.followerTransform) return;

        const followerPos = this.followerTransform.getWorldPosition();
        const followerRot = this.followerTransform.getWorldRotation();

        // Calculate controller position in world space
        const rotatedOffset = followerRot.multiplyVec3(this.controllerOffset);
        const controllerPos = followerPos.add(rotatedOffset);

        this.controllerTransform.setWorldPosition(controllerPos);

        if (this.followRotation) {
            this.controllerTransform.setWorldRotation(followerRot);
        }
    }

    // ============ PUBLIC API ============

    /**
     * Set the controller offset from follower
     */
    setControllerOffset(offset: vec3): void {
        this.controllerOffset = offset;
        if (this.isInitialized) {
            this.applyControllerOffset();
            this.lastControllerPos = this.controllerTransform!.getWorldPosition();
        }
    }

    /**
     * Get current controller offset
     */
    getControllerOffset(): vec3 {
        return this.controllerOffset;
    }

    /**
     * Reposition controller to current offset (call after moving follower externally)
     */
    repositionController(): void {
        if (this.isInitialized) {
            this.applyControllerOffset();
            this.lastControllerPos = this.controllerTransform!.getWorldPosition();
        }
    }

    /**
     * Get the current offset between controller and follower (calculated from positions)
     */
    getCurrentOffset(): vec3 {
        if (!this.controllerTransform || !this.followerTransform) {
            return vec3.zero();
        }
        const controllerPos = this.controllerTransform.getWorldPosition();
        const followerPos = this.followerTransform.getWorldPosition();
        const followerRotInv = this.followerTransform.getWorldRotation().invert();
        return followerRotInv.multiplyVec3(controllerPos.sub(followerPos));
    }
}
