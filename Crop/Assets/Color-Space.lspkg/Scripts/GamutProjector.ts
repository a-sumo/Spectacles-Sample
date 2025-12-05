// GamutProjector.ts
// Projects a set of colors (set2) onto the pigment gamut (set1) → outputs set3

@component
export class GamutProjector extends BaseScriptComponent {
	@input
	@hint("Material with GamutProjection shader")
	projectionMaterial: Material;

	@input
	@hint("Reference to PigmentGamutEncoder script component")
	gamutEncoder: ScriptComponent;
	// Add input for VFX component
	@input
	@hint("VFX component to receive projected textures")
	vfxComponent: VFXComponent;

	// ============ TEXTURE SIZE CONFIGURATION ============

	@input
	@hint(
		"Size of gamut texture from encoder (e.g., 64 means 64x64 = 4096 pixels)"
	)
	gamutTexSize: number = 64;

	@input
	@hint("Actual number of valid colors in gamut (from encoder log)")
	gamutValidCount: number = 2000;

	@input
	@hint("Width of input texture (number of colors to project per row)")
	inputTexWidth: number = 8;

	@input
	@hint("Height of input texture (number of rows)")
	inputTexHeight: number = 8;
	// Total input capacity = inputTexWidth * inputTexHeight = 64 colors

	// ============ INPUT COLORS (SET2) ============
	// These are the colors we want to project onto the gamut

	@input
	@widget(new ColorWidget())
	input0: vec3 = new vec3(1.0, 0.5, 0.0); // Orange

	@input
	@widget(new ColorWidget())
	input1: vec3 = new vec3(0.0, 1.0, 0.5); // Cyan-ish

	@input
	@widget(new ColorWidget())
	input2: vec3 = new vec3(0.5, 0.0, 1.0); // Purple

	@input
	@widget(new ColorWidget())
	input3: vec3 = new vec3(1.0, 1.0, 0.0); // Yellow

	@input
	@widget(new ColorWidget())
	input4: vec3 = new vec3(0.0, 0.5, 0.3); // Teal

	@input
	@widget(new ColorWidget())
	input5: vec3 = new vec3(0.8, 0.2, 0.2); // Red

	// ============ PRIVATE STATE ============

	// Textures from encoder (set1 - the gamut)
	private gamutPosTexture: Texture; // 64x64, LAB positions of gamut colors
	private gamutColorTexture: Texture; // 64x64, RGB values of gamut colors

	// Input texture (set2 - colors to project)
	private inputPosTexture: Texture; // inputTexWidth x inputTexHeight, LAB of input colors

	// Output render targets (set3 - projected colors)
	private projectedPosRT: Texture; // inputTexWidth x inputTexHeight, LAB of nearest gamut colors
	private projectedColorRT: Texture; // inputTexWidth x inputTexHeight, RGB of nearest gamut colors

	private inputColors: vec3[] = [];
	private isInitialized: boolean = false;

	onAwake(): void {
		// Wait a frame for encoder to initialize its render targets
		this.createEvent("UpdateEvent").bind(() => this.tryInitialize());
	}

