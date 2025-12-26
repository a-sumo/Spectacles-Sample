/**
 * ColorPipeline - Unified color processing pipeline
 * Combines palette extraction, GPU gamut encoding (spectral mixing), projection, and image regeneration
 */

// ============================================================================
// PRESETS
// ============================================================================

const PIGMENT_PRESETS: Record<string, vec3[]> = {
    classic: [
        new vec3(0.95, 0.95, 0.93),  // Titanium White
        new vec3(0.08, 0.06, 0.05),  // Ivory Black
        new vec3(0.98, 0.82, 0.05),  // Cadmium Yellow
        new vec3(0.80, 0.15, 0.12),  // Cadmium Red
        new vec3(0.10, 0.25, 0.55),  // Ultramarine Blue
        new vec3(0.05, 0.45, 0.20),  // Viridian Green
    ],
    zorn: [
        new vec3(0.95, 0.95, 0.93),  // White
        new vec3(0.08, 0.06, 0.05),  // Black
        new vec3(0.92, 0.78, 0.20),  // Yellow Ochre
        new vec3(0.75, 0.20, 0.15),  // Cadmium Red
        new vec3(0.08, 0.06, 0.05),  // Black (no blue)
        new vec3(0.08, 0.06, 0.05),  // Black (no green)
    ],
    primary: [
        new vec3(1.0, 1.0, 1.0),     // Pure White
        new vec3(0.0, 0.0, 0.0),     // Pure Black
        new vec3(1.0, 1.0, 0.0),     // Yellow
        new vec3(1.0, 0.0, 0.0),     // Red
        new vec3(0.0, 0.0, 1.0),     // Blue
        new vec3(0.0, 1.0, 0.0),     // Green
    ],
    impressionist: [
        new vec3(0.98, 0.97, 0.90),  // Warm White
        new vec3(0.15, 0.12, 0.18),  // Warm Black
        new vec3(0.95, 0.85, 0.25),  // Naples Yellow
        new vec3(0.85, 0.25, 0.30),  // Vermilion
        new vec3(0.20, 0.35, 0.65),  // Cobalt Blue
        new vec3(0.25, 0.55, 0.35),  // Chrome Green
    ],
    earth: [
        new vec3(0.92, 0.88, 0.78),  // Buff Titanium
        new vec3(0.20, 0.15, 0.10),  // Raw Umber
        new vec3(0.85, 0.70, 0.25),  // Yellow Ochre
        new vec3(0.60, 0.25, 0.15),  // Burnt Sienna
        new vec3(0.25, 0.30, 0.35),  // Payne's Grey
        new vec3(0.35, 0.40, 0.25),  // Terre Verte
    ],
    pastel: [
        new vec3(1.0, 1.0, 1.0),     // White
        new vec3(0.3, 0.3, 0.35),    // Soft Grey
        new vec3(1.0, 0.95, 0.7),    // Cream Yellow
        new vec3(1.0, 0.7, 0.75),    // Soft Pink
        new vec3(0.7, 0.8, 0.95),    // Soft Blue
        new vec3(0.75, 0.95, 0.8),   // Soft Green
    ],
    monochrome: [
        new vec3(1.0, 1.0, 1.0),     // White
        new vec3(0.0, 0.0, 0.0),     // Black
        new vec3(0.8, 0.8, 0.8),     // Light Grey
        new vec3(0.5, 0.5, 0.5),     // Mid Grey
        new vec3(0.3, 0.3, 0.3),     // Dark Grey
        new vec3(0.15, 0.15, 0.15),  // Near Black
    ],
};

// ============================================================================
// COMPONENT
// ============================================================================

@component
export class ColorPipeline extends BaseScriptComponent {

    private static readonly NUM_PIGMENTS = 6;

    // --- Material Inputs ---
    @input
    @hint("Material with PigmentGamutEncoder shader")
    encoderMaterial: Material;

    @input
    @hint("Material with GamutProjector shader")
    projectorMaterial: Material;

    @input
    @hint("Material with PaletteProjection shader")
    remapMaterial: Material;

    // --- Display ---
    @input
    @hint("Plane to display input texture")
    inputPlane: SceneObject;

    @input
    @hint("Plane to display output (processed) texture")
    outputPlane: SceneObject;

