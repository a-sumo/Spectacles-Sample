// PipelineTester.ts
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

	// ============ PREVIEW OUTPUT ============

	@input
	@hint("SceneObject with RenderMeshVisual to display output")
	previewMesh: SceneObject;

	@input
	@hint("Also show original on a second mesh")
	originalMesh: SceneObject;

	// ============ TEST CONTROL ============

	@input
	@hint(
		"Which test to run: 0=none, 1=extraction, 2=projection, 3=regeneration, 4=full"
	)
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

	// Preview materials (cached)
	private previewMaterial: Material | null = null;
	private originalMaterial: Material | null = null;

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

		// Cache preview materials
		this.setupPreviewMeshes();

		this.isInitialized = true;
		print("PipelineTester: Ready");
		print("  Test modes: 1=extraction, 2=projection, 3=regeneration, 4=full");

		if (this.autoRun && this.testMode > 0) {
			this.runTest(this.testMode);
		}
	}

	private setupPreviewMeshes(): void {
		// Setup output preview mesh
		if (this.previewMesh) {
			const rmv = this.previewMesh.getComponent(
				"Component.RenderMeshVisual"
			) as RenderMeshVisual;
			if (rmv) {
				// Clone material so we don't affect other objects
				this.previewMaterial = rmv.mainMaterial.clone();
				rmv.mainMaterial = this.previewMaterial;
				print("PipelineTester: Preview mesh ready");
			} else {
				print("WARNING: previewMesh has no RenderMeshVisual");
			}
		}

		// Setup original preview mesh
		if (this.originalMesh) {
			const rmv = this.originalMesh.getComponent(
				"Component.RenderMeshVisual"
			) as RenderMeshVisual;
			if (rmv) {
				this.originalMaterial = rmv.mainMaterial.clone();
				rmv.mainMaterial = this.originalMaterial;

				// Set original image immediately if available
				if (this.testImage) {
					this.setMaterialTexture(this.originalMaterial, this.testImage);
					print("PipelineTester: Original mesh showing input");
				}
			}
		}
	}

	private setMaterialTexture(material: Material, texture: Texture): void {
		if (!material || !texture) return;

		const pass = material.mainPass;

		// Try common texture property names
		const textureNames = ["baseTex", "mainTex", "diffuseTex", "baseColor"];

		for (const name of textureNames) {
			try {
				pass.baseTex = texture;
				return;
			} catch (e) {
				print("Property doesn't exist, try next");
			}
		}

		// Fallback: try setting directly
		try {
			(pass as any).baseTex = texture;
		} catch (e) {
			print("WARNING: Could not set texture on material");
		}
	}

	private updatePreview(): void {
		if (this.previewMaterial && this.outputTexture) {
			this.setMaterialTexture(this.previewMaterial, this.outputTexture);
			print("PipelineTester: Preview updated with output texture");
		}
	}

	private createMockPalettes(): void {
		// Mock original palette (varied colors)
		this.mockOriginalPalette = [
			new vec3(0.9, 0.2, 0.1), // Red
			new vec3(0.1, 0.7, 0.2), // Green
			new vec3(0.1, 0.3, 0.9), // Blue
			new vec3(0.95, 0.9, 0.1), // Yellow
			new vec3(0.1, 0.8, 0.8), // Cyan
			new vec3(0.8, 0.1, 0.8), // Magenta
			new vec3(0.95, 0.6, 0.2), // Orange
			new vec3(0.5, 0.2, 0.6), // Purple
			new vec3(0.95, 0.95, 0.95), // White
			new vec3(0.1, 0.1, 0.1), // Black
			new vec3(0.6, 0.4, 0.2), // Brown
			new vec3(0.4, 0.7, 0.4), // Light green
		];

		// Mock projected palette (simulated gamut-mapped versions)
		this.mockProjectedPalette = [
			new vec3(0.85, 0.25, 0.15),
			new vec3(0.15, 0.65, 0.25),
			new vec3(0.2, 0.35, 0.8),
			new vec3(0.9, 0.85, 0.15),
			new vec3(0.2, 0.7, 0.7),
			new vec3(0.7, 0.2, 0.7),
			new vec3(0.9, 0.55, 0.25),
			new vec3(0.45, 0.25, 0.55),
			new vec3(0.9, 0.9, 0.88),
			new vec3(0.12, 0.12, 0.12),
			new vec3(0.55, 0.4, 0.25),
			new vec3(0.38, 0.65, 0.38),
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

		this.extractor.setInputTexture(this.testImage);
		this.extractor.paletteSize = this.extractColors;

		const startTime = Date.now();
		this.extractedPalette = this.extractor.extractPalette();
		const elapsed = Date.now() - startTime;

		print(`Extraction complete in ${elapsed}ms`);
		print(`Extracted ${this.extractedPalette.length} colors:`);

		for (let i = 0; i < this.extractedPalette.length; i++) {
			const c = this.extractedPalette[i];
			const hex = this.rgbToHex(c);
			print(
				`  [${i}] RGB(${(c.x * 255).toFixed(0)}, ${(c.y * 255).toFixed(0)}, ${(
					c.z * 255
				).toFixed(0)}) ${hex}`
			);
		}

		this.testState = "complete";
		print("=== EXTRACTION TEST COMPLETE ===\n");
	}

	private projectionRetryCount: number = 0;

	public testProjection(): void {
		print("\n=== TEST 2: GAMUT PROJECTION ===");

		if (!this.projector) {
			print("ERROR: No GamutProjector assigned");
			return;
		}

		if (!this.projector.isReady?.()) {
			this.projectionRetryCount++;
			if (this.projectionRetryCount > 50) {
				print("ERROR: GamutProjector failed to initialize after 50 retries");
				this.testState = "complete";
				return;
			}
			print(`WARNING: GamutProjector not ready, retrying... (${this.projectionRetryCount})`);
			this.testState = "waiting";
			this.waitFrames = 3;
			this.testMode = 2; // Ensure continueTest calls the right method
			return;
		}

		this.projectionRetryCount = 0;
		this.testState = "running";

		const inputPalette =
			this.extractedPalette.length > 0
				? this.extractedPalette
				: this.mockOriginalPalette;

		print(`Projecting ${inputPalette.length} colors...`);

		this.projector.setInputColors(inputPalette);

		this.testState = "waiting";
		this.waitFrames = 2;
	}

	private continueTest(): void {
		if (this.testMode === 2) {
			// Check if we're still waiting for projector to be ready
			if (this.projectionRetryCount > 0 && !this.projector.isReady?.()) {
				this.testProjection();
			} else {
				this.finishProjectionTest();
			}
		} else if (this.testMode === 4) {
			this.continueFullPipeline();
		}
	}

	private finishProjectionTest(): void {
		this.projectedPalette = this.projector.getProjectedColors();
		const results = this.projector.getProjectionResults();

		print(`Projection complete: ${this.projectedPalette.length} colors`);
		print("");

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

		if (!this.regenerator.isReady()) {
			print("ERROR: ImageRegenerator not ready");
			return;
		}

		this.testState = "running";

		const original =
			this.extractedPalette.length > 0
				? this.extractedPalette
				: this.mockOriginalPalette;

		const projected =
			this.projectedPalette.length > 0
				? this.projectedPalette
				: this.mockProjectedPalette;

		print("Using " + original.length + " original colors");
		print("Using " + projected.length + " projected colors");

		this.regenerator.setInputTexture(this.testImage);
		this.regenerator.setPalette(original, projected);

		if (this.previewMesh) {
			const rmv = this.previewMesh.getComponent(
				"Component.RenderMeshVisual"
			) as RenderMeshVisual;
			if (rmv) {
				this.regenerator.applyToMesh(rmv);
				print("Applied remapped material to preview mesh");
			}
		}

		this.testState = "complete";
		print("=== REGENERATION TEST COMPLETE ===\n");
	}

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

		// Update original preview
		if (this.originalMaterial) {
			this.setMaterialTexture(this.originalMaterial, this.testImage);
		}

		// Step 1: Extract
		this.regenerator.inputTexture = this.testImage;
		this.extractor.paletteSize = this.extractColors;
		this.extractedPalette = this.extractor.extractPalette();

		print(`  Extracted ${this.extractedPalette.length} colors`);

		if (this.extractedPalette.length === 0) {
			print("ERROR: Extraction failed");
			this.testState = "complete";
			return;
		}

		// Step 2: Project
		print("Step 2/3: Projection");

		if (!this.projector.isReady?.()) {
			print("  WARNING: Projector not ready, using pass-through");
			this.projectedPalette = this.extractedPalette;
			this.finishFullPipeline();
			return;
		}

		this.projector.setInputColors(this.extractedPalette);
		this.testState = "waiting";
		this.waitFrames = 2;
	}

	private continueFullPipeline(): void {
		this.projectedPalette = this.projector.getProjectedColors();

		if (this.projectedPalette.length === 0) {
			print("  WARNING: Projection returned empty, using original");
			this.projectedPalette = this.extractedPalette;
		} else {
			const results = this.projector.getProjectionResults();
			const avgDeltaE =
				results.reduce((s: number, r: any) => s + r.deltaE, 0) / results.length;
			print(
				`  Projected ${
					this.projectedPalette.length
				} colors (avg ΔE=${avgDeltaE.toFixed(2)})`
			);
		}

		this.finishFullPipeline();
	}

	private finishFullPipeline(): void {
		print("Step 3/3: Regeneration");

		this.regenerator.setInputTexture(this.testImage);
		this.regenerator.setPalette(this.extractedPalette, this.projectedPalette);

		// Apply to preview mesh using GPU-based material
		if (this.previewMesh) {
			const rmv = this.previewMesh.getComponent(
				"Component.RenderMeshVisual"
			) as RenderMeshVisual;
			if (rmv) {
				this.regenerator.applyToMesh(rmv);
				print("  Applied remapped material to preview mesh");
			}
		}

		this.testState = "complete";
		print("=== FULL PIPELINE COMPLETE ===\n");

		this.printSummary();
	}

	private printSummary(): void {
		print("--- PIPELINE SUMMARY ---");
		print(
			`Input: ${this.testImage?.getWidth()}x${this.testImage?.getHeight()}`
		);
		print(`Palette: ${this.extractedPalette.length} colors extracted`);
		print(`Projection: ${this.projectedPalette.length} colors mapped`);
		print(`Output: GPU material applied`);

		if (this.previewMesh) {
			print(`Preview: Updated on ${this.previewMesh.name}`);
		}

		print("------------------------");
	}

	// ============ UTILITY ============

	private rgbToHex(c: vec3): string {
		const r = Math.round(c.x * 255)
			.toString(16)
			.padStart(2, "0");
		const g = Math.round(c.y * 255)
			.toString(16)
			.padStart(2, "0");
		const b = Math.round(c.z * 255)
			.toString(16)
			.padStart(2, "0");
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

	/**
	 * Manually set output to a different mesh
	 */
	public setOutputToMesh(mesh: SceneObject): void {
		if (!this.outputTexture) {
			print("No output texture to display");
			return;
		}

		const rmv = mesh.getComponent(
			"Component.RenderMeshVisual"
		) as RenderMeshVisual;
		if (rmv && rmv.mainMaterial) {
			this.setMaterialTexture(rmv.mainMaterial, this.outputTexture);
			print(`Set output texture on ${mesh.name}`);
		}
	}
}
