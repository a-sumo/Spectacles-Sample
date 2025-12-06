// Encoder_PigmentMix.ts
// Encodes the achievable gamut from mixing physical pigments (Kubelka-Munk)

@component
export class Encoder_PigmentMix extends BaseScriptComponent {

    @input
    @hint("Material with PigmentGamutEncoder shader")
    encoderMaterial: Material;

    @input
    @hint("VFX component to receive textures")
    vfxComponent: VFXComponent;

    @input
    @hint("Output texture size (64 = 4096 pixels)")
    texSize: number = 64;

    @input
    @hint("Mix steps between pigments")
    mixSteps: number = 20;

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

    private posRenderTarget: Texture;
    private colorRenderTarget: Texture;
    private pigmentTexture: Texture;
    private initialized: boolean = false;

    onAwake(): void {
        if (!this.encoderMaterial) {
            print("Encoder_PigmentMix: ERROR - encoderMaterial not set");
            return;
        }

        // Create pigment texture
        this.pigmentTexture = ProceduralTextureProvider.createWithFormat(
            Encoder_PigmentMix.NUM_PIGMENTS,
            1,
            TextureFormat.RGBA8Unorm
        );
        this.updatePigmentTexture();

        // Create render targets
        const res = new vec2(this.texSize, this.texSize);
        this.posRenderTarget = this.createRenderTarget(res);
        this.colorRenderTarget = this.createRenderTarget(res);

        // Clone and configure material
        const material = this.encoderMaterial.clone();
        material.mainPass.pigmentTex = this.pigmentTexture;
        material.mainPass.numPigments = Encoder_PigmentMix.NUM_PIGMENTS;
        material.mainPass.texWidth = Encoder_PigmentMix.NUM_PIGMENTS;
        material.mainPass.texSize = this.texSize;
        material.mainPass.mixSteps = this.mixSteps;

        // Create camera and post effect
        const layer = LayerSet.makeUnique();
        const cameraObj = this.createCameraMRT(layer);
        this.createPostEffect(cameraObj, material, layer);

        // Assign to VFX
        this.assignToVFX();

        // Update pigments every frame
        this.createEvent("UpdateEvent").bind(() => this.updatePigmentTexture());

        this.initialized = true;
        print("Encoder_PigmentMix: Ready");
    }

    private updatePigmentTexture(): void {
        const pixels = new Uint8Array(Encoder_PigmentMix.NUM_PIGMENTS * 4);

        const pigments = [
            this.pig0Color,
            this.pig1Color,
            this.pig2Color,
            this.pig3Color,
            this.pig4Color,
            this.pig5Color,
        ];

        for (let i = 0; i < Encoder_PigmentMix.NUM_PIGMENTS; i++) {
            const idx = i * 4;
            pixels[idx + 0] = Math.round(pigments[i].x * 255);
            pixels[idx + 1] = Math.round(pigments[i].y * 255);
            pixels[idx + 2] = Math.round(pigments[i].z * 255);
            pixels[idx + 3] = 255;
        }

        (this.pigmentTexture.control as ProceduralTextureProvider).setPixels(
            0, 0, Encoder_PigmentMix.NUM_PIGMENTS, 1, pixels
        );
    }

    private createRenderTarget(resolution: vec2): Texture {
        const rt = global.scene.createRenderTargetTexture();
        (rt.control as any).useScreenResolution = false;
        (rt.control as any).resolution = resolution;
        (rt.control as any).clearColorEnabled = true;
        return rt;
    }

    private createCameraMRT(layer: LayerSet): SceneObject {
        const obj = global.scene.createSceneObject("Encoder_PigmentMix_Camera");
        const cam = obj.createComponent("Component.Camera") as Camera;

        cam.enabled = true;
        cam.type = Camera.Type.Orthographic;
        cam.size = 2.0;
        cam.aspect = 1.0;
        cam.near = 0.5;
        cam.far = 100.0;
        cam.renderLayer = layer;
        cam.renderOrder = -100;
        cam.devicePropertyUsage = Camera.DeviceProperty.None;
        cam.renderTarget = this.posRenderTarget;

        const colorRenderTargets = cam.colorRenderTargets;
        while (colorRenderTargets.length < 2) {
            colorRenderTargets.push(Camera.createColorRenderTarget());
        }
        colorRenderTargets[0].targetTexture = this.posRenderTarget;
        colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
        colorRenderTargets[1].targetTexture = this.colorRenderTarget;
        colorRenderTargets[1].clearColor = new vec4(0, 0, 0, 0);
        cam.colorRenderTargets = colorRenderTargets;

        return obj;
    }

    private createPostEffect(cameraObj: SceneObject, material: Material, layer: LayerSet): void {
        const obj = global.scene.createSceneObject("Encoder_PigmentMix_Quad");
        obj.setParent(cameraObj);
        obj.layer = layer;
        const pe = obj.createComponent("Component.PostEffectVisual") as PostEffectVisual;
        pe.mainMaterial = material;
    }

    private assignToVFX(): void {
        if (this.vfxComponent?.asset) {
            const props = this.vfxComponent.asset.properties as any;
            props["posMap"] = this.posRenderTarget;
            props["colorMap"] = this.colorRenderTarget;
            props["texSize"] = this.texSize;
            props["scale"] = this.scale;
        }
    }

    // ============ PUBLIC API ============

    isReady(): boolean {
        return this.initialized;
    }

    getPosRenderTarget(): Texture {
        return this.posRenderTarget;
    }

    getColorRenderTarget(): Texture {
        return this.colorRenderTarget;
    }

    getTexSize(): number {
        return this.texSize;
    }

    getGamutValidCount(): number {
        const n = Encoder_PigmentMix.NUM_PIGMENTS;
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
}