	private tryInitialize(): void {
		if (this.isInitialized) return;

		// ============ VALIDATION ============

		if (!this.projectionMaterial) {
			print("ERROR: projectionMaterial not set");
			return;
		}

		if (!this.gamutEncoder) {
			print("ERROR: gamutEncoder script reference not set");
			return;
		}

		// ============ GET RENDER TARGETS FROM ENCODER ============

		const encoder = this.gamutEncoder as any;

		// Try getter methods first, then direct property access
		this.gamutPosTexture =
			encoder.getPosRenderTarget?.() || encoder.posRenderTarget;
		this.gamutColorTexture =
			encoder.getColorRenderTarget?.() || encoder.colorRenderTarget;

		// Also get valid count from encoder if available
		const encoderValidCount = encoder.getGamutValidCount?.();
		if (encoderValidCount !== undefined) {
			this.gamutValidCount = encoderValidCount;
			print(`Got gamutValidCount from encoder: ${this.gamutValidCount}`);
		}
		print("Got render targets from encoder:");
		print(
			`  - gamutPosTexture: ${this.gamutTexSize}x${this.gamutTexSize} (${
				this.gamutTexSize * this.gamutTexSize
			} pixels)`
		);
		print(`  - gamutColorTexture: ${this.gamutTexSize}x${this.gamutTexSize}`);
		print(`  - Valid gamut entries: ${this.gamutValidCount}`);

		// ============ COLLECT INPUT COLORS ============

		this.inputColors = [
			this.input0,
			this.input1,
			this.input2,
			this.input3,
			this.input4,
			this.input5,
		];

		print(`Input colors (set2): ${this.inputColors.length} colors`);
		print(
			`Input texture size: ${this.inputTexWidth}x${this.inputTexHeight} = ${
				this.inputTexWidth * this.inputTexHeight
			} pixel capacity`
		);

		// ============ CREATE INPUT TEXTURE (SET2 IN LAB) ============

		this.inputPosTexture = ProceduralTextureProvider.createWithFormat(
			this.inputTexWidth,
			this.inputTexHeight,
			TextureFormat.RGBA8Unorm
		);
		this.updateInputTexture();

		// ============ CREATE OUTPUT RENDER TARGETS (SET3) ============

		const outputRes = new vec2(this.inputTexWidth, this.inputTexHeight);
		this.projectedPosRT = this.createRenderTarget(outputRes);
		this.projectedColorRT = this.createRenderTarget(outputRes);

		print(
			`Output textures (set3): ${this.inputTexWidth}x${this.inputTexHeight}`
		);

		// GamutProjector.ts - Add this debug section after material setup

		// ============ SETUP MATERIAL ============

		const material = this.projectionMaterial.clone();

		material.mainPass.gamutPosTex = this.gamutPosTexture;
		material.mainPass.gamutColorTex = this.gamutColorTexture;
		material.mainPass.inputPosTex = this.inputPosTexture;
		material.mainPass.gamutTexSize = this.gamutTexSize;
		material.mainPass.inputTexWidth = this.inputTexWidth;
		material.mainPass.inputTexHeight = this.inputTexHeight;
		material.mainPass.gamutValidCount = this.gamutValidCount;

		// DEBUG: Verify material properties were set
		print("=== MATERIAL DEBUG ===");
		print(`  gamutPosTex assigned: ${material.mainPass.gamutPosTex !== null}`);
		print(
			`  gamutColorTex assigned: ${material.mainPass.gamutColorTex !== null}`
		);
		print(`  inputPosTex assigned: ${material.mainPass.inputPosTex !== null}`);
		print(`  gamutTexSize: ${material.mainPass.gamutTexSize}`);
		print(`  gamutValidCount: ${material.mainPass.gamutValidCount}`);

		// DEBUG: Try reading a value from gamut texture to verify it's accessible
		print("=== GAMUT TEXTURE VERIFICATION ===");
		try {
			const tempGamut = ProceduralTextureProvider.createFromTexture(
				this.gamutPosTexture
			);
			const gamutProvider = tempGamut.control as ProceduralTextureProvider;
			const gamutPixels = new Uint8Array(16);
			gamutProvider.getPixels(0, 0, 2, 2, gamutPixels);
			print(
				`  Gamut[0]: R=${gamutPixels[0]} G=${gamutPixels[1]} B=${gamutPixels[2]} A=${gamutPixels[3]}`
			);
			print(
				`  Gamut[1]: R=${gamutPixels[4]} G=${gamutPixels[5]} B=${gamutPixels[6]} A=${gamutPixels[7]}`
			);
		} catch (e) {
			print(`  Gamut read error: ${e}`);
		}

		// ============ CREATE RENDER PIPELINE ============

		const layer = LayerSet.makeUnique();
		const cameraObj = this.createProjectionCamera(layer);
		this.createPostEffect(cameraObj, material, layer);

		this.isInitialized = true;
		print("GamutProjector initialized successfully");
        this.assignToVFX();
		// ============ SETUP UPDATE LOOP ============

		this.createEvent("UpdateEvent").bind(() => {
			if (!this.isInitialized) return;

			// Update input colors for live tweaking
			this.inputColors = [
				this.input0,
				this.input1,
				this.input2,
				this.input3,
				this.input4,
				this.input5,
			];
			this.updateInputTexture();
		});

		// ============ DEBUG OUTPUT ============

		let debugFrameCount = 0;
		this.createEvent("UpdateEvent").bind(() => {
			debugFrameCount++;
			if (debugFrameCount === 15) {
				// Wait a bit longer for projection to complete
				this.debugProjectionResults();
			}
		});
	}