    // --- Settings ---
    @input
    @hint("Automatically process when input texture is set")
    autoRun: boolean = true;

    @input
    @hint("Gamut texture resolution")
    gamutTexSize: number = 64;

    @input
    @hint("Mix steps for pigment blending")
    mixSteps: number = 20;

    @input
    @hint("Palette size to extract")
    paletteSize: number = 16;

    @input
    @hint("K-means iterations")
    kmeansIterations: number = 30;

    @input
    @hint("Pixels to sample for extraction")
    sampleSize: number = 5000;

    @input
    @hint("Enable ordered dithering")
    enableDither: boolean = true;

    @input
    @hint("Dithering strength 0-1")
    ditherStrength: number = 0.15;

    @input
    @hint("Projection mode: 0=MinΔE, 1=ConstantHue, 2=ConstantLightness")
    projectionMode: number = 0;

    @input
    debugMode: boolean = false;

    // --- Private State ---
    private currentPreset: string = "classic";
    private pigmentColors: vec3[] = [];
    private inputTexture: Texture;
    private extractedPalette: vec3[] = [];
    private projectedPalette: vec3[] = [];

    // GPU Textures
    private pigmentTexture: Texture;
    private pigmentProvider: ProceduralTextureProvider;
    private gamutPosRT: Texture;
    private gamutColorRT: Texture;
    private projectedPosRT: Texture;
    private projectedColorRT: Texture;
    private paletteInputTex: Texture;
    private paletteInputProvider: ProceduralTextureProvider;
    private paletteTexture: Texture;
    private paletteProvider: ProceduralTextureProvider;

    // Material instances
    private encoderMatInstance: Material;
    private projectorMatInstance: Material;
    private remapMatInstance: Material;
    private inputPlaneMaterial: Material;
    private outputPlaneMaterial: Material;

    private isInitialized: boolean = false;
    private processingState: number = 0; // 0=idle, 1=encoding, 2=projecting, 3=reading, 4=ready
    private frameCount: number = 0;
    private updateEvent: SceneEvent;

