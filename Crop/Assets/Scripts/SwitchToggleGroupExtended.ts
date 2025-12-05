import { Switch } from "SpectaclesUIKit.lspkg/Scripts/Components/Switch/Switch"
import { BaseToggleGroup } from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/BaseToggleGroup"
import { Toggleable } from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/Toggleable"
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event"

/**
 * Event data for toggle selection
 */
export class ToggleSelectionEvent {
    index: number
    switchComponent: Switch
    label: string
    sceneObject: SceneObject
    
    constructor(index: number, switchComponent: Switch, label: string, sceneObject: SceneObject) {
        this.index = index
        this.switchComponent = switchComponent
        this.label = label
        this.sceneObject = sceneObject
    }
}

/**
 * Extended toggle group with text labels and selection tracking
 */
@component
export class SwitchToggleGroupExtended extends BaseToggleGroup {
    
    @input
    @hint("Switch components in the group")
    private _switches: Switch[] = []
    
    @input
    @hint("Text components for each switch (same order as switches)")
    private _labels: Text[] = []
    
    @input
    @hint("Default label texts (comma-separated)")
    private labelTexts: string = ""
    
    @input
    @hint("Color for selected toggle's label")
    private selectedLabelColor: vec4 = new vec4(1, 0.85, 0, 1)
    
    @input
    @hint("Color for unselected toggle's label")
    private unselectedLabelColor: vec4 = new vec4(0.7, 0.7, 0.7, 1)
    
    @input
    @hint("Default selected index (-1 for none)")
    private defaultSelectedIndex: number = 0
    
    // Selection tracking
    private _selectedIndex: number = -1
    private _previousSelectedIndex: number = -1
    
    // Events
    private onSelectionChangedEvent: Event<ToggleSelectionEvent> = new Event<ToggleSelectionEvent>()
    public readonly onSelectionChanged: PublicApi<ToggleSelectionEvent> = this.onSelectionChangedEvent.publicApi()
    
    private onDeselectionEvent: Event<ToggleSelectionEvent> = new Event<ToggleSelectionEvent>()
    public readonly onDeselection: PublicApi<ToggleSelectionEvent> = this.onDeselectionEvent.publicApi()
    
    // BaseToggleGroup implementation
    get toggleables(): Toggleable[] {
        return this._switches
    }
    
    onAwake() {
        super.onAwake()
        this.createEvent("OnStartEvent").bind(() => this.initializeExtended())
    }
    
    private initializeExtended(): void {
        // Setup label texts
        this.setupLabels()
        
        // Listen to each switch's value changes
        for (let i = 0; i < this._switches.length; i++) {
            const switchComponent = this._switches[i]
            const index = i
            
            switchComponent.onValueChange.add((value: number) => {
                this.handleSwitchValueChanged(index, value)
            })
        }
        
        // Set default selection
        if (this.defaultSelectedIndex >= 0 && this.defaultSelectedIndex < this._switches.length) {
            this.setSelectedIndex(this.defaultSelectedIndex, false)
        }
        
        // Update label colors
        this.updateLabelColors()
        
        print(`SwitchToggleGroupExtended: Initialized with ${this._switches.length} switches`)
    }
    
    private setupLabels(): void {
        if (this.labelTexts.length === 0) return
        
        const texts = this.labelTexts.split(",").map(t => t.trim())
        
        for (let i = 0; i < Math.min(this._labels.length, texts.length); i++) {
            if (this._labels[i]) {
                this._labels[i].text = texts[i]
            }
        }
    }
    
    private handleSwitchValueChanged(index: number, value: number): void {
        if (value === 1) {
            // Switch turned ON
            this._previousSelectedIndex = this._selectedIndex
            this._selectedIndex = index
            
            this.updateLabelColors()
            
            // Invoke selection event
            const event = new ToggleSelectionEvent(
                index,
                this._switches[index],
                this.getLabelText(index),
                this._switches[index].sceneObject
            )
            this.onSelectionChangedEvent.invoke(event)
            
            // Invoke deselection event for previous
            if (this._previousSelectedIndex >= 0 && this._previousSelectedIndex !== index) {
                const deselectionEvent = new ToggleSelectionEvent(
                    this._previousSelectedIndex,
                    this._switches[this._previousSelectedIndex],
                    this.getLabelText(this._previousSelectedIndex),
                    this._switches[this._previousSelectedIndex].sceneObject
                )
                this.onDeselectionEvent.invoke(deselectionEvent)
            }
        }
    }
    
    private updateLabelColors(): void {
        for (let i = 0; i < this._labels.length; i++) {
            if (!this._labels[i]) continue
            
            if (i === this._selectedIndex) {
                this._labels[i].textFill.color = this.selectedLabelColor
            } else {
                this._labels[i].textFill.color = this.unselectedLabelColor
            }
        }
    }
    
    // ============ PUBLIC API ============
    
    /**
     * Get the currently selected index
     */
    public getSelectedIndex(): number {
        return this._selectedIndex
    }
    
    /**
     * Get the previously selected index
     */
    public getPreviousSelectedIndex(): number {
        return this._previousSelectedIndex
    }
    
    /**
     * Set the selected index programmatically
     */
    public setSelectedIndex(index: number, notify: boolean = true): void {
        if (index < 0 || index >= this._switches.length) {
            print(`SwitchToggleGroupExtended: Index ${index} out of range`)
            return
        }
        
        if (index === this._selectedIndex) return
        
        // Turn off current selection
        if (this._selectedIndex >= 0 && this._selectedIndex < this._switches.length) {
            this._switches[this._selectedIndex].isOn = false
        }
        
        // Turn on new selection
        this._previousSelectedIndex = this._selectedIndex
        this._selectedIndex = index
        this._switches[index].isOn = true
        
        this.updateLabelColors()
        
        if (notify) {
            const event = new ToggleSelectionEvent(
                index,
                this._switches[index],
                this.getLabelText(index),
                this._switches[index].sceneObject
            )
            this.onSelectionChangedEvent.invoke(event)
        }
    }
    
    /**
     * Get the selected switch component
     */
    public getSelectedSwitch(): Switch | null {
        if (this._selectedIndex >= 0 && this._selectedIndex < this._switches.length) {
            return this._switches[this._selectedIndex]
        }
        return null
    }
    
    /**
     * Get the label text for a specific index
     */
    public getLabelText(index: number): string {
        if (index >= 0 && index < this._labels.length && this._labels[index]) {
            return this._labels[index].text
        }
        return ""
    }
    
    /**
     * Set the label text for a specific index
     */
    public setLabelText(index: number, text: string): void {
        if (index >= 0 && index < this._labels.length && this._labels[index]) {
            this._labels[index].text = text
        }
    }
    
    /**
     * Get all label texts
     */
    public getAllLabelTexts(): string[] {
        return this._labels.map(label => label ? label.text : "")
    }
    
    /**
     * Set all label texts
     */
    public setAllLabelTexts(texts: string[]): void {
        for (let i = 0; i < Math.min(this._labels.length, texts.length); i++) {
            if (this._labels[i]) {
                this._labels[i].text = texts[i]
            }
        }
    }
    
    /**
     * Get switch by index
     */
    public getSwitch(index: number): Switch | null {
        if (index >= 0 && index < this._switches.length) {
            return this._switches[index]
        }
        return null
    }
    
    /**
     * Get the number of switches
     */
    public getSwitchCount(): number {
        return this._switches.length
    }
    
    /**
     * Set label colors
     */
    public setLabelColors(selected: vec4, unselected: vec4): void {
        this.selectedLabelColor = selected
        this.unselectedLabelColor = unselected
        this.updateLabelColors()
    }
}