	private updateInputTexture(): void {
		const width = this.inputTexWidth;
		const height = this.inputTexHeight;
		const totalPixels = width * height;
		const pixels = new Uint8Array(totalPixels * 4);

		// Fill input colors
		for (let i = 0; i < this.inputColors.length; i++) {
			const rgb = this.inputColors[i];
			const lab = this.rgb2lab(rgb);

			// Normalize LAB to 0-255
			// Format: R=normA, G=normL, B=normB (matches encoder output)
			const normL = lab.x / 100.0; // L: 0-100 → 0-1
			const normA = (lab.y + 128.0) / 255.0; // a: -128 to 127 → 0-1
			const normB = (lab.z + 128.0) / 255.0; // b: -128 to 127 → 0-1

			const idx = i * 4;
			pixels[idx + 0] = Math.round(Math.max(0, Math.min(1, normA)) * 255);
			pixels[idx + 1] = Math.round(Math.max(0, Math.min(1, normL)) * 255);
			pixels[idx + 2] = Math.round(Math.max(0, Math.min(1, normB)) * 255);
			pixels[idx + 3] = 255; // Alpha = 255 means valid
		}

		// Mark remaining pixels as invalid (alpha = 0)
		for (let i = this.inputColors.length; i < totalPixels; i++) {
			const idx = i * 4;
			pixels[idx + 0] = 0;
			pixels[idx + 1] = 0;
			pixels[idx + 2] = 0;
			pixels[idx + 3] = 0; // Alpha = 0 means invalid/empty
		}

		(this.inputPosTexture.control as ProceduralTextureProvider).setPixels(
			0,
			0,
			width,
			height,
			pixels
		);
	}

	private rgb2lab(rgb: vec3): vec3 {
		// sRGB to linear
		let r =
			rgb.x > 0.04045 ? Math.pow((rgb.x + 0.055) / 1.055, 2.4) : rgb.x / 12.92;
		let g =
			rgb.y > 0.04045 ? Math.pow((rgb.y + 0.055) / 1.055, 2.4) : rgb.y / 12.92;
		let b =
			rgb.z > 0.04045 ? Math.pow((rgb.z + 0.055) / 1.055, 2.4) : rgb.z / 12.92;

		// Linear RGB to XYZ (D65)
		let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
		let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
		let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

		// Normalize for D65 white point
		x /= 0.95047;
		z /= 1.08883;

		// XYZ to LAB
		const delta = 6.0 / 29.0;
		const delta3 = delta * delta * delta;

		const fx =
			x > delta3 ? Math.pow(x, 1 / 3) : x / (3 * delta * delta) + 4 / 29;
		const fy =
			y > delta3 ? Math.pow(y, 1 / 3) : y / (3 * delta * delta) + 4 / 29;
		const fz =
			z > delta3 ? Math.pow(z, 1 / 3) : z / (3 * delta * delta) + 4 / 29;

		const L = 116 * fy - 16;
		const a = 500 * (fx - fy);
		const bVal = 200 * (fy - fz);

		return new vec3(L, a, bVal);
	}

	private createRenderTarget(resolution: vec2): Texture {
		const rt = global.scene.createRenderTargetTexture();
		(rt.control as any).useScreenResolution = false;
		(rt.control as any).resolution = resolution;
		(rt.control as any).clearColorEnabled = true;
		return rt;
	}

	private createProjectionCamera(layer: LayerSet): SceneObject {
		const obj = global.scene.createSceneObject("GamutProjectorCamera");
		const cam = obj.createComponent("Component.Camera") as Camera;

		cam.enabled = true;
		cam.type = Camera.Type.Orthographic;
		cam.size = 2.0;
		cam.aspect = this.inputTexWidth / this.inputTexHeight;
		cam.near = 0.5;
		cam.far = 100.0;
		cam.renderLayer = layer;
		cam.renderOrder = -50; // After encoder (-100), before main render
		cam.devicePropertyUsage = Camera.DeviceProperty.None;
		cam.renderTarget = this.projectedPosRT;

		// MRT: 2 output targets
		const colorRenderTargets = cam.colorRenderTargets;

		// Target 0: Projected LAB positions
		while (colorRenderTargets.length < 1) {
			colorRenderTargets.push(Camera.createColorRenderTarget());
		}
		colorRenderTargets[0].targetTexture = this.projectedPosRT;
		colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);

		// Target 1: Projected RGB colors
		while (colorRenderTargets.length < 2) {
			colorRenderTargets.push(Camera.createColorRenderTarget());
		}
		colorRenderTargets[1].targetTexture = this.projectedColorRT;
		colorRenderTargets[1].clearColor = new vec4(0, 0, 0, 0);

		cam.colorRenderTargets = colorRenderTargets;

