@component
export class ImageRegenerator extends BaseScriptComponent {

    @input
    @hint("Material with PaletteRemap shader")
    remapMaterial: Material;

    private inputTexture: Texture;

    @input
    @hint("Enable ordered dithering")
    enableDither: boolean = true;

    @input
    @hint("Dithering strength 0-1")
    ditherStrength: number = 0.15;

    @input
    debugMode: boolean = true;

    @input
    @hint("Optional: Quad to display palette texture for debugging (top half = extracted, bottom half = projected)")
    paletteDebugQuad: SceneObject;

    @input
    @hint("Projection mode: 0 = Min ΔE2000, 1 = Constant Hue, 2 = Constant Lightness")
    projectionMode: number = 0;

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
        pass["paletteTex"] = this.paletteTexture;
        pass["paletteSize"] = paletteSize;
        pass["ditherStrength"] = this.ditherStrength;
        pass["enableDither"] = this.enableDither ? 1.0 : 0.0;
        pass["projectionMode"] = this.projectionMode;
        
        if (this.debugMode) {
            print("ImageRegenerator: Palette set (" + paletteSize + " colors)");
            this.logPaletteMapping();
        }

        this.updateDebugQuad();
    }

    private updateDebugQuad(): void {
        if (!this.paletteDebugQuad || !this.paletteTexture) return;

        const rmv = this.paletteDebugQuad.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
        if (!rmv) {
            print("ImageRegenerator: Debug quad has no RenderMeshVisual");
            return;
        }

        const mat = rmv.mainMaterial.clone();
        const pass = mat.mainPass;

        if (pass["baseTex"] !== undefined) {
            pass["baseTex"] = this.paletteTexture;
        } else if (pass["diffuseTex"] !== undefined) {
            pass["diffuseTex"] = this.paletteTexture;
        } else {
            print("ImageRegenerator: Could not set texture on debug quad material");
        }

        rmv.mainMaterial = mat;

        if (this.debugMode) {
            print("ImageRegenerator: Updated debug quad with palette texture");
        }
    }

    private logPaletteMapping(): void {
        const count = Math.min(this.originalPalette.length, this.projectedPalette.length);
        print("--- PALETTE MAPPING ---");
        print("Layout: 8x8 texture, top 4 rows = extracted, bottom 4 rows = projected");
        for (let i = 0; i < count; i++) {
            const orig = this.originalPalette[i];
            const proj = this.projectedPalette[i];
            const origHex = this.vec3ToHex(orig);
            const projHex = this.vec3ToHex(proj);
            const deltaE = this.calcDeltaE(orig, proj);
            print(`  [${i.toString().padStart(2)}] ${origHex} → ${projHex} (ΔE=${deltaE.toFixed(1)})`);
        }
        print("-----------------------");
    }

    private vec3ToHex(c: vec3): string {
        const r = Math.round(c.x * 255).toString(16).padStart(2, "0");
        const g = Math.round(c.y * 255).toString(16).padStart(2, "0");
        const b = Math.round(c.z * 255).toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
    }

    private calcDeltaE(a: vec3, b: vec3): number {
        // Simple RGB distance (not true LAB ΔE, but useful for quick comparison)
        const dr = (a.x - b.x) * 255;
        const dg = (a.y - b.y) * 255;
        const db = (a.z - b.z) * 255;
        return Math.sqrt(dr * dr + dg * dg + db * db);
    }
    
    public getMaterial(): Material {
        if (!this.isInitialized) {
            return null;
        }

        if (this.inputTexture) {
            this.material.mainPass["inputTex"] = this.inputTexture;
            this.material.mainPass["baseTex"] = this.inputTexture;
        }

        return this.material;
    }

    public setInputTexture(tex: Texture): void {
        this.inputTexture = tex;
        if (this.material) {
            this.material.mainPass["inputTex"] = tex;
            this.material.mainPass["baseTex"] = tex;
        }
    }

    public applyToMesh(meshVisual: RenderMeshVisual): void {
        if (!this.isInitialized) {
            return;
        }

        if (this.inputTexture) {
            this.material.mainPass["inputTex"] = this.inputTexture;
            this.material.mainPass["baseTex"] = this.inputTexture;
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

    public getPaletteTexture(): Texture {
        return this.paletteTexture;
    }

    public getOriginalPalette(): vec3[] {
        return [...this.originalPalette];
    }

    public getProjectedPalette(): vec3[] {
        return [...this.projectedPalette];
    }

    public setProjectionMode(mode: number): void {
        this.projectionMode = mode;
        if (this.material) {
            this.material.mainPass["projectionMode"] = mode;
        }
    }

    public getProjectionMode(): number {
        return this.projectionMode;
    }
}