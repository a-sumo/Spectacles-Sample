// Orchestrates the image → palette → projection → regeneration pipeline

@component
export class ImageProcessingPipeline extends BaseScriptComponent {
    // ============ COMPONENT REFERENCES ============

    @input
    @hint("PaletteExtractor script")
    paletteExtractor: ScriptComponent;

    @input
    @hint("Projector_Gamut script")
    gamutProjector: ScriptComponent;

    @input
    @hint("ImageRegenerator script")
    imageRegenerator: ScriptComponent;

    // ============ INPUTS ============

    @input
    @hint("Input image for extraction")
    inputTexture: Texture;

    @input
    @hint("Number of colors to extract")
    paletteSize: number = 12;

    // ============ PREVIEW OUTPUT ============

    @input
    @hint("SceneObject with RenderMeshVisual to display output")
    previewMesh: SceneObject;

    @input
    @hint("Also show original on a second mesh")
    originalMesh: SceneObject;

    // ============ CONTROL ============

    @input
    @hint("Auto-run pipeline on start")
    autoRun: boolean = false;

    @input
    @hint("PaletteController to listen for preset changes")
    paletteController: ScriptComponent;

    @input
    @hint("Auto re-project when preset changes")
    autoReprojectOnPresetChange: boolean = true;

    @input
    debugMode: boolean = true;

    // ============ PRIVATE STATE ============

    private extractor: any;
    private projector: any;
    private regenerator: any;
    private pipelineState: "idle" | "running" | "waiting" | "complete" = "idle";
    private waitFrames: number = 0;
    private currentMode: number = 0; // 0=idle, 4=full, 5=reproject

    // Preview materials (cached)
    private previewMaterial: Material | null = null;
    private originalMaterial: Material | null = null;

    // Results storage
    private extractedPalette: vec3[] = [];
    private projectedPalette: vec3[] = [];

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    private initialize(): void {
        this.extractor = this.paletteExtractor as any;
        this.projector = this.gamutProjector as any;
        this.regenerator = this.imageRegenerator as any;

        // Setup preview meshes
        this.setupPreviewMeshes();

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

        if (this.autoRun) {
            this.waitForReadyAndRun();
        }
    }

    private setupPreviewMeshes(): void {
        // Setup output preview mesh
        if (this.previewMesh) {
            const rmv = this.previewMesh.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv) {
                this.previewMaterial = rmv.mainMaterial.clone();
                rmv.mainMaterial = this.previewMaterial;
                if (this.debugMode) {
                    print("ImagePipeline: Preview mesh ready");
                }
            }
        }

