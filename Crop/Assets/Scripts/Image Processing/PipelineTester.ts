// Test each pipeline step independently with mock data

@component
export class PipelineTester extends BaseScriptComponent {
    
    // ============ COMPONENT REFERENCES ============
    
    @input
    @hint("PaletteExtractor script")
    paletteExtractor: ScriptComponent;
    
    @input
    @hint("GamutProjector script")
    gamutProjector: ScriptComponent;
    
    @input
    @hint("ImageRegenerator script")
    imageRegenerator: ScriptComponent;
    
    // ============ TEST INPUTS ============
    
    @input
    @hint("Test image for extraction")
    testImage: Texture;
    
    @input
    @hint("Number of colors to extract")
    extractColors: number = 12;
    
    // ============ TEST CONTROL ============
    
    @input
    @hint("Which test to run: 0=none, 1=extraction, 2=projection, 3=regeneration, 4=full")
    testMode: number = 0;
    
    @input
    @hint("Auto-run test on start")
    autoRun: boolean = false;
    
    // ============ PRIVATE STATE ============
    
    private extractor: any;
    private projector: any;
    private regenerator: any;
    private isInitialized: boolean = false;
    private frameCount: number = 0;
    private testState: "idle" | "running" | "waiting" | "complete" = "idle";
    private waitFrames: number = 0;
    
    // Mock palettes for isolated testing
    private mockOriginalPalette: vec3[] = [];
    private mockProjectedPalette: vec3[] = [];
    
