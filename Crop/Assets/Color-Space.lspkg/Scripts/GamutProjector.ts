// Projects a set of colors (set2) onto the pigment gamut (set1) → outputs set3

@component
export class GamutProjector extends BaseScriptComponent {
    @input
    @hint("Material with GamutProjection shader")
    projectionMaterial: Material;

    @input
    @hint("Reference to PigmentGamutEncoder script component")
    gamutEncoder: ScriptComponent;

    @input
    @hint("VFX component to receive projected textures")
    vfxComponent: VFXComponent;

    // ============ TEXTURE SIZE CONFIGURATION ============

    @input
    gamutTexSize: number = 64;

    @input
    gamutValidCount: number = 2000;

    @input
    inputTexWidth: number = 8;

    @input
    inputTexHeight: number = 8;

    // ============ INPUT COLORS (SET2) - Inspector fallback ============

    @input
    @widget(new ColorWidget())
    input0: vec3 = new vec3(1.0, 0.5, 0.0);

    @input
    @widget(new ColorWidget())
    input1: vec3 = new vec3(0.0, 1.0, 0.5);

    @input
    @widget(new ColorWidget())
    input2: vec3 = new vec3(0.5, 0.0, 1.0);

    @input
    @widget(new ColorWidget())
    input3: vec3 = new vec3(1.0, 1.0, 0.0);

    @input
    @widget(new ColorWidget())
    input4: vec3 = new vec3(0.0, 0.5, 0.3);

    @input
    @widget(new ColorWidget())
    input5: vec3 = new vec3(0.8, 0.2, 0.2);

    // ============ PRIVATE STATE ============

    private gamutPosTexture: Texture;
    private gamutColorTexture: Texture;
    private inputPosTexture: Texture;
    private projectedPosRT: Texture;
    private projectedColorRT: Texture;
    private inputColors: vec3[] = [];
    private isInitialized: boolean = false;
    private inputTextureProvider: ProceduralTextureProvider | null = null;

    onAwake(): void {
        this.createEvent("UpdateEvent").bind(() => this.tryInitialize());
    }

    private tryInitialize(): void {
        if (this.isInitialized) return;

        if (!this.projectionMaterial || !this.gamutEncoder) return;

        const encoder = this.gamutEncoder as any;
        this.gamutPosTexture = encoder.getPosRenderTarget?.() || encoder.posRenderTarget;
        this.gamutColorTexture = encoder.getColorRenderTarget?.() || encoder.colorRenderTarget;

        if (!this.gamutPosTexture || !this.gamutColorTexture) return;

        const encoderValidCount = encoder.getGamutValidCount?.();
        if (encoderValidCount !== undefined) {
            this.gamutValidCount = encoderValidCount;
        }

        // Collect inspector colors as default
        this.inputColors = [
            this.input0, this.input1, this.input2,
            this.input3, this.input4, this.input5
        ];

        // Create input texture
        this.inputPosTexture = ProceduralTextureProvider.createWithFormat(
            this.inputTexWidth,
            this.inputTexHeight,
            TextureFormat.RGBA8Unorm
        );
        this.inputTextureProvider = this.inputPosTexture.control as ProceduralTextureProvider;
        this.updateInputTexture();

        // Create output render targets
        const outputRes = new vec2(this.inputTexWidth, this.inputTexHeight);
        this.projectedPosRT = this.createRenderTarget(outputRes);
        this.projectedColorRT = this.createRenderTarget(outputRes);

        // Setup material
        const material = this.projectionMaterial.clone();
        material.mainPass.gamutPosTex = this.gamutPosTexture;
        material.mainPass.gamutColorTex = this.gamutColorTexture;
        material.mainPass.inputPosTex = this.inputPosTexture;
        material.mainPass.gamutTexSize = this.gamutTexSize;
        material.mainPass.inputTexWidth = this.inputTexWidth;
        material.mainPass.inputTexHeight = this.inputTexHeight;
        material.mainPass.gamutValidCount = this.gamutValidCount;

        // Create render pipeline
        const layer = LayerSet.makeUnique();
        const cameraObj = this.createProjectionCamera(layer);
        this.createPostEffect(cameraObj, material, layer);

        this.isInitialized = true;
        print(`GamutProjector: Initialized (${this.inputColors.length} colors)`);
        
        this.assignToVFX();
    }

