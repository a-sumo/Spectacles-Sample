import { SwitchToggleGroupExtended, ToggleSelectionEvent } from "./UI/SwitchToggleGroupExtended"
import { type PigmentPresetName, PaletteController } from "./PaletteController";

@component
export class PresetToggleController extends BaseScriptComponent {
    
    @input
    toggleGroup: ScriptComponent // SwitchToggleGroupExtended
    
    @input
    paletteController: ScriptComponent // PaletteController
    
    private group: SwitchToggleGroupExtended
    private palette: PaletteController
    
    private presetNames: PigmentPresetName[] = ["classic", "zorn", "primary"]
    
    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.initialize())
    }
    
    private initialize(): void {
        this.group = this.toggleGroup as SwitchToggleGroupExtended
        this.palette = this.paletteController as PaletteController
        
        // Set toggle labels to preset names
        const labels = this.presetNames.map(name => 
            name.charAt(0).toUpperCase() + name.slice(1) // Capitalize
        )
        this.group.setAllLabelTexts(labels)
        
        // Listen to toggle changes
        this.group.onSelectionChanged.add((event: ToggleSelectionEvent) => {
            const presetName = this.presetNames[event.index]
            if (presetName) {
                this.palette.setOilPigmentPreset(presetName)
                print(`Applied preset: ${presetName}`)
            }
        })
        
        // Apply initial preset
        this.palette.setOilPigmentPreset(this.presetNames[0])
    }
}