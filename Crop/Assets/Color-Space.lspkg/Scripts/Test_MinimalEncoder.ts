// Test_MinimalEncoder.ts
// Simplest possible encode → render → decode test

@component
export class Test_MinimalEncoder extends BaseScriptComponent {
    
    @input
    @hint("Material with encoder Code Node")
    encoderMaterial: Material;
    
    @input
    @hint("VFX component to test decoding")
    vfxComponent: VFXComponent;
    
    @input
    @hint("Texture size (8 = 64 particles for easy debugging)")
    texSize: number = 8;
    
    @input
    @hint("Scale for VFX positions")
    scale: number = 100;
    
    private renderTarget: Texture;
    
    onAwake(): void {
        if (!this.encoderMaterial) {
            print("ERROR: encoderMaterial not set");
            return;
        }
        
        const res = new vec2(this.texSize, this.texSize);
        this.renderTarget = this.createRenderTarget(res);
        
        print("Created render target: " + this.renderTarget);
        
        const layer = LayerSet.makeUnique();
        const cameraObj = this.createCamera(this.renderTarget, layer);
        this.createPostEffect(cameraObj, this.encoderMaterial.clone(), layer);
        
        this.assignToVFX();
        
        print("MinimalEncoderTest: Setup complete");
        print(`Texture: ${this.texSize}x${this.texSize}`);
        print(`Spawn count needed: ${this.texSize * this.texSize * 2}`);
        
        // Debug: Read render target after a delay to ensure it's rendered
        this.createEvent("DelayedCallbackEvent").bind(() => {
            this.debugReadRenderTarget();
        });
        
        // Also read after a few frames
        let frameCount = 0;
        this.createEvent("UpdateEvent").bind(() => {
            frameCount++;
            if (frameCount === 5) {
                this.debugReadRenderTarget();
            }
        });
    }
    
    private createRenderTarget(resolution: vec2): Texture {
        const rt = global.scene.createRenderTargetTexture();
        (rt.control as any).useScreenResolution = false;
        (rt.control as any).resolution = resolution;
        return rt;
    }
    
    private createCamera(renderTarget: Texture, layer: LayerSet): SceneObject {
        const obj = global.scene.createSceneObject("TestEncoderCamera");
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
        
        // Set up render target properly
        cam.renderTarget = renderTarget;
        
        // Also set via colorRenderTargets for MRT compatibility
        const colorRenderTargets = cam.colorRenderTargets;
        if (colorRenderTargets.length === 0) {
            colorRenderTargets.push(Camera.createColorRenderTarget());
        }
        colorRenderTargets[0].targetTexture = renderTarget;
        colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
        cam.colorRenderTargets = colorRenderTargets;
        
        print("Camera created, renderTarget assigned");
        
        return obj;
    }
    
    private createPostEffect(cameraObj: SceneObject, material: Material, layer: LayerSet): void {
        const obj = global.scene.createSceneObject("TestEncoderQuad");
        obj.setParent(cameraObj);
        obj.layer = layer;
        
        const pe = obj.createComponent("Component.PostEffectVisual") as PostEffectVisual;
        pe.mainMaterial = material;
        
        print("PostEffectVisual created with material");
    }
    
    private assignToVFX(): void {
        if (this.vfxComponent && this.vfxComponent.asset) {
            const props = this.vfxComponent.asset.properties;
            
            print("Assigning render target to VFX...");
            print("Render target: " + this.renderTarget);
            
            (props as any)["testMap"] = this.renderTarget;
            (props as any)["texSize"] = this.texSize;
            (props as any)["scale"] = this.scale;
            print(`Assigned to VFX: ${this.vfxComponent.getSceneObject().name}`);
        } else {
            print("ERROR: VFX component or asset is null");
        }
    }
    
    private debugReadRenderTarget(): void {
        if (!this.renderTarget) {
            print("DEBUG: No render target to read");
            return;
        }
        
        try {
            // Create procedural texture from render target to read pixels
            const tempTexture = ProceduralTextureProvider.createFromTexture(this.renderTarget);
            const provider = tempTexture.control as ProceduralTextureProvider;
            
            const size = this.texSize;
            const pixelBuffer = new Uint8Array(size * size * 4);
            
            provider.getPixels(0, 0, size, size, pixelBuffer);
            
            // Print first few pixels
            print("=== RENDER TARGET DEBUG ===");
            print(`Size: ${size}x${size}`);
            
            // Print corners and center
            const printPixel = (x: number, y: number, label: string) => {
                const idx = (y * size + x) * 4;
                const r = pixelBuffer[idx];
                const g = pixelBuffer[idx + 1];
                const b = pixelBuffer[idx + 2];
                const a = pixelBuffer[idx + 3];
                print(`${label} (${x},${y}): R=${r}, G=${g}, B=${b}, A=${a}`);
            };
            
            printPixel(0, 0, "Bottom-left");
            printPixel(size - 1, 0, "Bottom-right");
            printPixel(0, size - 1, "Top-left");
            printPixel(size - 1, size - 1, "Top-right");
            printPixel(Math.floor(size / 2), Math.floor(size / 2), "Center");
            
            // Check if all black
            let allBlack = true;
            let allSame = true;
            const firstR = pixelBuffer[0];
            const firstG = pixelBuffer[1];
            const firstB = pixelBuffer[2];
            
            for (let i = 0; i < pixelBuffer.length; i += 4) {
                if (pixelBuffer[i] !== 0 || pixelBuffer[i + 1] !== 0 || pixelBuffer[i + 2] !== 0) {
                    allBlack = false;
                }
                if (pixelBuffer[i] !== firstR || pixelBuffer[i + 1] !== firstG || pixelBuffer[i + 2] !== firstB) {
                    allSame = false;
                }
            }
            
            print(`All black: ${allBlack}`);
            print(`All same color: ${allSame}`);
            print("=== END DEBUG ===");
            
        } catch (e) {
            print("DEBUG ERROR: " + e);
        }
    }
}