    // Results storage
    private extractedPalette: vec3[] = [];
    private projectedPalette: vec3[] = [];
    private outputTexture: Texture | null = null;
    
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }
    
    private initialize(): void {
        this.extractor = this.paletteExtractor as any;
        this.projector = this.gamutProjector as any;
        this.regenerator = this.imageRegenerator as any;
        
        // Create mock palettes
        this.createMockPalettes();
        
        this.isInitialized = true;
        print("PipelineTester: Ready");
        print("  Test modes: 1=extraction, 2=projection, 3=regeneration, 4=full");
        
        if (this.autoRun && this.testMode > 0) {
            this.runTest(this.testMode);
        }
    }
    
    private createMockPalettes(): void {
        // Mock original palette (varied colors)
        this.mockOriginalPalette = [
            new vec3(0.9, 0.2, 0.1),   // Red
            new vec3(0.1, 0.7, 0.2),   // Green
            new vec3(0.1, 0.3, 0.9),   // Blue
            new vec3(0.95, 0.9, 0.1),  // Yellow
            new vec3(0.1, 0.8, 0.8),   // Cyan
            new vec3(0.8, 0.1, 0.8),   // Magenta
            new vec3(0.95, 0.6, 0.2),  // Orange
            new vec3(0.5, 0.2, 0.6),   // Purple
            new vec3(0.95, 0.95, 0.95),// White
            new vec3(0.1, 0.1, 0.1),   // Black
            new vec3(0.6, 0.4, 0.2),   // Brown
            new vec3(0.4, 0.7, 0.4),   // Light green
        ];
        
        // Mock projected palette (simulated gamut-mapped versions)
        // These would normally come from GamutProjector
        this.mockProjectedPalette = [
            new vec3(0.85, 0.25, 0.15),  // Slightly shifted red
            new vec3(0.15, 0.65, 0.25),  // Slightly shifted green
            new vec3(0.2, 0.35, 0.8),    // Slightly shifted blue
            new vec3(0.9, 0.85, 0.15),   // Slightly shifted yellow
            new vec3(0.2, 0.7, 0.7),     // Slightly shifted cyan
            new vec3(0.7, 0.2, 0.7),     // Slightly shifted magenta
            new vec3(0.9, 0.55, 0.25),   // Slightly shifted orange
            new vec3(0.45, 0.25, 0.55),  // Slightly shifted purple
            new vec3(0.9, 0.9, 0.88),    // Slightly shifted white
            new vec3(0.12, 0.12, 0.12),  // Slightly shifted black
            new vec3(0.55, 0.4, 0.25),   // Slightly shifted brown
            new vec3(0.38, 0.65, 0.38),  // Slightly shifted light green
        ];
    }
    
    private onUpdate(): void {
        this.frameCount++;
        
        if (this.testState === "waiting") {
            this.waitFrames--;
            if (this.waitFrames <= 0) {
                this.continueTest();
            }
        }
    }
    
    // ============ PUBLIC API ============
    
    /**
     * Run a specific test
     */
    public runTest(mode: number): void {
        this.testMode = mode;
        
        switch (mode) {
            case 1:
                this.testExtraction();
                break;
            case 2:
                this.testProjection();
                break;
            case 3:
                this.testRegeneration();
                break;
            case 4:
                this.testFullPipeline();
                break;
            default:
                print("PipelineTester: Invalid test mode");
        }
    }
    
    /**
     * Test 1: Palette Extraction Only
     */
    public testExtraction(): void {
        print("\n=== TEST 1: PALETTE EXTRACTION ===");
        
        if (!this.extractor) {
            print("ERROR: No PaletteExtractor assigned");
            return;
        }
        
        if (!this.testImage) {
            print("ERROR: No testImage assigned");
            return;
        }
        
        this.testState = "running";
        
        // Set up extractor
        this.extractor.setInputTexture(this.testImage);
        this.extractor.paletteSize = this.extractColors;
        
        // Run extraction
        const startTime = Date.now();
        this.extractedPalette = this.extractor.extractPalette();
        const elapsed = Date.now() - startTime;
        
        // Report results
        print(`Extraction complete in ${elapsed}ms`);
        print(`Extracted ${this.extractedPalette.length} colors:`);
        
        for (let i = 0; i < this.extractedPalette.length; i++) {
            const c = this.extractedPalette[i];
            const hex = this.rgbToHex(c);
            print(`  [${i}] RGB(${(c.x * 255).toFixed(0)}, ${(c.y * 255).toFixed(0)}, ${(c.z * 255).toFixed(0)}) ${hex}`);
        }
        
        this.testState = "complete";
        print("=== EXTRACTION TEST COMPLETE ===\n");
    }
    
    /**
     * Test 2: Projection Only (with mock or extracted palette)
     */
    public testProjection(): void {
        print("\n=== TEST 2: GAMUT PROJECTION ===");
        
        if (!this.projector) {
            print("ERROR: No GamutProjector assigned");
            return;
        }
        
        if (!this.projector.isReady?.()) {
            print("ERROR: GamutProjector not ready (waiting for encoder)");
            return;
        }
        
        this.testState = "running";
        
        // Use extracted palette if available, otherwise use mock
        const inputPalette = this.extractedPalette.length > 0 
            ? this.extractedPalette 
            : this.mockOriginalPalette;
        
        print(`Projecting ${inputPalette.length} colors...`);
        
        // Send to projector
        this.projector.setInputColors(inputPalette);
        
        // Wait 2 frames for GPU
        this.testState = "waiting";
        this.waitFrames = 2;
    }
    
    private continueTest(): void {
        if (this.testMode === 2) {
            this.finishProjectionTest();
        } else if (this.testMode === 4) {
            this.continueFullPipeline();
        }
    }
    
    private finishProjectionTest(): void {
        // Read back projected colors
        this.projectedPalette = this.projector.getProjectedColors();
        const results = this.projector.getProjectionResults();
        
        print(`Projection complete: ${this.projectedPalette.length} colors`);
        print("");
        
        // Report deltas
        let totalDeltaE = 0;
        let maxDeltaE = 0;
        
        for (let i = 0; i < results.length; i++) {
            const r = results[i];
            totalDeltaE += r.deltaE;
            maxDeltaE = Math.max(maxDeltaE, r.deltaE);
            
            const inHex = this.rgbToHex(r.input);
            const outHex = this.rgbToHex(r.projected);
            print(`  [${i}] ${inHex} → ${outHex}  ΔE=${r.deltaE.toFixed(2)}`);
        }
        
        print("");
        print(`Average ΔE: ${(totalDeltaE / results.length).toFixed(2)}`);
        print(`Max ΔE: ${maxDeltaE.toFixed(2)}`);
        
        this.testState = "complete";
        print("=== PROJECTION TEST COMPLETE ===\n");
    }
    
    /**
     * Test 3: Regeneration Only (with mock palette)
     */
    public testRegeneration(): void {
        print("\n=== TEST 3: IMAGE REGENERATION ===");
        
        if (!this.regenerator) {
            print("ERROR: No ImageRegenerator assigned");
            return;
        }
        
        if (!this.testImage) {
            print("ERROR: No testImage assigned");
            return;
        }
        
        if (!this.regenerator.isReady?.()) {
            print("ERROR: ImageRegenerator not ready");
            return;
        }
        
        this.testState = "running";
        
        // Use projected palette if available, otherwise use mock
        const original = this.extractedPalette.length > 0 
            ? this.extractedPalette 
            : this.mockOriginalPalette;
            
        const projected = this.projectedPalette.length > 0 
            ? this.projectedPalette 
            : this.mockProjectedPalette;
        
        print(`Using ${original.length} original colors`);
        print(`Using ${projected.length} projected colors`);
        
        // Set input texture
        this.regenerator.inputTexture = this.testImage;
        
        // Set palette
        this.regenerator.setPalette(original, projected);
        
        // Process
        const startTime = Date.now();
        this.outputTexture = this.regenerator.processCPU();
        const elapsed = Date.now() - startTime;
        
        if (this.outputTexture) {
            print(`Regeneration complete in ${elapsed}ms`);
            print(`Output size: ${this.outputTexture.getWidth()}x${this.outputTexture.getHeight()}`);
        } else {
            print("ERROR: Regeneration failed");
        }
        
        this.testState = "complete";
        print("=== REGENERATION TEST COMPLETE ===\n");
    }
    
    /**
     * Test 4: Full Pipeline
     */
    public testFullPipeline(): void {
        print("\n=== TEST 4: FULL PIPELINE ===");
        print("Step 1/3: Extraction");
        
        if (!this.extractor || !this.projector || !this.regenerator) {
            print("ERROR: Missing pipeline components");
            return;
        }
        
        if (!this.testImage) {
            print("ERROR: No testImage assigned");
            return;
        }
        
        this.testState = "running";
        
        // Step 1: Extract
        this.extractor.setInputTexture(this.testImage);
        this.extractor.paletteSize = this.extractColors;
        this.extractedPalette = this.extractor.extractPalette();
        
        print(`  Extracted ${this.extractedPalette.length} colors`);
        
        if (this.extractedPalette.length === 0) {
            print("ERROR: Extraction failed");
            this.testState = "complete";
            return;
        }
        
        // Step 2: Project (async)
        print("Step 2/3: Projection");
        
        if (!this.projector.isReady?.()) {
            print("  WARNING: Projector not ready, using mock projection");
            this.projectedPalette = this.extractedPalette; // Pass-through
            this.finishFullPipeline();
            return;
        }
        
        this.projector.setInputColors(this.extractedPalette);
        this.testState = "waiting";
        this.waitFrames = 2;
    }
    
    private continueFullPipeline(): void {
        // Get projected colors
        this.projectedPalette = this.projector.getProjectedColors();
        
        if (this.projectedPalette.length === 0) {
            print("  WARNING: Projection returned empty, using original");
            this.projectedPalette = this.extractedPalette;
        } else {
            const results = this.projector.getProjectionResults();
            const avgDeltaE = results.reduce((s, r) => s + r.deltaE, 0) / results.length;
            print(`  Projected ${this.projectedPalette.length} colors (avg ΔE=${avgDeltaE.toFixed(2)})`);
        }
        
        this.finishFullPipeline();
    }
    
    private finishFullPipeline(): void {
        // Step 3: Regenerate
        print("Step 3/3: Regeneration");
        
        if (!this.regenerator.isReady?.()) {
            print("ERROR: Regenerator not ready");
            this.testState = "complete";
            return;
        }
        
        this.regenerator.inputTexture = this.testImage;
        this.regenerator.setPalette(this.extractedPalette, this.projectedPalette);
        
        const startTime = Date.now();
        this.outputTexture = this.regenerator.processCPU();
        const elapsed = Date.now() - startTime;
        
        if (this.outputTexture) {
            print(`  Regenerated in ${elapsed}ms`);
        } else {
            print("ERROR: Regeneration failed");
        }
        
        this.testState = "complete";
        print("=== FULL PIPELINE COMPLETE ===\n");
        
        this.printSummary();
    }
    
    private printSummary(): void {
        print("--- PIPELINE SUMMARY ---");
        print(`Input: ${this.testImage?.getWidth()}x${this.testImage?.getHeight()}`);
        print(`Palette: ${this.extractedPalette.length} colors extracted`);
        print(`Projection: ${this.projectedPalette.length} colors mapped`);
        
        if (this.outputTexture) {
            print(`Output: ${this.outputTexture.getWidth()}x${this.outputTexture.getHeight()}`);
        }
        
        // Calculate average color shift
        if (this.projectedPalette.length > 0 && this.extractedPalette.length > 0) {
            let totalShift = 0;
            const count = Math.min(this.extractedPalette.length, this.projectedPalette.length);
            
            for (let i = 0; i < count; i++) {
                const o = this.extractedPalette[i];
                const p = this.projectedPalette[i];
                const shift = Math.sqrt(
                    Math.pow(o.x - p.x, 2) + 
                    Math.pow(o.y - p.y, 2) + 
                    Math.pow(o.z - p.z, 2)
                );
                totalShift += shift;
            }
            
            print(`Avg RGB shift: ${(totalShift / count * 255).toFixed(1)}`);
        }
        print("------------------------");
    }
    
    // ============ UTILITY ============
    
    private rgbToHex(c: vec3): string {
        const r = Math.round(c.x * 255).toString(16).padStart(2, '0');
        const g = Math.round(c.y * 255).toString(16).padStart(2, '0');
        const b = Math.round(c.z * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
    
    // ============ GETTERS ============
    
    public getExtractedPalette(): vec3[] {
        return [...this.extractedPalette];
    }
    
    public getProjectedPalette(): vec3[] {
        return [...this.projectedPalette];
    }
    
    public getOutputTexture(): Texture | null {
        return this.outputTexture;
    }
    
    public isComplete(): boolean {
        return this.testState === "complete";
    }
    
    public getState(): string {
        return this.testState;
    }
}