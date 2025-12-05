// Simple test script for pigment presets with 3 toggles

import { SwitchToggleGroupExtended, ToggleSelectionEvent } from "./SwitchToggleGroupExtended"
import { PaletteController } from "./PaletteController"

type PresetName = "classic" | "zorn" | "impressionist"

@component
export class PresetTester extends BaseScriptComponent {
    
    @input
    @hint("Reference to SwitchToggleGroupExtended component")
    toggleGroup: ScriptComponent
    
    @input
    @hint("Reference to PaletteController component")
    paletteController: ScriptComponent
    
    @input
    @hint("Enable debug logging")
    debugMode: boolean = true
    
    private group: SwitchToggleGroupExtended
    private palette: PaletteController
    
    // 3 presets for testing
    private readonly presets: { name: PresetName; label: string }[] = [
        { name: "classic", label: "Classic" },
        { name: "zorn", label: "Zorn" },
        { name: "impressionist", label: "Impressionist" }
    ]
    
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize())
    }
    
    private initialize(): void {
        // Validate inputs
        if (!this.toggleGroup) {
            print("PresetTester ERROR: toggleGroup not assigned")
            return
        }
        
        if (!this.paletteController) {
            print("PresetTester ERROR: paletteController not assigned")
            return
        }
        
        this.group = this.toggleGroup as unknown as SwitchToggleGroupExtended
        this.palette = this.paletteController as unknown as PaletteController
        
        // Setup labels
        const labels = this.presets.map(p => p.label)
        this.group.setAllLabelTexts(labels)
        
        // Listen to selection changes
        this.group.onSelectionChanged.add((event: ToggleSelectionEvent) => {
            this.onPresetSelected(event)
        })
        
        // Listen to deselections
        this.group.onDeselection.add((event: ToggleSelectionEvent) => {
            if (this.debugMode) {
                print(`PresetTester: Deselected '${event.label}'`)
            }
        })
        
        // Apply initial preset (first one)
        this.applyPreset(0)
        
        if (this.debugMode) {
            print(`PresetTester: Initialized with ${this.presets.length} presets`)
            print(`  Available: ${labels.join(", ")}`)
        }
    }
    
    private onPresetSelected(event: ToggleSelectionEvent): void {
        if (this.debugMode) {
            print(`PresetTester: Selected '${event.label}' (index: ${event.index})`)
        }
        
        this.applyPreset(event.index)
    }
    
    private applyPreset(index: number): void {
        if (index < 0 || index >= this.presets.length) {
            print(`PresetTester: Invalid preset index ${index}`)
            return
        }
        
        const preset = this.presets[index]
        this.palette.setOilPigmentPreset(preset.name)
        
        if (this.debugMode) {
            print(`PresetTester: Applied '${preset.name}' preset`)
            this.palette.logCurrentPalette()
        }
    }
    
    // ============ PUBLIC API ============
    
    /**
     * Select preset by index (0, 1, or 2)
     */
    public selectPreset(index: number): void {
        if (index < 0 || index >= this.presets.length) {
            print(`PresetTester: Index ${index} out of range (0-${this.presets.length - 1})`)
            return
        }
        
        this.group.setSelectedIndex(index, true)
    }
    
    /**
     * Select preset by name
     */
    public selectPresetByName(name: PresetName): void {
        const index = this.presets.findIndex(p => p.name === name)
        if (index >= 0) {
            this.selectPreset(index)
        } else {
            print(`PresetTester: Unknown preset '${name}'`)
        }
    }
    
    /**
     * Get current preset name
     */
    public getCurrentPresetName(): string {
        const index = this.group.getSelectedIndex()
        if (index >= 0 && index < this.presets.length) {
            return this.presets[index].name
        }
        return ""
    }
    
    /**
     * Cycle to next preset
     */
    public nextPreset(): void {
        const current = this.group.getSelectedIndex()
        const next = (current + 1) % this.presets.length
        this.selectPreset(next)
    }
    
    /**
     * Cycle to previous preset
     */
    public previousPreset(): void {
        const current = this.group.getSelectedIndex()
        const prev = (current - 1 + this.presets.length) % this.presets.length
        this.selectPreset(prev)
    }
}