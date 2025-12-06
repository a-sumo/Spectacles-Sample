// GridTestOrchestrator.ts

@component
export class GridTestOrchestrator extends BaseScriptComponent {
    
    @input
    @hint("Reference to SimpleGridPositionSync script")
    gridSync: ScriptComponent;
    
    @input
    @hint("Auto-toggle interval (seconds, 0 = disabled)")
    autoToggleInterval: number = 3.0;
    
    @input
    @hint("Start with auto-toggle enabled")
    autoToggleEnabled: boolean = true;
    
    @input
    @hint("Log state changes")
    debugMode: boolean = true;
    
    private sync: any = null;
    private timer: number = 0;
    
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
        this.createEvent("UpdateEvent").bind((e) => this.onUpdate(e));
    }
    
    private initialize(): void {
        if (!this.gridSync) {
            print("GridTestOrchestrator ERROR: No gridSync assigned!");
            return;
        }
        
        this.sync = this.gridSync as any;
        this.timer = this.autoToggleInterval;
        
        if (this.debugMode) {
            print("GridTestOrchestrator: Initialized");
            print(`  Auto-toggle: ${this.autoToggleEnabled ? "ON" : "OFF"}`);
            print(`  Interval: ${this.autoToggleInterval}s`);
        }
    }
    
    private onUpdate(e: UpdateEvent): void {
        if (!this.sync || !this.autoToggleEnabled || this.autoToggleInterval <= 0) return;
        
        this.timer -= e.getDeltaTime();
        
        if (this.timer <= 0) {
            this.timer = this.autoToggleInterval;
            this.doToggle();
        }
    }
    
    private doToggle(): void {
        if (!this.sync) return;
        
        this.sync.toggle();
        
        if (this.debugMode) {
            const isAtParticle = this.sync.atParticlePositions;
            print(`GridTestOrchestrator: Toggled to ${isAtParticle ? "PARTICLE" : "CIRCLE"}`);
        }
    }
    
    // ============ PUBLIC API ============
    
    /**
     * Manual toggle
     */
    public toggle(): void {
        this.doToggle();
    }
    
    /**
     * Set to particle positions
     */
    public toParticles(): void {
        if (this.sync) {
            this.sync.setAtParticlePositions(true);
            if (this.debugMode) print("GridTestOrchestrator: -> PARTICLE");
        }
    }
    
    /**
     * Set to circle positions
     */
    public toCircle(): void {
        if (this.sync) {
            this.sync.setAtParticlePositions(false);
            if (this.debugMode) print("GridTestOrchestrator: -> CIRCLE");
        }
    }
    
    /**
     * Enable/disable auto-toggle
     */
    public setAutoToggle(enabled: boolean): void {
        this.autoToggleEnabled = enabled;
        this.timer = this.autoToggleInterval;
        if (this.debugMode) print(`GridTestOrchestrator: Auto-toggle ${enabled ? "ON" : "OFF"}`);
    }
    
    /**
     * Set auto-toggle interval
     */
    public setInterval(seconds: number): void {
        this.autoToggleInterval = seconds;
        this.timer = seconds;
    }
}