    private updateInputTexture(): void {
        if (!this.inputTextureProvider) return;

        const width = this.inputTexWidth;
        const height = this.inputTexHeight;
        const totalPixels = width * height;
        const pixels = new Uint8Array(totalPixels * 4);

        for (let i = 0; i < this.inputColors.length && i < totalPixels; i++) {
            const rgb = this.inputColors[i];
            const lab = this.rgb2lab(rgb);

            const normL = lab.x / 100.0;
            const normA = (lab.y + 128.0) / 255.0;
            const normB = (lab.z + 128.0) / 255.0;

            const idx = i * 4;
            pixels[idx + 0] = Math.round(Math.max(0, Math.min(1, normA)) * 255);
            pixels[idx + 1] = Math.round(Math.max(0, Math.min(1, normL)) * 255);
            pixels[idx + 2] = Math.round(Math.max(0, Math.min(1, normB)) * 255);
            pixels[idx + 3] = 255;
        }

        // Mark remaining as invalid
        for (let i = this.inputColors.length; i < totalPixels; i++) {
            const idx = i * 4;
            pixels[idx + 0] = 0;
            pixels[idx + 1] = 0;
            pixels[idx + 2] = 0;
            pixels[idx + 3] = 0;
        }

        this.inputTextureProvider.setPixels(0, 0, width, height, pixels);
    }

