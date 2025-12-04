@component
export class PigmentGamutEncoderHiRes extends BaseScriptComponent {
    
    @input
    @hint("Material with PigmentGamutEncoderHiRes shader")
    encoderMaterial: Material;
    
    @input
    @hint("VFX component to receive textures")
    vfxComponent: VFXComponent;
    
    @input
    @hint("Output texture size (128 = 16384 pixels)")
    texSize: number = 128;
    
    @input
    @hint("Mix steps between pigments (higher = more colors)")
    mixSteps: number = 32;
    
    @input
    @hint("Scale for VFX positions")
    scale: number = 100;
    
    // Pigment inputs
    @input
    @widget(new ColorWidget())
    pig0Color: vec3 = new vec3(1, 1, 1);
    
    @input
    @widget(new ColorWidget())
    pig1Color: vec3 = new vec3(0.08, 0.08, 0.08);
    
    @input
    @widget(new ColorWidget())
    pig2Color: vec3 = new vec3(1, 0.92, 0);
    
    @input
    @widget(new ColorWidget())
    pig3Color: vec3 = new vec3(0.89, 0, 0.13);
    
    @input
    @widget(new ColorWidget())
    pig4Color: vec3 = new vec3(0.1, 0.1, 0.7);
    
    @input
    @widget(new ColorWidget())
    pig5Color: vec3 = new vec3(0, 0.47, 0.44);
    
    private static readonly NUM_PIGMENTS = 6;
    
    // Render targets
    private rtLabLA: Texture;   // L and a (16-bit packed)
    private rtLabBV: Texture;   // b and valid (16-bit packed)
    private rtColor: Texture;   // RGB color
    private rtMixInfo: Texture; // Mix info (debug)
    
    private pigmentTexture: Texture;
    private material: Material;
    
    onAwake(): void {
        if (!this.encoderMaterial) {
            print("ERROR: encoderMaterial not set");
            return;
        }
        
        // Create pigment texture
        this.pigmentTexture = ProceduralTextureProvider.createWithFormat(
            PigmentGamutEncoderHiRes.NUM_PIGMENTS,
            1,
            TextureFormat.RGBA8Unorm
        );
        this.updatePigmentTexture();
        
        // Create 4 render targets
        const res = new vec2(this.texSize, this.texSize);
        this.rtLabLA = this.createRenderTarget(res);
        this.rtLabBV = this.createRenderTarget(res);
        this.rtColor = this.createRenderTarget(res);
        this.rtMixInfo = this.createRenderTarget(res);
        
        // Clone and configure material
        this.material = this.encoderMaterial.clone();
        this.material.mainPass.pigmentTex = this.pigmentTexture;
        this.material.mainPass.numPigments = PigmentGamutEncoderHiRes.NUM_PIGMENTS;
        this.material.mainPass.texWidth = PigmentGamutEncoderHiRes.NUM_PIGMENTS;
        this.material.mainPass.texSize = this.texSize;
        this.material.mainPass.mixSteps = this.mixSteps;
        
        // Create camera with 4 MRT targets
        const layer = LayerSet.makeUnique();
        const cameraObj = this.createCameraMRT4(layer);
        this.createPostEffect(cameraObj, this.material, layer);
        
        // Assign to VFX
        this.assignToVFX();
        
        // Log info
        this.logGamutInfo();
        
        // Update pigments every frame
        this.createEvent("UpdateEvent").bind(() => this.updatePigmentTexture());
        
        // Debug after a few frames
        let frameCount = 0;
        this.createEvent("UpdateEvent").bind(() => {
            frameCount++;
            if (frameCount === 5) {
                this.debugReadRenderTargets();
            }
        });
    }
    
    private updatePigmentTexture(): void {
        const pixels = new Uint8Array(PigmentGamutEncoderHiRes.NUM_PIGMENTS * 4);
        
        const pigments = [
            this.pig0Color,
            this.pig1Color,
            this.pig2Color,
            this.pig3Color,
            this.pig4Color,
            this.pig5Color,
        ];
        
        for (let i = 0; i < PigmentGamutEncoderHiRes.NUM_PIGMENTS; i++) {
            const idx = i * 4;
            pixels[idx + 0] = Math.round(pigments[i].x * 255);
            pixels[idx + 1] = Math.round(pigments[i].y * 255);
            pixels[idx + 2] = Math.round(pigments[i].z * 255);
            pixels[idx + 3] = 255;
        }
        
        (this.pigmentTexture.control as ProceduralTextureProvider).setPixels(
            0, 0, PigmentGamutEncoderHiRes.NUM_PIGMENTS, 1, pixels
        );
    }
    
    private createRenderTarget(resolution: vec2): Texture {
        const rt = global.scene.createRenderTargetTexture();
        (rt.control as any).useScreenResolution = false;
        (rt.control as any).resolution = resolution;
        (rt.control as any).clearColorEnabled = true;
        return rt;
    }
    
