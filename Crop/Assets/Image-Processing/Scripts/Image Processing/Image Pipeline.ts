// ImagePipeline.ts
// Orchestrates the full image → palette → projection → regeneration pipeline

@component
export class ImagePipeline extends BaseScriptComponent {

    @input
    paletteExtractor: ScriptComponent;

    @input
    gamutProjector: ScriptComponent;

    @input
    imageRegenerator: ScriptComponent;

    @input
    inputTexture: Texture;

    @input
    @hint("Number of colors to extract")
    paletteSize: number = 24;

    @input
    @hint("PaletteController to listen for preset changes")
    paletteController: ScriptComponent;

    @input
    @hint("Auto re-project when pigment preset changes")
    autoReprojectOnPresetChange: boolean = true;

    @input
    debugMode: boolean = true;

    private extractor: any;
    private projector: any;
    private regenerator: any;
    private pipelineState: "idle" | "extracting" | "projecting" | "regenerating" | "complete" = "idle";
    private frameCounter: number = 0;
    private lastExtractedPalette: vec3[] = [];

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    private initialize(): void {
        this.extractor = this.paletteExtractor as any;
        this.projector = this.gamutProjector as any;
        this.regenerator = this.imageRegenerator as any;

        // Listen for palette changes (preset or manual) from PaletteController
        if (this.paletteController && this.autoReprojectOnPresetChange) {
            const controller = this.paletteController as any;
            if (controller.onPresetChanged) {
                controller.onPresetChanged.add((event: any) => {
                    this.onPaletteChanged("preset", event.presetName);
                });
            }
            if (controller.onColorsManuallyChanged) {
                controller.onColorsManuallyChanged.add((colors: any) => {
                    this.onPaletteChanged("manual", null);
                });
            }
            if (controller.onPaletteRestored) {
                controller.onPaletteRestored.add((colors: any) => {
                    this.onPaletteChanged("restored", null);
                });
            }
            if (this.debugMode) {
                print("ImagePipeline: Listening for palette changes (preset, manual, restored)");
            }
        }

        if (this.debugMode) {
            print("ImagePipeline: Initialized");
        }
    }

    private onPaletteChanged(changeType: string, presetName: string | null): void {
        if (this.debugMode) {
            const label = presetName ? `preset '${presetName}'` : changeType;
            print(`ImagePipeline: Palette changed (${label}), re-projecting...`);
        }

        // Re-project with the same extracted palette but new gamut
        this.reprojectCurrentPalette();
    }
    
    private onUpdate(): void {
        if (this.pipelineState === "projecting") {
            this.frameCounter++;
            if (this.frameCounter >= 2) {
                this.finishProjection();
            }
        }
    }
    
    /**
     * Run the full pipeline
     */
    public run(): void {
        if (!this.extractor?.isReady?.() || !this.projector?.isReady?.()) {
            print("ImagePipeline: Components not ready");
            return;
        }

        this.pipelineState = "extracting";

        if (this.debugMode) {
            print("ImagePipeline: Starting extraction...");
        }

        // Step 1: Extract palette
        if (this.inputTexture) {
            this.extractor.setInputTexture(this.inputTexture);
        }
        this.extractor.paletteSize = this.paletteSize;

        const { original } = this.extractor.extractAndProject();

        if (original.length === 0) {
            print("ImagePipeline: Extraction failed");
            this.pipelineState = "idle";
            return;
        }

        // Store for re-projection on preset change
        this.lastExtractedPalette = original;

        // Step 2: Send to projector (async - GPU)
        this.projector.setInputColors(original);
        this.pipelineState = "projecting";
        this.frameCounter = 0;

        if (this.debugMode) {
            print(`ImagePipeline: Projecting ${original.length} colors...`);
        }
    }

    /**
     * Re-project the current extracted palette with the updated gamut
     * Call this when pigment preset changes
     */
    public reprojectCurrentPalette(): void {
        if (this.lastExtractedPalette.length === 0) {
            if (this.debugMode) {
                print("ImagePipeline: No palette to re-project");
            }
            return;
        }

        if (!this.projector?.isReady?.()) {
            print("ImagePipeline: Projector not ready");
            return;
        }

        // Invalidate projector cache and re-project
        this.projector.invalidateResults?.();
        this.projector.setInputColors(this.lastExtractedPalette);
        this.pipelineState = "projecting";
        this.frameCounter = 0;

        if (this.debugMode) {
            print(`ImagePipeline: Re-projecting ${this.lastExtractedPalette.length} colors with new gamut`);
        }
    }
    
    private finishProjection(): void {
        // Step 3: Get projected colors
        const original = this.extractor.getExtractedPalette();
        const projected = this.projector.getProjectedColors();
        
        if (projected.length === 0) {
            print("ImagePipeline: Projection failed");
            this.pipelineState = "idle";
            return;
        }
        
        if (this.debugMode) {
            print(`ImagePipeline: Got ${projected.length} projected colors`);
            
            // Log some deltas
            const results = this.projector.getProjectionResults();
            let totalDeltaE = 0;
            for (const r of results) {
                totalDeltaE += r.deltaE;
            }
            print(`ImagePipeline: Average ΔE = ${(totalDeltaE / results.length).toFixed(2)}`);
        }
        
        // Step 4: Regenerate image
        this.pipelineState = "regenerating";
        
        if (this.regenerator?.isReady?.()) {
            this.regenerator.setPalette(original, projected);
            const outputTex = this.regenerator.processCPU();
            
            if (this.debugMode) {
                print("ImagePipeline: Regeneration complete");
            }
        }
        
        this.pipelineState = "complete";
    }
    
    /**
     * Get extracted palette
     */
    public getExtractedPalette(): vec3[] {
        return this.extractor?.getExtractedPalette() || [];
    }
    
    /**
     * Get projected palette
     */
    public getProjectedPalette(): vec3[] {
        return this.projector?.getProjectedColors() || [];
    }
    
    /**
     * Get output texture
     */
    public getOutputTexture(): Texture {
        return this.regenerator?.getOutputTexture();
    }
    
    /**
     * Get pipeline state
     */
    public getState(): string {
        return this.pipelineState;
    }
    
    /**
     * Check if complete
     */
    public isComplete(): boolean {
        return this.pipelineState === "complete";
    }
}