    public rgb2lab(rgb: vec3): vec3 {
        let r = rgb.x > 0.04045 ? Math.pow((rgb.x + 0.055) / 1.055, 2.4) : rgb.x / 12.92;
        let g = rgb.y > 0.04045 ? Math.pow((rgb.y + 0.055) / 1.055, 2.4) : rgb.y / 12.92;
        let b = rgb.z > 0.04045 ? Math.pow((rgb.z + 0.055) / 1.055, 2.4) : rgb.z / 12.92;

        let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
        let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
        let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

        x /= 0.95047;
        z /= 1.08883;

        const delta = 6.0 / 29.0;
        const delta3 = delta * delta * delta;

        const fx = x > delta3 ? Math.pow(x, 1 / 3) : x / (3 * delta * delta) + 4 / 29;
        const fy = y > delta3 ? Math.pow(y, 1 / 3) : y / (3 * delta * delta) + 4 / 29;
        const fz = z > delta3 ? Math.pow(z, 1 / 3) : z / (3 * delta * delta) + 4 / 29;

        return new vec3(116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz));
    }

    public lab2rgb(lab: vec3): vec3 {
        const L = lab.x, a = lab.y, b = lab.z;
        
        let y = (L + 16) / 116;
        let x = a / 500 + y;
        let z = y - b / 200;

        const delta = 6.0 / 29.0;
        const delta3 = delta * delta * delta;

        x = x * x * x > delta3 ? x * x * x : (x - 4 / 29) * 3 * delta * delta;
        y = y * y * y > delta3 ? y * y * y : (y - 4 / 29) * 3 * delta * delta;
        z = z * z * z > delta3 ? z * z * z : (z - 4 / 29) * 3 * delta * delta;

        x *= 0.95047;
        z *= 1.08883;

        let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
        let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
        let bOut = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

        r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
        g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
        bOut = bOut > 0.0031308 ? 1.055 * Math.pow(bOut, 1 / 2.4) - 0.055 : 12.92 * bOut;

        return new vec3(
            Math.max(0, Math.min(1, r)),
            Math.max(0, Math.min(1, g)),
            Math.max(0, Math.min(1, bOut))
        );
    }

    private createRenderTarget(resolution: vec2): Texture {
        const rt = global.scene.createRenderTargetTexture();
        (rt.control as any).useScreenResolution = false;
        (rt.control as any).resolution = resolution;
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
        cam.renderOrder = -50;
        cam.devicePropertyUsage = Camera.DeviceProperty.None;
        cam.renderTarget = this.projectedPosRT;

        const colorRenderTargets = cam.colorRenderTargets;
        while (colorRenderTargets.length < 2) {
            colorRenderTargets.push(Camera.createColorRenderTarget());
        }
        colorRenderTargets[0].targetTexture = this.projectedPosRT;
        colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
        colorRenderTargets[1].targetTexture = this.projectedColorRT;
        colorRenderTargets[1].clearColor = new vec4(0, 0, 0, 0);
        cam.colorRenderTargets = colorRenderTargets;

        return obj;
    }

    private createPostEffect(cameraObj: SceneObject, material: Material, layer: LayerSet): void {
        const obj = global.scene.createSceneObject("GamutProjectorQuad");
        obj.setParent(cameraObj);
        obj.layer = layer;
        const pe = obj.createComponent("Component.PostEffectVisual") as PostEffectVisual;
        pe.mainMaterial = material;
    }

    private assignToVFX(): void {
        if (this.vfxComponent?.asset) {
            const props = this.vfxComponent.asset.properties as any;
            props["posMap"] = this.projectedPosRT;
            props["colorMap"] = this.projectedColorRT;
            props["texWidth"] = this.inputTexWidth;
            props["texHeight"] = this.inputTexHeight;
        }
    }

    // ============ PUBLIC API ============

    public isReady(): boolean {
        return this.isInitialized;
    }

    public setInputColors(colors: vec3[]): void {
        this.inputColors = colors.slice(0, this.inputTexWidth * this.inputTexHeight);
        this.updateInputTexture();
    }

    public getInputColors(): vec3[] {
        return [...this.inputColors];
    }

    public getInputCount(): number {
        return this.inputColors.length;
    }

    public getProjectedColors(): vec3[] {
        if (!this.isInitialized || !this.projectedColorRT) return [];

        try {
            const temp = ProceduralTextureProvider.createFromTexture(this.projectedColorRT);
            const provider = temp.control as ProceduralTextureProvider;
            const pixels = new Uint8Array(this.inputTexWidth * this.inputTexHeight * 4);
            provider.getPixels(0, 0, this.inputTexWidth, this.inputTexHeight, pixels);

            const colors: vec3[] = [];
            for (let i = 0; i < this.inputColors.length; i++) {
                const idx = i * 4;
                colors.push(new vec3(
                    pixels[idx] / 255,
                    pixels[idx + 1] / 255,
                    pixels[idx + 2] / 255
                ));
            }
            return colors;
        } catch (e) {
            return [];
        }
    }

    public getProjectedLAB(): vec3[] {
        if (!this.isInitialized || !this.projectedPosRT) return [];

        try {
            const temp = ProceduralTextureProvider.createFromTexture(this.projectedPosRT);
            const provider = temp.control as ProceduralTextureProvider;
            const pixels = new Uint8Array(this.inputTexWidth * this.inputTexHeight * 4);
            provider.getPixels(0, 0, this.inputTexWidth, this.inputTexHeight, pixels);

            const positions: vec3[] = [];
            for (let i = 0; i < this.inputColors.length; i++) {
                const idx = i * 4;
                positions.push(new vec3(
                    (pixels[idx + 1] / 255) * 100,           // L
                    (pixels[idx] / 255) * 255 - 128,        // a
                    (pixels[idx + 2] / 255) * 255 - 128     // b
                ));
            }
            return positions;
        } catch (e) {
            return [];
        }
    }

    public getProjectionResults(): { input: vec3; projected: vec3; inputLAB: vec3; projectedLAB: vec3; deltaE: number }[] {
        const projectedColors = this.getProjectedColors();
        const projectedLAB = this.getProjectedLAB();
        if (projectedColors.length === 0) return [];

        const results: { input: vec3; projected: vec3; inputLAB: vec3; projectedLAB: vec3; deltaE: number }[] = [];

        for (let i = 0; i < this.inputColors.length; i++) {
            const inputRGB = this.inputColors[i];
            const inputLAB = this.rgb2lab(inputRGB);
            const projRGB = projectedColors[i];
            const projLAB = projectedLAB[i];

            const dL = inputLAB.x - projLAB.x;
            const da = inputLAB.y - projLAB.y;
            const db = inputLAB.z - projLAB.z;
            const deltaE = Math.sqrt(dL * dL + da * da + db * db);

            results.push({ input: inputRGB, projected: projRGB, inputLAB, projectedLAB: projLAB, deltaE });
        }

        return results;
    }

    public getProjectedPosTexture(): Texture {
        return this.projectedPosRT;
    }

    public getProjectedColorTexture(): Texture {
        return this.projectedColorRT;
    }
}