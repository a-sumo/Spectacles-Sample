@component
export class ImageRegenerator extends BaseScriptComponent {
    
    @input
    @hint("Material with PaletteRemap shader")
    remapMaterial: Material;
    
    @input
    @hint("Input image texture")
    inputTexture: Texture;
    
    @input
    @hint("Enable ordered dithering")
    enableDither: boolean = true;
    
    @input
    @hint("Dithering strength 0-1")
    ditherStrength: number = 0.15;
    
    @input
    debugMode: boolean = true;
    
    private paletteTexture: Texture;
    private paletteProvider: ProceduralTextureProvider;
    private originalPalette: vec3[] = [];
    private projectedPalette: vec3[] = [];
    private isInitialized: boolean = false;
    private material: Material;
    
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
    }
    
    private initialize(): void {
        if (!this.remapMaterial) {
            print("ImageRegenerator ERROR: No remapMaterial assigned");
            return;
        }
        
        this.paletteTexture = ProceduralTextureProvider.createWithFormat(
            8, 8, TextureFormat.RGBA8Unorm
        );
        this.paletteProvider = this.paletteTexture.control as ProceduralTextureProvider;
        
        this.material = this.remapMaterial.clone();
        
        this.isInitialized = true;
        
        if (this.debugMode) {
            print("ImageRegenerator: Initialized");
        }
    }
    
    public setPalette(original: vec3[], projected: vec3[]): void {
        if (!this.isInitialized) {
            print("ImageRegenerator: Not initialized");
            return;
        }
        
        this.originalPalette = original;
        this.projectedPalette = projected;
        
        const paletteSize = Math.min(original.length, 32);
        const pixels = new Uint8Array(8 * 8 * 4);
        
        for (let i = 0; i < paletteSize; i++) {
            const idx = i * 4;
            pixels[idx] = Math.round(original[i].x * 255);
            pixels[idx + 1] = Math.round(original[i].y * 255);
            pixels[idx + 2] = Math.round(original[i].z * 255);
            pixels[idx + 3] = 255;
        }
        
        for (let i = 0; i < paletteSize; i++) {
            const idx = (32 + i) * 4;
            const p = projected[i] || original[i];
            pixels[idx] = Math.round(p.x * 255);
            pixels[idx + 1] = Math.round(p.y * 255);
            pixels[idx + 2] = Math.round(p.z * 255);
            pixels[idx + 3] = 255;
        }
        
        this.paletteProvider.setPixels(0, 0, 8, 8, pixels);
        
        const pass = this.material.mainPass;
        pass.paletteTex = this.paletteTexture;
        pass.paletteSize = paletteSize;
        pass.ditherStrength = this.ditherStrength;
        pass.enableDither = this.enableDither ? 1.0 : 0.0;
        
        if (this.debugMode) {
            print("ImageRegenerator: Palette set (" + paletteSize + " colors)");
        }
    }
    
    public getMaterial(): Material {
        if (!this.isInitialized) {
            return null;
        }
        
        if (this.inputTexture) {
            this.material.mainPass.inputTex = this.inputTexture;
        }
        
        return this.material;
    }
    
    public setInputTexture(tex: Texture): void {
        this.inputTexture = tex;
        if (this.material) {
            this.material.mainPass.inputTex = tex;
        }
    }
    
    public applyToMesh(meshVisual: RenderMeshVisual): void {
        if (!this.isInitialized) {
            return;
        }
        
        if (this.inputTexture) {
            this.material.mainPass.inputTex = this.inputTexture;
        }
        
        meshVisual.mainMaterial = this.material;
        
        if (this.debugMode) {
            print("ImageRegenerator: Applied to mesh");
        }
    }
    
    public isReady(): boolean {
        return this.isInitialized;
    }
    
    public getPaletteSize(): number {
        return this.projectedPalette.length;
    }
}