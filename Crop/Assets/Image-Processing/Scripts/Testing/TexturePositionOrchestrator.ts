@component
export class TexturePositionTestOrchestrator extends BaseScriptComponent {
    
    @input
    @hint("Reference to TexturePositionSync script")
    positionSync: ScriptComponent;
    
    @input
    @hint("Auto-toggle interval (seconds)")
    autoToggleInterval: number = 3.0;
    
    @input
    @hint("Enable auto-toggle")
    autoToggleEnabled: boolean = true;
    
    @input
    debugMode: boolean = true;
    
    private sync: any = null;
    private timer: number = 0;
    
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
        this.createEvent("UpdateEvent").bind((e) => this.onUpdate(e));
    }
    
    private initialize(): void {
        if (!this.positionSync) {
            print("TexturePositionTestOrchestrator ERROR: No positionSync assigned!");
            return;
        }
        
        this.sync = this.positionSync as any;
        this.timer = this.autoToggleInterval;
        
        if (this.debugMode) {
            print("TexturePositionTestOrchestrator: Ready");
        }
    }
    
    private onUpdate(e: UpdateEvent): void {
        if (!this.sync || !this.autoToggleEnabled) return;
        
        this.timer -= e.getDeltaTime();
        
        if (this.timer <= 0) {
            this.timer = this.autoToggleInterval;
            this.sync.toggle();
            
            if (this.debugMode) {
                const atParticle = this.sync.atParticlePositions;
                print(`Toggle: ${atParticle ? "PARTICLE (gamut)" : "CIRCLE (rest)"}`);
            }
        }
    }
    
    public toggle(): void {
        if (this.sync) this.sync.toggle();
    }
    
    public toParticles(): void {
        if (this.sync) this.sync.setAtParticlePositions(true);
    }
    
    public toCircle(): void {
        if (this.sync) this.sync.setAtParticlePositions(false);
    }
}