    private createCameraMRT4(layer: LayerSet): SceneObject {
        const obj = global.scene.createSceneObject("PigmentGamutCameraHiRes");
        const cam = obj.createComponent("Component.Camera") as Camera;
        
        cam.enabled = true;
        cam.type = Camera.Type.Orthographic;
        cam.size = 2.0;
        cam.aspect = 1.0;
        cam.near = 0.5;
        cam.far = 100.0;
        cam.renderLayer = layer;
        cam.renderOrder = -100;
        cam.enableClearColor = true;
        cam.devicePropertyUsage = Camera.DeviceProperty.None;
        cam.renderTarget = this.rtLabLA;
        
        // Setup MRT with 4 render targets
        const colorRenderTargets = cam.colorRenderTargets;
        
        // Ensure we have 4 targets
        while (colorRenderTargets.length < 4) {
            colorRenderTargets.push(Camera.createColorRenderTarget());
        }
        
        // RT0: LAB L and a (16-bit packed)
        colorRenderTargets[0].targetTexture = this.rtLabLA;
        colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
        
        // RT1: LAB b and valid (16-bit packed)
        colorRenderTargets[1].targetTexture = this.rtLabBV;
        colorRenderTargets[1].clearColor = new vec4(0, 0, 0, 0);
        
        // RT2: RGB color
        colorRenderTargets[2].targetTexture = this.rtColor;
        colorRenderTargets[2].clearColor = new vec4(0, 0, 0, 0);
        
        // RT3: Mix info
        colorRenderTargets[3].targetTexture = this.rtMixInfo;
        colorRenderTargets[3].clearColor = new vec4(0, 0, 0, 0);
        
        cam.colorRenderTargets = colorRenderTargets;
        
        print("Camera created with 4 MRT targets");
        return obj;
    }
    
    private createPostEffect(cameraObj: SceneObject, material: Material, layer: LayerSet): void {
        const obj = global.scene.createSceneObject("PigmentGamutQuadHiRes");
        obj.setParent(cameraObj);
        obj.layer = layer;
        
        const pe = obj.createComponent("Component.PostEffectVisual") as PostEffectVisual;
        pe.mainMaterial = material;
        
        print("PostEffectVisual created");
    }
    
    private assignToVFX(): void {
        if (this.vfxComponent && this.vfxComponent.asset) {
            const props = this.vfxComponent.asset.properties;
            
            // 16-bit packed LAB position
            (props as any)["labLA"] = this.rtLabLA;
            (props as any)["labBV"] = this.rtLabBV;
            
            // RGB color
            (props as any)["colorMap"] = this.rtColor;
            
            // Mix info (optional)
            (props as any)["mixInfo"] = this.rtMixInfo;
            
            // Parameters
            (props as any)["texSize"] = this.texSize;
            (props as any)["scale"] = this.scale;
            
            print(`Assigned to VFX: ${this.vfxComponent.getSceneObject().name}`);
        } else {
            print("WARNING: VFX component or asset is null");
        }
    }
    
    private logGamutInfo(): void {
        const n = PigmentGamutEncoderHiRes.NUM_PIGMENTS;
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
        
        const total = purePigments + twoWayMixes + threeWayMixes;
        const capacity = this.texSize * this.texSize;
        
        print("=== High-Res Pigment Gamut Info ===");
        print(`Pigments: ${n}`);
        print(`Mix steps: ${steps}`);
        print(`Pure colors: ${purePigments}`);
        print(`2-way mixes: ${twoWayMixes}`);
        print(`3-way mixes: ${threeWayMixes}`);
        print(`Total gamut size: ${total}`);
        print(`Texture capacity: ${capacity}`);
        print(`Utilization: ${(total / capacity * 100).toFixed(1)}%`);
        print(`Position precision: 16-bit (65536 levels per axis)`);
        print(`VFX spawn count needed: ${capacity * 2}`);
        
        if (total > capacity) {
            print(`WARNING: Gamut exceeds texture capacity! Increase texSize or reduce mixSteps.`);
        }
    }
    
    private debugReadRenderTargets(): void {
        print("=== DEBUG: Reading render targets ===");
        this.debugTexture(this.rtLabLA, "labLA");
        this.debugTexture(this.rtLabBV, "labBV");
        this.debugTexture(this.rtColor, "color");
    }
    
    private debugTexture(texture: Texture, name: string): void {
        if (!texture) {
            print(`DEBUG: No ${name} texture`);
            return;
        }
        
        try {
            const tempTexture = ProceduralTextureProvider.createFromTexture(texture);
            const provider = tempTexture.control as ProceduralTextureProvider;
            
            const size = this.texSize;
            const pixelBuffer = new Uint8Array(size * size * 4);
            provider.getPixels(0, 0, size, size, pixelBuffer);
            
            print(`--- ${name} ---`);
            
            // Show first few pixels
            for (let idx = 0; idx < 6; idx++) {
                const i = idx * 4;
                print(`[${idx}]: ${pixelBuffer[i]}, ${pixelBuffer[i+1]}, ${pixelBuffer[i+2]}, ${pixelBuffer[i+3]}`);
            }
            
        } catch (e) {
            print(`DEBUG ERROR ${name}: ` + e);
        }
    }
    
    // ============ PUBLIC API ============
    
    /** Get the LAB position textures for VFX */
    public getLabTextures(): { labLA: Texture, labBV: Texture } {
        return { labLA: this.rtLabLA, labBV: this.rtLabBV };
    }
    
    /** Get the color texture for VFX */
    public getColorTexture(): Texture {
        return this.rtColor;
    }
    
    /** Unpack 16-bit value from two 8-bit channels (for debugging) */
    public static unpack16(hi: number, lo: number): number {
        return (hi * 256 + lo) / 65535;
    }
    
    /** Unpack signed 16-bit value (for debugging) */
    public static unpackSigned16(hi: number, lo: number, range: number): number {
        const normalized = PigmentGamutEncoderHiRes.unpack16(hi, lo);
        return normalized * (2 * range) - range;
    }
}