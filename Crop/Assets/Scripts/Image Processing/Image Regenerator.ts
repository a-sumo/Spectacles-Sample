// ImageRegenerator.ts
// Regenerates an image using a projected color palette with optional dithering

@component
export class ImageRegenerator extends BaseScriptComponent {
    
    @input
    @hint("Material with palette mapping shader")
    remapMaterial: Material;
    
    @input
    @hint("Input image texture")
    inputTexture: Texture;
    
    @input
    @hint("Output resolution width (0 = match input)")
    outputWidth: number = 0;
    
    @input
    @hint("Output resolution height (0 = match input)")
    outputHeight: number = 0;
    
    @input
    @hint("Dithering method: 0=none, 1=floyd-steinberg, 2=atkinson")
    ditherMethod: number = 1;
    
    @input
    @hint("Dithering strength (0-1)")
    ditherStrength: number = 0.85;
    
    @input
    debugMode: boolean = true;
    
    private paletteTexture: Texture;
    private paletteProvider: ProceduralTextureProvider;
    private outputRT: Texture;
    private originalPalette: vec3[] = [];
    private projectedPalette: vec3[] = [];
    private isInitialized: boolean = false;
    private material: Material;
    
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
    }
    
    private initialize(): void {
        if (!this.remapMaterial) {
            print("ImageRegenerator ERROR: No remapMaterial assigned!");
            return;
        }
        
        // Create palette texture (max 64 colors, stored in 8x8)
        this.paletteTexture = ProceduralTextureProvider.createWithFormat(
            8, 8, TextureFormat.RGBA8Unorm
        );
        this.paletteProvider = this.paletteTexture.control as ProceduralTextureProvider;
        
        // Create output render target
        const w = this.outputWidth > 0 ? this.outputWidth : (this.inputTexture?.getWidth() || 512);
        const h = this.outputHeight > 0 ? this.outputHeight : (this.inputTexture?.getHeight() || 512);
        
        this.outputRT = this.createRenderTarget(new vec2(w, h));
        
        // Clone material
        this.material = this.remapMaterial.clone();
        
        this.isInitialized = true;
        
        if (this.debugMode) {
            print(`ImageRegenerator: Initialized (output: ${w}x${h})`);
        }
    }
    
    /**
     * Set the palette mapping (original → projected)
     */
    public setPalette(original: vec3[], projected: vec3[]): void {
        if (!this.isInitialized) return;
        
        this.originalPalette = original;
        this.projectedPalette = projected;
        
        const paletteSize = Math.min(original.length, 64);
        
        // Create palette texture: each row = original RGB, projected RGB
        // Layout: pixel i contains (origR, origG, origB, projR) and (projG, projB, ?, ?)
        // Simplified: use two rows - row 0 = original, row 1 = projected
        
        const pixels = new Uint8Array(8 * 8 * 4);
        
        // Row 0: Original colors
        for (let i = 0; i < paletteSize && i < 8; i++) {
            const idx = i * 4;
            pixels[idx] = Math.round(original[i].x * 255);
            pixels[idx + 1] = Math.round(original[i].y * 255);
            pixels[idx + 2] = Math.round(original[i].z * 255);
            pixels[idx + 3] = 255;
        }
        
        // Row 1: Original colors (continued)
        for (let i = 8; i < paletteSize && i < 16; i++) {
            const idx = i * 4;
            pixels[idx] = Math.round(original[i].x * 255);
            pixels[idx + 1] = Math.round(original[i].y * 255);
            pixels[idx + 2] = Math.round(original[i].z * 255);
            pixels[idx + 3] = 255;
        }
        
        // Rows 2-3: More original colors
        for (let i = 16; i < paletteSize && i < 32; i++) {
            const idx = i * 4;
            pixels[idx] = Math.round(original[i].x * 255);
            pixels[idx + 1] = Math.round(original[i].y * 255);
            pixels[idx + 2] = Math.round(original[i].z * 255);
            pixels[idx + 3] = 255;
        }
        
        // Rows 4-7: Projected colors
        for (let i = 0; i < paletteSize && i < 32; i++) {
            const idx = (32 + i) * 4;
            const p = projected[i] || original[i];
            pixels[idx] = Math.round(p.x * 255);
            pixels[idx + 1] = Math.round(p.y * 255);
            pixels[idx + 2] = Math.round(p.z * 255);
            pixels[idx + 3] = 255;
        }
        
        this.paletteProvider.setPixels(0, 0, 8, 8, pixels);
        
        // Update material
        this.material.mainPass.paletteTex = this.paletteTexture;
        this.material.mainPass.paletteSize = paletteSize;
        this.material.mainPass.ditherMethod = this.ditherMethod;
        this.material.mainPass.ditherStrength = this.ditherStrength;
        
        if (this.debugMode) {
            print(`ImageRegenerator: Palette set (${paletteSize} colors)`);
        }
    }
    
    /**
     * Process the image with current palette
     */
    public process(): Texture {
        if (!this.isInitialized || !this.inputTexture) {
            print("ImageRegenerator: Not ready to process");
            return null;
        }
        
        this.material.mainPass.inputTex = this.inputTexture;
        
        // The actual rendering happens via the camera/post-effect pipeline
        // For CPU-based dithering, we need a different approach
        
        return this.outputRT;
    }
    
    /**
     * Process image on CPU with Floyd-Steinberg dithering
     */
    public processCPU(): Texture {
        if (!this.isInitialized || !this.inputTexture) return null;
        
        const width = this.inputTexture.getWidth();
        const height = this.inputTexture.getHeight();
        
        // Read input
        const tempTex = ProceduralTextureProvider.createFromTexture(this.inputTexture);
        const inputProvider = tempTex.control as ProceduralTextureProvider;
        const inputPixels = new Uint8Array(width * height * 4);
        inputProvider.getPixels(0, 0, width, height, inputPixels);
        
        // Create output
        const outputTex = ProceduralTextureProvider.createWithFormat(width, height, TextureFormat.RGBA8Unorm);
        const outputProvider = outputTex.control as ProceduralTextureProvider;
        
        // Convert to float for error diffusion
        const floatPixels = new Float32Array(width * height * 4);
        for (let i = 0; i < inputPixels.length; i++) {
            floatPixels[i] = inputPixels[i];
        }
        
        const outputPixels = new Uint8Array(width * height * 4);
        
        // Process with dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                
                const oldR = Math.max(0, Math.min(255, floatPixels[idx]));
                const oldG = Math.max(0, Math.min(255, floatPixels[idx + 1]));
                const oldB = Math.max(0, Math.min(255, floatPixels[idx + 2]));
                
                // Find nearest projected color
                const nearest = this.findNearestColor(oldR / 255, oldG / 255, oldB / 255);
                
                outputPixels[idx] = Math.round(nearest.x * 255);
                outputPixels[idx + 1] = Math.round(nearest.y * 255);
                outputPixels[idx + 2] = Math.round(nearest.z * 255);
                outputPixels[idx + 3] = inputPixels[idx + 3];
                
                // Error diffusion (Floyd-Steinberg)
                if (this.ditherMethod === 1) {
                    const errR = (oldR - nearest.x * 255) * this.ditherStrength;
                    const errG = (oldG - nearest.y * 255) * this.ditherStrength;
                    const errB = (oldB - nearest.z * 255) * this.ditherStrength;
                    
                    this.diffuseError(floatPixels, width, height, x + 1, y, errR, errG, errB, 7 / 16);
                    this.diffuseError(floatPixels, width, height, x - 1, y + 1, errR, errG, errB, 3 / 16);
                    this.diffuseError(floatPixels, width, height, x, y + 1, errR, errG, errB, 5 / 16);
                    this.diffuseError(floatPixels, width, height, x + 1, y + 1, errR, errG, errB, 1 / 16);
                }
            }
        }
        
        outputProvider.setPixels(0, 0, width, height, outputPixels);
        
        if (this.debugMode) {
            print(`ImageRegenerator: Processed ${width}x${height} image`);
        }
        
        return outputTex;
    }
    
    private findNearestColor(r: number, g: number, b: number): vec3 {
        let minDist = Infinity;
        let nearest = new vec3(r, g, b);
        
        for (let i = 0; i < this.projectedPalette.length; i++) {
            const p = this.projectedPalette[i];
            const dr = r - p.x;
            const dg = g - p.y;
            const db = b - p.z;
            const dist = dr * dr + dg * dg + db * db;
            
            if (dist < minDist) {
                minDist = dist;
                nearest = p;
            }
        }
        
        return nearest;
    }
    
    private diffuseError(pixels: Float32Array, w: number, h: number, x: number, y: number, errR: number, errG: number, errB: number, weight: number): void {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        
        const idx = (y * w + x) * 4;
        pixels[idx] += errR * weight;
        pixels[idx + 1] += errG * weight;
        pixels[idx + 2] += errB * weight;
    }
    
    private createRenderTarget(resolution: vec2): Texture {
        const rt = global.scene.createRenderTargetTexture();
        (rt.control as any).useScreenResolution = false;
        (rt.control as any).resolution = resolution;
        return rt;
    }
    
    public getOutputTexture(): Texture {
        return this.outputRT;
    }
    
    public isReady(): boolean {
        return this.isInitialized;
    }
}