		print(
			`Projection camera: renders to ${this.inputTexWidth}x${this.inputTexHeight} MRT`
		);
		return obj;
	}

	private createPostEffect(
		cameraObj: SceneObject,
		material: Material,
		layer: LayerSet
	): void {
		const obj = global.scene.createSceneObject("GamutProjectorQuad");
		obj.setParent(cameraObj);
		obj.layer = layer;

		const pe = obj.createComponent(
			"Component.PostEffectVisual"
		) as PostEffectVisual;
		pe.mainMaterial = material;

		print("Projection PostEffectVisual created");
	}
	private assignToVFX(): void {
		if (this.vfxComponent && this.vfxComponent.asset) {
			const props = this.vfxComponent.asset.properties;

			(props as any)["posMap"] = this.projectedPosRT;
			(props as any)["colorMap"] = this.projectedColorRT;
			(props as any)["texWidth"] = this.inputTexWidth;
			(props as any)["texHeight"] = this.inputTexHeight;

			print(
				`Assigned projected textures to VFX: ${
					this.vfxComponent.getSceneObject().name
				}`
			);
			print(`  Texture size: ${this.inputTexWidth}x${this.inputTexHeight}`);
		} else {
			print("WARNING: VFX component not set for projected output");
		}
	}
	private debugProjectionResults(): void {
		print("=== PROJECTION RESULTS ===");
		print(`Texture sizes:`);
		print(
			`  Gamut (set1): ${this.gamutTexSize}x${this.gamutTexSize} = ${
				this.gamutTexSize * this.gamutTexSize
			} pixels, ${this.gamutValidCount} valid`
		);
		print(
			`  Input (set2): ${this.inputTexWidth}x${this.inputTexHeight} = ${
				this.inputTexWidth * this.inputTexHeight
			} pixels, ${this.inputColors.length} used`
		);
		print(
			`  Output (set3): ${this.inputTexWidth}x${this.inputTexHeight} = ${
				this.inputTexWidth * this.inputTexHeight
			} pixels`
		);

		try {
			// Read projected RGB colors
			const tempColor = ProceduralTextureProvider.createFromTexture(
				this.projectedColorRT
			);
			const colorProvider = tempColor.control as ProceduralTextureProvider;

			const width = this.inputTexWidth;
			const height = this.inputTexHeight;
			const colorPixels = new Uint8Array(width * height * 4);
			colorProvider.getPixels(0, 0, width, height, colorPixels);

			// Read projected LAB positions
			const tempPos = ProceduralTextureProvider.createFromTexture(
				this.projectedPosRT
			);
			const posProvider = tempPos.control as ProceduralTextureProvider;
			const posPixels = new Uint8Array(width * height * 4);
			posProvider.getPixels(0, 0, width, height, posPixels);

			print("");
			print("Color projections:");
			for (let i = 0; i < this.inputColors.length; i++) {
				const idx = i * 4;
				const inputRGB = this.inputColors[i];
				const inputLAB = this.rgb2lab(inputRGB);

				// Output RGB
				const projR = colorPixels[idx] / 255;
				const projG = colorPixels[idx + 1] / 255;
				const projB = colorPixels[idx + 2] / 255;
				const projAlpha = colorPixels[idx + 3];

				// Output LAB (denormalize)
				const projL = (posPixels[idx + 1] / 255) * 100;
				const projA = (posPixels[idx] / 255) * 255 - 128;
				const projBVal = (posPixels[idx + 2] / 255) * 255 - 128;

				// Calculate ΔE
				const dL = inputLAB.x - projL;
				const da = inputLAB.y - projA;
				const db = inputLAB.z - projBVal;
				const deltaE = Math.sqrt(dL * dL + da * da + db * db);

				print(
					`  [${i}] Input: RGB(${inputRGB.x.toFixed(2)}, ${inputRGB.y.toFixed(
						2
					)}, ${inputRGB.z.toFixed(2)}) LAB(${inputLAB.x.toFixed(
						1
					)}, ${inputLAB.y.toFixed(1)}, ${inputLAB.z.toFixed(1)})`
				);
				print(
					`       → Proj: RGB(${projR.toFixed(2)}, ${projG.toFixed(
						2
					)}, ${projB.toFixed(2)}) LAB(${projL.toFixed(1)}, ${projA.toFixed(
						1
					)}, ${projBVal.toFixed(1)}) ΔE=${deltaE.toFixed(2)} α=${projAlpha}`
				);
			}
		} catch (e) {
			print("Debug error: " + e);
		}
	}

	// ============ PUBLIC GETTERS ============

	getProjectedPosTexture(): Texture {
		return this.projectedPosRT;
	}

	getProjectedColorTexture(): Texture {
		return this.projectedColorRT;
	}

	getInputCount(): number {
		return this.inputColors.length;
	}
}