        // Setup original preview mesh
        if (this.originalMesh) {
            const rmv = this.originalMesh.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv) {
                this.originalMaterial = rmv.mainMaterial.clone();
                rmv.mainMaterial = this.originalMaterial;

                if (this.inputTexture) {
                    this.setMaterialTexture(this.originalMaterial, this.inputTexture);
                    if (this.debugMode) {
                        print("ImagePipeline: Original mesh showing input");
                    }
                }
            }
        }
    }

    private setMaterialTexture(material: Material, texture: Texture): void {
        if (!material || !texture) return;
        try {
            material.mainPass.baseTex = texture;
        } catch (e) {
            if (this.debugMode) {
                print("ImagePipeline: Could not set texture on material");
            }
        }
    }

    private waitForReadyAndRun(): void {
        const projectorReady = this.projector?.isReady?.();
        const textureReady = this.isTextureReady(this.inputTexture);

        if (projectorReady && textureReady) {
            if (this.debugMode) {
                print("ImagePipeline: Components ready, starting pipeline");
            }
            this.run();
        } else {
            const delayEvent = this.createEvent("DelayedCallbackEvent");
            delayEvent.bind(() => this.waitForReadyAndRun());
            delayEvent.reset(0.1);
        }
    }

    private isTextureReady(texture: Texture): boolean {
        if (!texture) return false;
        const colorspace = texture.getColorspace();
        const width = texture.getWidth();
        const height = texture.getHeight();
        return colorspace === 3 && width > 0 && height > 0;
    }

    private onPaletteChanged(changeType: string, presetName: string | null): void {
        if (this.extractedPalette.length === 0) {
            if (this.debugMode) {
                print(`ImagePipeline: Palette changed (${changeType}) but no palette extracted yet`);
            }
            return;
        }

        const label = presetName ? `preset '${presetName}'` : changeType;
        if (this.debugMode) {
            print(`ImagePipeline: Palette changed (${label}), re-projecting...`);
        }

        this.reprojectCurrentPalette();
    }

    private onUpdate(): void {
        if (this.pipelineState === "waiting") {
            this.waitFrames--;
            if (this.waitFrames <= 0) {
                this.continueAfterWait();
            }
        }
    }

    private continueAfterWait(): void {
        if (this.currentMode === 4) {
            this.finishFullPipeline();
        } else if (this.currentMode === 5) {
            this.finishReproject();
        }
    }

    // ============ PUBLIC API ============

    /**
     * Run the full pipeline: extract → project → regenerate
     */
    public run(): void {
        if (this.debugMode) {
            print("\n=== RUNNING FULL PIPELINE ===");
            print("Step 1/3: Extraction");
        }

        if (!this.extractor || !this.projector || !this.regenerator) {
            print("ImagePipeline ERROR: Missing pipeline components");
            return;
        }

        if (!this.inputTexture) {
            print("ImagePipeline ERROR: No inputTexture assigned");
            return;
        }

        this.pipelineState = "running";
        this.currentMode = 4;

        // Update original preview
        if (this.originalMaterial) {
            this.setMaterialTexture(this.originalMaterial, this.inputTexture);
        }

        // Step 1: Extract
        this.extractor.setInputTexture(this.inputTexture);
        this.extractor.paletteSize = this.paletteSize;
        this.extractedPalette = this.extractor.extractPalette();

        if (this.debugMode) {
            print(`  Extracted ${this.extractedPalette.length} colors`);
        }

        if (this.extractedPalette.length === 0) {
            print("ImagePipeline ERROR: Extraction failed");
            this.pipelineState = "idle";
            return;
        }

        // Step 2: Project
        if (this.debugMode) {
            print("Step 2/3: Projection");
        }

        if (!this.projector.isReady?.()) {
            if (this.debugMode) {
                print("  WARNING: Projector not ready, using pass-through");
            }
            this.projectedPalette = this.extractedPalette;
            this.finishFullPipeline();
            return;
        }

        this.projector.setInputColors(this.extractedPalette);
        this.pipelineState = "waiting";
        this.waitFrames = 2;
    }

    private finishFullPipeline(): void {
        this.projectedPalette = this.projector.getProjectedColors();

        if (this.projectedPalette.length === 0) {
            if (this.debugMode) {
                print("  WARNING: Projection returned empty, using original");
            }
            this.projectedPalette = this.extractedPalette;
        } else if (this.debugMode) {
            const results = this.projector.getProjectionResults();
            const avgDeltaE = results.reduce((s: number, r: any) => s + r.deltaE, 0) / results.length;
            print(`  Projected ${this.projectedPalette.length} colors (avg ΔE=${avgDeltaE.toFixed(2)})`);

            // Show first few color mappings
            print("  Color mapping (first 3):");
            for (let i = 0; i < Math.min(3, results.length); i++) {
                const r = results[i];
                const inHex = this.rgbToHex(r.input);
                const outHex = this.rgbToHex(r.projected);
                print(`    [${i}] ${inHex} -> ${outHex} (ΔE=${r.deltaE.toFixed(1)})`);
            }
        }

        // Step 3: Regenerate
        if (this.debugMode) {
            print("Step 3/3: Regeneration");
        }

        this.regenerator.setInputTexture(this.inputTexture);
        this.regenerator.setPalette(this.extractedPalette, this.projectedPalette);

        // Apply to preview mesh
        if (this.previewMesh) {
            const rmv = this.previewMesh.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv) {
                this.regenerator.applyToMesh(rmv);
                if (this.debugMode) {
                    print("  Applied remapped material to preview mesh");
                }
            }
        }

        this.pipelineState = "complete";

        if (this.debugMode) {
            print("=== PIPELINE COMPLETE ===");
            this.printSummary();
        }
    }

    /**
     * Re-project the current extracted palette with the updated gamut
     * Call this when pigment preset changes
     */
    public reprojectCurrentPalette(): void {
        if (this.extractedPalette.length === 0) {
            if (this.debugMode) {
                print("ImagePipeline: No palette to re-project");
            }
            return;
        }

        if (!this.projector?.isReady?.()) {
            print("ImagePipeline: Projector not ready");
            return;
        }

        this.projector.invalidateResults?.();
        this.projector.setInputColors(this.extractedPalette);
        this.pipelineState = "waiting";
        this.waitFrames = 2;
        this.currentMode = 5;

        if (this.debugMode) {
            print(`ImagePipeline: Re-projecting ${this.extractedPalette.length} colors with new gamut`);
        }
    }

    private finishReproject(): void {
        this.projectedPalette = this.projector.getProjectedColors();
        const results = this.projector.getProjectionResults();

        if (this.projectedPalette.length === 0) {
            print("ImagePipeline: Re-projection failed, keeping previous results");
            this.pipelineState = "complete";
            return;
        }

        if (this.debugMode) {
            const avgDeltaE = results.reduce((s: number, r: any) => s + r.deltaE, 0) / results.length;
            print(`ImagePipeline: Re-projected ${this.projectedPalette.length} colors (avg ΔE=${avgDeltaE.toFixed(2)})`);

            print("  New color mapping (first 3):");
            for (let i = 0; i < Math.min(3, results.length); i++) {
                const r = results[i];
                const inHex = this.rgbToHex(r.input);
                const outHex = this.rgbToHex(r.projected);
                print(`    [${i}] ${inHex} -> ${outHex} (ΔE=${r.deltaE.toFixed(1)})`);
            }
        }

        // Update regenerator with new projected palette
        this.regenerator.setInputTexture(this.inputTexture);
        this.regenerator.setPalette(this.extractedPalette, this.projectedPalette);

        // Re-apply to preview mesh
        if (this.previewMesh) {
            const rmv = this.previewMesh.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv) {
                this.regenerator.applyToMesh(rmv);
                if (this.debugMode) {
                    print("ImagePipeline: Updated preview mesh with new projection");
                }
            }
        }

        this.pipelineState = "complete";
    }

    /**
     * Set input texture and optionally run pipeline
     */
    public setInputTexture(texture: Texture, autoRunPipeline: boolean = false): void {
        this.inputTexture = texture;

        // Update original mesh preview
        if (this.originalMaterial) {
            this.setMaterialTexture(this.originalMaterial, texture);
        }

        if (autoRunPipeline) {
            this.waitForReadyAndRun();
        }
    }

    private printSummary(): void {
        print("--- PIPELINE SUMMARY ---");
        print(`Input: ${this.inputTexture?.getWidth()}x${this.inputTexture?.getHeight()}`);
        print(`Palette: ${this.extractedPalette.length} colors extracted`);
        print(`Projection: ${this.projectedPalette.length} colors mapped`);
        print(`Output: GPU material applied`);
        if (this.previewMesh) {
            print(`Preview: Updated on ${this.previewMesh.name}`);
        }
        print("------------------------");
    }

    private rgbToHex(c: vec3): string {
        const r = Math.round(c.x * 255).toString(16).padStart(2, "0");
        const g = Math.round(c.y * 255).toString(16).padStart(2, "0");
        const b = Math.round(c.z * 255).toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
    }

    // ============ GETTERS ============

    public getExtractedPalette(): vec3[] {
        return [...this.extractedPalette];
    }

    public getProjectedPalette(): vec3[] {
        return [...this.projectedPalette];
    }

    public getState(): string {
        return this.pipelineState;
    }

    public isComplete(): boolean {
        return this.pipelineState === "complete";
    }

    /**
     * Apply output to a different mesh
     */
    public applyToMesh(mesh: SceneObject): void {
        if (this.extractedPalette.length === 0 || this.projectedPalette.length === 0) {
            print("ImagePipeline: No palette data to apply");
            return;
        }

        const rmv = mesh.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
        if (rmv) {
            this.regenerator.applyToMesh(rmv);
            if (this.debugMode) {
                print(`ImagePipeline: Applied to ${mesh.name}`);
            }
        }
    }
}
