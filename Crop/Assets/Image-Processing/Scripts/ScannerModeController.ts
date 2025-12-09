import { SwitchToggleGroupExtended, ToggleSelectionEvent } from "./UI/SwitchToggleGroupExtended"
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event"

/**
 * Scanner modes
 */
export type ScannerMode = "palette" | "pigment" | "none"

/**
 * Event data for mode changes
 */
export class ScannerModeChangeEvent {
    mode: ScannerMode
    previousMode: ScannerMode

    constructor(mode: ScannerMode, previousMode: ScannerMode) {
        this.mode = mode
        this.previousMode = previousMode
    }
}

/**
 * ScannerModeController
 *
 * Controls which scanner mode is active:
 * - "palette": Palette extraction scanner (single instance, extracts colors from image)
 * - "pigment": Pigment sampling scanner (multiple instances, eyedropper for physical paints)
 * - "none": No scanner mode active
 *
 * Uses SwitchToggleGroupExtended for UI-driven mode switching.
 * Other controllers can listen to mode changes and enable/disable accordingly.
 */
@component
export class ScannerModeController extends BaseScriptComponent {

    @input
    @hint("SwitchToggleGroupExtended for mode selection")
    toggleGroup: ScriptComponent

    @input
    @hint("PaletteExtractionController to enable/disable")
    paletteExtractionController: ScriptComponent

    @input
    @hint("PictureController to enable/disable")
    pictureController: ScriptComponent

    @input
    @hint("Default mode: 0=palette, 1=pigment")
    defaultModeIndex: number = 0

    private group: SwitchToggleGroupExtended
    private currentMode: ScannerMode = "none"
    private previousMode: ScannerMode = "none"

    private modeNames: ScannerMode[] = ["palette", "pigment"]
    private modeLabels: string[] = ["Extract Palette", "Sample Pigment"]

    // Events
    private _onModeChangedEvent = new Event<ScannerModeChangeEvent>()
    public readonly onModeChanged: PublicApi<ScannerModeChangeEvent> = this._onModeChangedEvent.publicApi()

    private static instance: ScannerModeController | null = null

    onAwake() {
        ScannerModeController.instance = this
        this.createEvent("OnStartEvent").bind(() => this.initialize())
    }

    public static getInstance(): ScannerModeController | null {
        return ScannerModeController.instance
    }

    private initialize(): void {
        this.group = this.toggleGroup as SwitchToggleGroupExtended

        // Set toggle labels
        this.group.setAllLabelTexts(this.modeLabels)

        // Listen to toggle changes
        this.group.onSelectionChanged.add((event: ToggleSelectionEvent) => {
            const mode = this.modeNames[event.index]
            if (mode) {
                this.setMode(mode)
            }
        })

        // Listen for all deselected
        this.group.onAllDeselected.add(() => {
            this.setMode("none")
        })

        // Apply default mode
        if (this.defaultModeIndex >= 0 && this.defaultModeIndex < this.modeNames.length) {
            this.setMode(this.modeNames[this.defaultModeIndex])
        }

        print(`ScannerModeController: Initialized, default mode = ${this.currentMode}`)
    }

    /**
     * Set the current scanner mode
     */
    public setMode(mode: ScannerMode): void {
        if (mode === this.currentMode) return

        this.previousMode = this.currentMode
        this.currentMode = mode

        // Update controller states
        this.updateControllerStates()

        // Fire event
        const event = new ScannerModeChangeEvent(mode, this.previousMode)
        this._onModeChangedEvent.invoke(event)

        print(`ScannerModeController: Mode changed from '${this.previousMode}' to '${mode}'`)
    }

    private updateControllerStates(): void {
        const paletteController = this.paletteExtractionController as any
        const pictureCtrl = this.pictureController as any

        switch (this.currentMode) {
            case "palette":
                // Enable palette extraction, disable pigment sampling
                if (paletteController) {
                    paletteController.gesturesEnabled = true
                }
                if (pictureCtrl) {
                    pictureCtrl.gesturesEnabled = false
                }
                break

            case "pigment":
                // Enable pigment sampling, disable palette extraction
                if (paletteController) {
                    paletteController.gesturesEnabled = false
                }
                if (pictureCtrl) {
                    pictureCtrl.gesturesEnabled = true
                }
                break

            case "none":
                // Disable both
                if (paletteController) {
                    paletteController.gesturesEnabled = false
                }
                if (pictureCtrl) {
                    pictureCtrl.gesturesEnabled = false
                }
                break
        }
    }

    // ============ PUBLIC API ============

    /**
     * Get current mode
     */
    public getMode(): ScannerMode {
        return this.currentMode
    }

    /**
     * Get previous mode
     */
    public getPreviousMode(): ScannerMode {
        return this.previousMode
    }

    /**
     * Check if palette extraction mode is active
     */
    public isPaletteMode(): boolean {
        return this.currentMode === "palette"
    }

    /**
     * Check if pigment sampling mode is active
     */
    public isPigmentMode(): boolean {
        return this.currentMode === "pigment"
    }

    /**
     * Switch to palette extraction mode
     */
    public setPaletteMode(): void {
        this.group.setSelectedIndex(0)
    }

    /**
     * Switch to pigment sampling mode
     */
    public setPigmentMode(): void {
        this.group.setSelectedIndex(1)
    }

    /**
     * Clear mode (no scanning)
     */
    public clearMode(): void {
        this.group.clearSelection()
    }
}