    // ========================================================================
    // LIFECYCLE
    // ========================================================================

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
    }

    private initialize(): void {
        if (!this.encoderMaterial || !this.projectorMaterial || !this.remapMaterial) {
            print("ColorPipeline ERROR: Missing materials (encoder, projector, or remap)");
            return;
        }

        // Initialize pigments with default preset
        this.pigmentColors = PIGMENT_PRESETS[this.currentPreset].map(c => new vec3(c.x, c.y, c.z));

        // Create pigment texture (6x1)
        this.pigmentTexture = ProceduralTextureProvider.createWithFormat(
            ColorPipeline.NUM_PIGMENTS, 1, TextureFormat.RGBA8Unorm
        );
        this.pigmentProvider = this.pigmentTexture.control as ProceduralTextureProvider;
        this.updatePigmentTexture();

        // Create gamut render targets
        this.gamutPosRT = this.createRenderTarget(this.gamutTexSize, this.gamutTexSize);
        this.gamutColorRT = this.createRenderTarget(this.gamutTexSize, this.gamutTexSize);

        // Create projection render targets (8x8 for up to 64 colors)
        this.projectedPosRT = this.createRenderTarget(8, 8);
        this.projectedColorRT = this.createRenderTarget(8, 8);

        // Create palette input texture
        this.paletteInputTex = ProceduralTextureProvider.createWithFormat(8, 8, TextureFormat.RGBA8Unorm);
        this.paletteInputProvider = this.paletteInputTex.control as ProceduralTextureProvider;

        // Create palette output texture
        this.paletteTexture = ProceduralTextureProvider.createWithFormat(8, 8, TextureFormat.RGBA8Unorm);
        this.paletteProvider = this.paletteTexture.control as ProceduralTextureProvider;

        // Clone materials
        this.encoderMatInstance = this.encoderMaterial.clone();
        this.projectorMatInstance = this.projectorMaterial.clone();
        this.remapMatInstance = this.remapMaterial.clone();

        // Setup encoder pipeline (GPU spectral mixing)
        this.setupEncoderPipeline();

        // Setup projector pipeline (GPU gamut projection)
        this.setupProjectorPipeline();

        // Setup display planes
        this.setupDisplayPlanes();

        this.isInitialized = true;

        if (this.debugMode) {
            print("ColorPipeline: Initialized with GPU spectral mixing");
        }

        // Auto-run on start if enabled
        if (this.autoRun) {
            this.process();
        }
    }

    private createRenderTarget(width: number, height: number): Texture {
        const rt = global.scene.createRenderTargetTexture();
        const control = rt.control as any;
        control.useScreenResolution = false;
        control.resolution = new vec2(width, height);
        control.clearColorEnabled = true;
        return rt;
    }

    private setupEncoderPipeline(): void {
        const pass = this.encoderMatInstance.mainPass;
        pass["pigmentTex"] = this.pigmentTexture;
        pass["numPigments"] = ColorPipeline.NUM_PIGMENTS;
        pass["texWidth"] = ColorPipeline.NUM_PIGMENTS;
        pass["texSize"] = this.gamutTexSize;
        pass["mixSteps"] = this.mixSteps;

        const layer = LayerSet.makeUnique();
        const cameraObj = this.createCameraMRT(
            "ColorPipeline_Encoder",
            layer,
            this.gamutPosRT,
            this.gamutColorRT,
            -100
        );
        this.createPostEffect(cameraObj, this.encoderMatInstance, layer);
    }

    private setupProjectorPipeline(): void {
        const pass = this.projectorMatInstance.mainPass;
        pass["gamutPosTex"] = this.gamutPosRT;
        pass["gamutColorTex"] = this.gamutColorRT;
        pass["inputPosTex"] = this.paletteInputTex;
        pass["gamutTexSize"] = this.gamutTexSize;
        pass["inputTexWidth"] = 8;
        pass["inputTexHeight"] = 8;
        pass["gamutValidCount"] = this.calculateGamutValidCount();
        pass["projectionMode"] = this.projectionMode;

        const layer = LayerSet.makeUnique();
        const cameraObj = this.createCameraMRT(
            "ColorPipeline_Projector",
            layer,
            this.projectedPosRT,
            this.projectedColorRT,
            -90
        );
        this.createPostEffect(cameraObj, this.projectorMatInstance, layer);
    }

    private createCameraMRT(name: string, layer: LayerSet, rt0: Texture, rt1: Texture, renderOrder: number): SceneObject {
        const obj = global.scene.createSceneObject(name + "_Camera");
        const cam = obj.createComponent("Component.Camera") as Camera;

        cam.enabled = true;
        cam.type = Camera.Type.Orthographic;
        cam.size = 2.0;
        cam.aspect = 1.0;
        cam.near = 0.5;
        cam.far = 100.0;
        cam.renderLayer = layer;
        cam.renderOrder = renderOrder;
        cam.devicePropertyUsage = Camera.DeviceProperty.None;
        cam.renderTarget = rt0;

        const colorRenderTargets = cam.colorRenderTargets;
        while (colorRenderTargets.length < 2) {
            colorRenderTargets.push(Camera.createColorRenderTarget());
        }
        colorRenderTargets[0].targetTexture = rt0;
        colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
        colorRenderTargets[1].targetTexture = rt1;
        colorRenderTargets[1].clearColor = new vec4(0, 0, 0, 0);
        cam.colorRenderTargets = colorRenderTargets;

        return obj;
    }

    private createPostEffect(cameraObj: SceneObject, material: Material, layer: LayerSet): void {
        const obj = global.scene.createSceneObject(cameraObj.name + "_Quad");
        obj.setParent(cameraObj);
        obj.layer = layer;
        const pe = obj.createComponent("Component.PostEffectVisual") as PostEffectVisual;
        pe.mainMaterial = material;
    }

    private setupDisplayPlanes(): void {
        // Setup input plane material
        if (this.inputPlane) {
            const inputRmv = this.inputPlane.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (inputRmv && inputRmv.mainMaterial) {
                this.inputPlaneMaterial = inputRmv.mainMaterial.clone();
                inputRmv.mainMaterial = this.inputPlaneMaterial;
            }
        }

        // Setup output plane with remap material
        if (this.outputPlane) {
            const outputRmv = this.outputPlane.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (outputRmv) {
                this.outputPlaneMaterial = this.remapMatInstance;
                outputRmv.mainMaterial = this.outputPlaneMaterial;
            }
        }
    }

    private updatePigmentTexture(): void {
        const pixels = new Uint8Array(ColorPipeline.NUM_PIGMENTS * 4);

        for (let i = 0; i < ColorPipeline.NUM_PIGMENTS; i++) {
            const pigment = this.pigmentColors[i] || new vec3(0.5, 0.5, 0.5);
            const idx = i * 4;
            pixels[idx + 0] = Math.round(pigment.x * 255);
            pixels[idx + 1] = Math.round(pigment.y * 255);
            pixels[idx + 2] = Math.round(pigment.z * 255);
            pixels[idx + 3] = 255;
        }

        this.pigmentProvider.setPixels(0, 0, ColorPipeline.NUM_PIGMENTS, 1, pixels);
    }

    private calculateGamutValidCount(): number {
        const n = ColorPipeline.NUM_PIGMENTS;
        const steps = this.mixSteps;
        const purePigments = n;
        const twoWayMixes = (n * (n - 1) / 2) * (steps - 1);
        let threeWaySteps = 0;
        for (let s1 = 1; s1 < steps - 1; s1++) {
            for (let s2 = 1; s2 < steps - s1; s2++) {
                threeWaySteps++;
            }
        }
        const threeWayMixes = (n * (n - 1) * (n - 2) / 6) * threeWaySteps;
        return purePigments + twoWayMixes + threeWayMixes;
    }

    // ========================================================================
    // PUBLIC API - PRESETS
    // ========================================================================

    public setPreset(name: string): void {
        const preset = PIGMENT_PRESETS[name];
        if (!preset) {
            print("ColorPipeline: Unknown preset '" + name + "'");
            print("Available: " + Object.keys(PIGMENT_PRESETS).join(", "));
            return;
        }
        this.currentPreset = name;
        this.pigmentColors = preset.map(c => new vec3(c.x, c.y, c.z));

        if (this.debugMode) {
            print("ColorPipeline: Preset set to '" + name + "'");
        }

        if (this.isInitialized) {
            this.updatePigmentTexture();
            // Re-process if we have extracted colors
            if (this.extractedPalette.length > 0) {
                this.processingState = 1;
                this.frameCount = 0;
                if (this.updateEvent) this.updateEvent.enabled = true;
            }
        }
    }

    public getPreset(): string {
        return this.currentPreset;
    }

    public getAvailablePresets(): string[] {
        return Object.keys(PIGMENT_PRESETS);
    }

    public setPigmentColors(colors: vec3[]): void {
        if (colors.length !== 6) {
            print("ColorPipeline: Expected 6 pigment colors, got " + colors.length);
            return;
        }
        this.currentPreset = "custom";
        this.pigmentColors = colors.map(c => new vec3(c.x, c.y, c.z));

        if (this.isInitialized) {
            this.updatePigmentTexture();
        }
    }

    public getPigmentColors(): vec3[] {
        return this.pigmentColors.map(c => new vec3(c.x, c.y, c.z));
    }

    // ========================================================================
    // PUBLIC API - PROCESSING
    // ========================================================================

    public setInputTexture(texture: Texture): void {
        this.inputTexture = texture;

        // Update input plane display
        if (this.inputPlaneMaterial) {
            const pass = this.inputPlaneMaterial.mainPass;
            if (pass["baseTex"] !== undefined) pass["baseTex"] = texture;
            if (pass["diffuseTex"] !== undefined) pass["diffuseTex"] = texture;
        }

        // Auto-run if enabled
        if (this.autoRun && this.isInitialized) {
            this.process();
        }
    }

    public process(): void {
        if (!this.isInitialized) {
            print("ColorPipeline: Not initialized");
            return;
        }

        // If no input texture set, try to get it from the input plane
        if (!this.inputTexture && this.inputPlane) {
            const rmv = this.inputPlane.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv && rmv.mainMaterial) {
                const pass = rmv.mainMaterial.mainPass;
                const tex = pass["baseTex"] || pass["diffuseTex"];
                if (tex) {
                    this.inputTexture = tex as Texture;
                    if (this.debugMode) {
                        print("ColorPipeline: Using texture from input plane");
                    }
                }
            }
        }

        if (!this.inputTexture) {
            print("ColorPipeline: No input texture (set one or assign to input plane)");
            return;
        }

        // Step 1: Extract palette from input
        this.extractedPalette = this.extractPalette();

        if (this.extractedPalette.length === 0) {
            print("ColorPipeline: Failed to extract palette");
            return;
        }

        if (this.debugMode) {
            print("ColorPipeline: Extracted " + this.extractedPalette.length + " colors");
        }

        // Step 2: Write extracted colors to projection input texture
        this.writeColorsToProjectionInput();

        // Step 3: Start processing pipeline
        this.processingState = 1;
        this.frameCount = 0;

        if (this.updateEvent) {
            this.updateEvent.enabled = true;
        } else {
            this.updateEvent = this.createEvent("UpdateEvent");
            this.updateEvent.bind(() => this.updateProcessing());
        }
    }

    public refresh(): void {
        if (this.extractedPalette.length > 0) {
            this.writeColorsToProjectionInput();
            this.processingState = 1;
            this.frameCount = 0;
            if (this.updateEvent) this.updateEvent.enabled = true;
        }
    }

    public isReady(): boolean {
        return this.processingState === 4;
    }

    public isInitializedState(): boolean {
        return this.isInitialized;
    }

    private writeColorsToProjectionInput(): void {
        const pixels = new Uint8Array(8 * 8 * 4);

        for (let i = 0; i < this.extractedPalette.length && i < 64; i++) {
            const rgb = this.extractedPalette[i];
            const lab = this.rgbToLab(rgb);

            // Encode LAB to texture: R = normA, G = normL, B = normB
            const normA = (lab.y + 128) / 255;
            const normL = lab.x / 100;
            const normB = (lab.z + 128) / 255;

            const idx = i * 4;
            pixels[idx + 0] = Math.round(normA * 255);
            pixels[idx + 1] = Math.round(normL * 255);
            pixels[idx + 2] = Math.round(normB * 255);
            pixels[idx + 3] = 255;  // Valid
        }

        this.paletteInputProvider.setPixels(0, 0, 8, 8, pixels);
    }

    private updateProcessing(): void {
        this.frameCount++;

        // Wait for GPU to render (encoder needs 1 frame, projector needs 1 more)
        if (this.processingState === 1 && this.frameCount >= 2) {
            // GPU has rendered, read back results
            this.readProjectionResults();
            this.buildPaletteTexture();
            this.updateOutputPlane();
            this.processingState = 4;

            if (this.updateEvent) {
                this.updateEvent.enabled = false;
            }

            if (this.debugMode) {
                print("ColorPipeline: Processing complete (GPU spectral mixing)");
                this.logPaletteMapping();
            }
        }
    }

    private readProjectionResults(): void {
        try {
            const colorTemp = ProceduralTextureProvider.createFromTexture(this.projectedColorRT);
            const colorProvider = colorTemp.control as ProceduralTextureProvider;
            const colorPixels = new Uint8Array(8 * 8 * 4);
            colorProvider.getPixels(0, 0, 8, 8, colorPixels);

            this.projectedPalette = [];

            for (let i = 0; i < this.extractedPalette.length && i < 64; i++) {
                const idx = i * 4;
                this.projectedPalette.push(new vec3(
                    colorPixels[idx + 0] / 255,
                    colorPixels[idx + 1] / 255,
                    colorPixels[idx + 2] / 255
                ));
            }

            if (this.debugMode) {
                print("ColorPipeline: Read " + this.projectedPalette.length + " projected colors from GPU");
            }
        } catch (e) {
            print("ColorPipeline: Error reading projected colors: " + e);
            // Fallback: use extracted as projected
            this.projectedPalette = this.extractedPalette.map(c => new vec3(c.x, c.y, c.z));
        }
    }

    private updateOutputPlane(): void {
        if (!this.outputPlane || !this.outputPlaneMaterial) return;

        const pass = this.outputPlaneMaterial.mainPass;
        pass["inputTex"] = this.inputTexture;
        pass["baseTex"] = this.inputTexture;
        pass["paletteTex"] = this.paletteTexture;
        pass["paletteSize"] = this.extractedPalette.length;
        pass["ditherStrength"] = this.ditherStrength;
        pass["enableDither"] = this.enableDither ? 1.0 : 0.0;
        pass["projectionMode"] = this.projectionMode;
    }

    // ========================================================================
    // PUBLIC API - OUTPUT
    // ========================================================================

    public getOutputMaterial(): Material {
        if (!this.isInitialized || !this.inputTexture) return null;

        const pass = this.remapMatInstance.mainPass;
        pass["inputTex"] = this.inputTexture;
        pass["baseTex"] = this.inputTexture;
        pass["paletteTex"] = this.paletteTexture;
        pass["paletteSize"] = this.extractedPalette.length;
        pass["ditherStrength"] = this.ditherStrength;
        pass["enableDither"] = this.enableDither ? 1.0 : 0.0;
        pass["projectionMode"] = this.projectionMode;

        return this.remapMatInstance;
    }

    public applyToMesh(meshVisual: RenderMeshVisual): void {
        const mat = this.getOutputMaterial();
        if (mat) meshVisual.mainMaterial = mat;
    }

    public getExtractedPalette(): vec3[] {
        return this.extractedPalette.map(c => new vec3(c.x, c.y, c.z));
    }

    public getProjectedPalette(): vec3[] {
        return this.projectedPalette.map(c => new vec3(c.x, c.y, c.z));
    }

    public getPaletteTexture(): Texture {
        return this.paletteTexture;
    }

    // ========================================================================
    // PUBLIC API - SETTINGS
    // ========================================================================

    public setProjectionMode(mode: number): void {
        this.projectionMode = Math.max(0, Math.min(2, mode));
        if (this.projectorMatInstance) {
            this.projectorMatInstance.mainPass["projectionMode"] = this.projectionMode;
        }
        if (this.remapMatInstance) {
            this.remapMatInstance.mainPass["projectionMode"] = this.projectionMode;
        }
    }

    public getProjectionMode(): number {
        return this.projectionMode;
    }

    public setDitherEnabled(enabled: boolean): void {
        this.enableDither = enabled;
        if (this.remapMatInstance) {
            this.remapMatInstance.mainPass["enableDither"] = enabled ? 1.0 : 0.0;
        }
    }

    public setDitherStrength(strength: number): void {
        this.ditherStrength = Math.max(0, Math.min(1, strength));
        if (this.remapMatInstance) {
            this.remapMatInstance.mainPass["ditherStrength"] = this.ditherStrength;
        }
    }

    // ========================================================================
    // INTERNAL - PALETTE EXTRACTION (K-MEANS)
    // ========================================================================

    private extractPalette(): vec3[] {
        const width = this.inputTexture.getWidth();
        const height = this.inputTexture.getHeight();
        const pixels = new Uint8Array(width * height * 4);

        // Try to get pixels - use createFromTexture for regular textures
        try {
            const readableTex = ProceduralTextureProvider.createFromTexture(this.inputTexture);
            const provider = readableTex.control as ProceduralTextureProvider;
            provider.getPixels(0, 0, width, height, pixels);
        } catch (e) {
            print("ColorPipeline: Cannot read pixels from texture: " + e);
            return [];
        }

        // Sample pixels
        const samples: vec3[] = [];
        const totalPixels = width * height;
        const step = Math.max(1, Math.floor(totalPixels / this.sampleSize));

        for (let i = 0; i < totalPixels && samples.length < this.sampleSize; i += step) {
            const idx = i * 4;
            const a = pixels[idx + 3];
            if (a > 128) {
                samples.push(new vec3(
                    pixels[idx] / 255,
                    pixels[idx + 1] / 255,
                    pixels[idx + 2] / 255
                ));
            }
        }

        if (samples.length < this.paletteSize) {
            print("ColorPipeline: Not enough valid pixels (" + samples.length + ")");
            return samples;
        }

        return this.kMeans(samples, this.paletteSize, this.kmeansIterations);
    }

    private kMeans(samples: vec3[], k: number, iterations: number): vec3[] {
        const centroids: vec3[] = [];
        const used = new Set<number>();
        while (centroids.length < k && centroids.length < samples.length) {
            const idx = Math.floor(Math.random() * samples.length);
            if (!used.has(idx)) {
                used.add(idx);
                centroids.push(new vec3(samples[idx].x, samples[idx].y, samples[idx].z));
            }
        }

        for (let iter = 0; iter < iterations; iter++) {
            const clusters: vec3[][] = centroids.map(() => []);

            for (const sample of samples) {
                let minDist = Infinity;
                let minIdx = 0;
                for (let c = 0; c < centroids.length; c++) {
                    const d = this.colorDistanceSq(sample, centroids[c]);
                    if (d < minDist) {
                        minDist = d;
                        minIdx = c;
                    }
                }
                clusters[minIdx].push(sample);
            }

            for (let c = 0; c < centroids.length; c++) {
                if (clusters[c].length > 0) {
                    let sumR = 0, sumG = 0, sumB = 0;
                    for (const s of clusters[c]) {
                        sumR += s.x;
                        sumG += s.y;
                        sumB += s.z;
                    }
                    const n = clusters[c].length;
                    centroids[c] = new vec3(sumR / n, sumG / n, sumB / n);
                }
            }
        }

        centroids.sort((a, b) => {
            const lumA = 0.299 * a.x + 0.587 * a.y + 0.114 * a.z;
            const lumB = 0.299 * b.x + 0.587 * b.y + 0.114 * b.z;
            return lumA - lumB;
        });

        return centroids;
    }

    private colorDistanceSq(a: vec3, b: vec3): number {
        const dr = a.x - b.x;
        const dg = a.y - b.y;
        const db = a.z - b.z;
        return dr * dr + dg * dg + db * db;
    }

    // ========================================================================
    // INTERNAL - PALETTE TEXTURE
    // ========================================================================

    private buildPaletteTexture(): void {
        const pixels = new Uint8Array(8 * 8 * 4);
        const count = Math.min(this.extractedPalette.length, 32);

        // Top half: original extracted colors
        for (let i = 0; i < count; i++) {
            const idx = i * 4;
            const c = this.extractedPalette[i];
            pixels[idx] = Math.round(c.x * 255);
            pixels[idx + 1] = Math.round(c.y * 255);
            pixels[idx + 2] = Math.round(c.z * 255);
            pixels[idx + 3] = 255;
        }

        // Bottom half: projected colors
        for (let i = 0; i < count; i++) {
            const idx = (32 + i) * 4;
            const c = this.projectedPalette[i] || this.extractedPalette[i];
            pixels[idx] = Math.round(c.x * 255);
            pixels[idx + 1] = Math.round(c.y * 255);
            pixels[idx + 2] = Math.round(c.z * 255);
            pixels[idx + 3] = 255;
        }

        this.paletteProvider.setPixels(0, 0, 8, 8, pixels);
    }

    // ========================================================================
    // INTERNAL - COLOR CONVERSION
    // ========================================================================

    private rgbToLab(rgb: vec3): vec3 {
        const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        const lr = toLinear(rgb.x);
        const lg = toLinear(rgb.y);
        const lb = toLinear(rgb.z);

        let x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
        let y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750;
        let z = lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041;

        x /= 0.95047;
        z /= 1.08883;

        const delta = 0.20689655172;
        const delta3 = 0.00885645167;
        const f = (t: number) => t > delta3 ? Math.pow(t, 1/3) : (t / (3 * delta * delta)) + 0.13793103448;

        return new vec3(116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z)));
    }

    // ========================================================================
    // DEBUG
    // ========================================================================

    private logPaletteMapping(): void {
        print("--- PALETTE MAPPING ---");
        const count = Math.min(this.extractedPalette.length, this.projectedPalette.length);
        for (let i = 0; i < count; i++) {
            const orig = this.extractedPalette[i];
            const proj = this.projectedPalette[i];
            print(`  [${i.toString().padStart(2)}] ${this.vec3ToHex(orig)} -> ${this.vec3ToHex(proj)}`);
        }
        print("-----------------------");
    }

    private vec3ToHex(c: vec3): string {
        const r = Math.round(c.x * 255).toString(16).padStart(2, "0");
        const g = Math.round(c.y * 255).toString(16).padStart(2, "0");
        const b = Math.round(c.z * 255).toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
    }
}
