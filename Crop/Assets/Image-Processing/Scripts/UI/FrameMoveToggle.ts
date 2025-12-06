import { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";

/**
 * FrameMoveToggle
 *
 * Toggles a Frame's movement capability on/off via a button.
 * When off, the Frame is disabled and content is static.
 * When on, the Frame is enabled and can be moved/manipulated.
 */
@component
export class FrameMoveToggle extends BaseScriptComponent {
    @input
    @hint("The Frame to toggle")
    frame: Frame;

    @input
    @hint("The SceneObject containing the Frame script (for direct component access)")
    frameSceneObject: SceneObject;

    @input
    @hint("Button that toggles movement (optional - can also call toggle() from code)")
    toggleButton: SceneObject;

    @input
    @hint("Start with movement enabled")
    startEnabled: boolean = false;

    @input
    @hint("Hide frame visual when movement is disabled")
    hideWhenDisabled: boolean = true;

    private _isMovementEnabled: boolean = false;
    private isInitialized: boolean = false;

    get isMovementEnabled(): boolean {
        return this._isMovementEnabled;
    }

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
    }

    private initialize(): void {
        if (!this.frame) {
            print("FrameMoveToggle: ERROR - frame not assigned");
            return;
        }

        // Setup button listener if provided
        if (this.toggleButton) {
            this.setupButtonListener();
        }

        this.isInitialized = true;

        // Set initial state
        this.setMovementEnabled(this.startEnabled);

        print("FrameMoveToggle: Initialized, movement " + (this._isMovementEnabled ? "enabled" : "disabled"));
    }

    private setupButtonListener(): void {
        // Try to find an Interactable or Button on the toggle button
        const interactable = this.toggleButton.getComponent("Component.ScriptComponent") as any;

        if (interactable) {
            // Try common button/interactable patterns
            if (typeof interactable.onTriggerEnd?.add === "function") {
                interactable.onTriggerEnd.add(() => this.toggle());
            } else if (typeof interactable.onButtonPinched?.add === "function") {
                interactable.onButtonPinched.add(() => this.toggle());
            } else if (typeof interactable.onTap?.add === "function") {
                interactable.onTap.add(() => this.toggle());
            }
        }
    }

    /**
     * Toggle movement on/off
     */
    toggle(): void {
        this.setMovementEnabled(!this._isMovementEnabled);
    }

    /**
     * Enable movement
     */
    enableMovement(): void {
        this.setMovementEnabled(true);
    }

    /**
     * Disable movement
     */
    disableMovement(): void {
        this.setMovementEnabled(false);
    }

    /**
     * Set movement enabled state
     */
    setMovementEnabled(enabled: boolean): void {
        this._isMovementEnabled = enabled;

        if (!this.frame) return;

        // Get the Frame's ScriptComponent and set enabled
        // Use frameSceneObject if provided, otherwise try to get from frame
        const targetObject = this.frameSceneObject || this.frame.sceneObject;

        if (targetObject) {
            // Find the Frame script component on the object
            const scripts = targetObject.getComponents("Component.ScriptComponent");
            for (const script of scripts) {
                // Check if this is the Frame component
                if ((script as any).roundedRectangle !== undefined ||
                    (script as any).frameObject !== undefined) {
                    script.enabled = enabled;
                    print("FrameMoveToggle: Set Frame script enabled = " + enabled);
                    break;
                }
            }
        }

        // Optionally control visibility
        if (this.hideWhenDisabled) {
            if (enabled) {
                this.frame.showVisual();
            } else {
                this.frame.hideVisual();
            }
        }

        print("FrameMoveToggle: Movement " + (enabled ? "enabled" : "disabled"));
    }
}
