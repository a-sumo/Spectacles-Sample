/**
 * TransformTweener
 *
 * Tweens the attached SceneObject to/from a target position with an offset.
 * The offset is applied in the target's local space, so it respects the target's
 * rotation and scale.
 *
 * Usage:
 * - Call tweenToTarget() to animate toward target + offset
 * - Call tweenToOrigin() to animate back to the original position
 * - Call toggle() to switch between the two states
 */
@component
export class TransformTweener extends BaseScriptComponent {
    @input
    @hint("The target object to tween toward")
    target: SceneObject;

    @input
    @hint("Offset from target in target's local space (affected by target's rotation/scale)")
    offset: vec3 = new vec3(0, 0, 0);

    @input
    @hint("Duration of the tween in seconds")
    duration: number = 0.3;

    @input
    @hint("Also match target's rotation when at target")
    matchRotation: boolean = false;

    @input
    @hint("Easing type")
    @widget(new ComboBoxWidget([
        new ComboBoxItem("Linear", 0),
        new ComboBoxItem("EaseInOut", 1),
        new ComboBoxItem("EaseIn", 2),
        new ComboBoxItem("EaseOut", 3),
        new ComboBoxItem("EaseOutBack", 4),
        new ComboBoxItem("EaseInBack", 5)
    ]))
    easingType: number = 1;

    @input
    @hint("Start at target position on awake")
    startAtTarget: boolean = false;

    private myTransform: Transform;
    private targetTransform: Transform;

    private originPosition: vec3 = vec3.zero();
    private originRotation: quat = quat.quatIdentity();

    private startPosition: vec3 = vec3.zero();
    private startRotation: quat = quat.quatIdentity();
    private endPosition: vec3 = vec3.zero();
    private endRotation: quat = quat.quatIdentity();

    private isTweening: boolean = false;
    private tweenProgress: number = 0;
    private tweenDirection: number = 1; // 1 = to target, -1 = to origin

    private _isAtTarget: boolean = false;

    get isAtTarget(): boolean {
        return this._isAtTarget;
    }

    get isTweenActive(): boolean {
        return this.isTweening;
    }

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    private initialize(): void {
        if (!this.target) {
            print("TransformTweener: ERROR - target not assigned");
            return;
        }

        this.myTransform = this.sceneObject.getTransform();
        this.targetTransform = this.target.getTransform();

        // Store origin position
        this.originPosition = this.myTransform.getWorldPosition();
        this.originRotation = this.myTransform.getWorldRotation();

        if (this.startAtTarget) {
            this.snapToTarget();
        }

        print("TransformTweener: Initialized");
    }

    private onUpdate(): void {
        if (!this.isTweening) return;

        const dt = getDeltaTime();
        const progressDelta = dt / Math.max(0.001, this.duration);

        this.tweenProgress += progressDelta;

        if (this.tweenProgress >= 1.0) {
            this.tweenProgress = 1.0;
            this.isTweening = false;
        }

        const easedProgress = this.applyEasing(this.tweenProgress);

        // Interpolate position
        const newPosition = vec3.lerp(this.startPosition, this.endPosition, easedProgress);
        this.myTransform.setWorldPosition(newPosition);

        // Interpolate rotation if enabled
        if (this.matchRotation) {
            const newRotation = quat.slerp(this.startRotation, this.endRotation, easedProgress);
            this.myTransform.setWorldRotation(newRotation);
        }

        // Update state when tween completes
        if (!this.isTweening) {
            this._isAtTarget = this.tweenDirection === 1;
        }
    }

    private applyEasing(t: number): number {
        switch (this.easingType) {
            case 0: // Linear
                return t;
            case 1: // EaseInOut
                return t < 0.5
                    ? 2 * t * t
                    : 1 - Math.pow(-2 * t + 2, 2) / 2;
            case 2: // EaseIn
                return t * t;
            case 3: // EaseOut
                return 1 - (1 - t) * (1 - t);
            case 4: // EaseOutBack
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            case 5: // EaseInBack
                const c1b = 1.70158;
                const c3b = c1b + 1;
                return c3b * t * t * t - c1b * t * t;
            default:
                return t;
        }
    }

    /**
     * Calculate the target world position (target position + offset in target's local space)
     */
    private calculateTargetWorldPosition(): vec3 {
        const targetPos = this.targetTransform.getWorldPosition();
        const targetRot = this.targetTransform.getWorldRotation();
        const targetScale = this.targetTransform.getWorldScale();

        // Apply scale to offset
        const scaledOffset = new vec3(
            this.offset.x * targetScale.x,
            this.offset.y * targetScale.y,
            this.offset.z * targetScale.z
        );

        // Rotate the scaled offset by target's rotation
        const rotatedOffset = targetRot.multiplyVec3(scaledOffset);

        return targetPos.add(rotatedOffset);
    }

    /**
     * Get the target rotation (if matchRotation is enabled)
     */
    private calculateTargetWorldRotation(): quat {
        return this.targetTransform.getWorldRotation();
    }

    // ============ PUBLIC API ============

    /**
     * Tween to the target position + offset
     */
    tweenToTarget(): void {
        if (!this.targetTransform) return;

        this.startPosition = this.myTransform.getWorldPosition();
        this.startRotation = this.myTransform.getWorldRotation();
        this.endPosition = this.calculateTargetWorldPosition();
        this.endRotation = this.calculateTargetWorldRotation();

        this.tweenProgress = 0;
        this.tweenDirection = 1;
        this.isTweening = true;
    }

    /**
     * Tween back to the original position
     */
    tweenToOrigin(): void {
        if (!this.targetTransform) return;

        this.startPosition = this.myTransform.getWorldPosition();
        this.startRotation = this.myTransform.getWorldRotation();
        this.endPosition = this.originPosition;
        this.endRotation = this.originRotation;

        this.tweenProgress = 0;
        this.tweenDirection = -1;
        this.isTweening = true;
    }

    /**
     * Toggle between target and origin
     */
    toggle(): void {
        if (this._isAtTarget) {
            this.tweenToOrigin();
        } else {
            this.tweenToTarget();
        }
    }

    /**
     * Instantly snap to target position + offset
     */
    snapToTarget(): void {
        if (!this.targetTransform) return;

        this.myTransform.setWorldPosition(this.calculateTargetWorldPosition());
        if (this.matchRotation) {
            this.myTransform.setWorldRotation(this.calculateTargetWorldRotation());
        }
        this._isAtTarget = true;
        this.isTweening = false;
    }

    /**
     * Instantly snap to origin position
     */
    snapToOrigin(): void {
        this.myTransform.setWorldPosition(this.originPosition);
        if (this.matchRotation) {
            this.myTransform.setWorldRotation(this.originRotation);
        }
        this._isAtTarget = false;
        this.isTweening = false;
    }

    /**
     * Update the offset (useful for dynamic positioning)
     */
    setOffset(newOffset: vec3): void {
        this.offset = newOffset;
    }

    /**
     * Update the origin position to current position
     */
    setCurrentAsOrigin(): void {
        this.originPosition = this.myTransform.getWorldPosition();
        this.originRotation = this.myTransform.getWorldRotation();
    }

    /**
     * Set a new target object
     */
    setTarget(newTarget: SceneObject): void {
        this.target = newTarget;
        this.targetTransform = newTarget.getTransform();
    }

    /**
     * Get current tween progress (0-1)
     */
    getTweenProgress(): number {
        return this.tweenProgress;
    }
}
