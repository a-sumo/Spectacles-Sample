// Generates a 3D LUT that maps any LAB color to nearest gamut color

@component
export class GamutProjectionLUT extends BaseScriptComponent {
    
    @input
    @hint("Texture with gamut LAB positions (from encoder)")
    gamutPosTexture: Texture;
    
    @input
    @hint("Texture with gamut RGB colors (from encoder)")
    gamutColorTexture: Texture;
    
    @input
    @hint("LUT resolution per axis (32 = 32x32x32 = 32K entries)")
    lutResolution: number = 32;
    
    @input
    @hint("Gamut texture size (must match encoder)")
    gamutTexSize: number = 64;
    
    @input
    @hint("Material to receive LUT")
    projectionMaterial: Material;
    
    @input
    @hint("0 = closest (min ΔE), 1 = hue-preserving")
    projectionMethod: number = 0;
    
    private lutTexture: Texture;
    private gamutCache: { lab: vec3, rgb: vec3 }[] = [];
    
    onAwake(): void {
        // Wait for gamut textures to be ready
        this.createEvent("UpdateEvent").bind(() => {
            this.buildLUT();
        });
    }
    
    private buildLUT(): void {
        // Only build once
        if (this.lutTexture) return;
        
        print("Building gamut projection LUT...");
        const startTime = getTime();
        
        // Step 1: Read gamut into cache
        this.cacheGamut();
        
        if (this.gamutCache.length === 0) {
            print("Waiting for gamut data...");
            return;
        }
        
        // Step 2: Create LUT texture
        // 3D LUT stored as 2D atlas: (res * res) x res
        const res = this.lutResolution;
        const atlasWidth = res * res;
        const atlasHeight = res;
        
        this.lutTexture = ProceduralTextureProvider.createWithFormat(
            atlasWidth,
            atlasHeight,
            TextureFormat.RGBA8Unorm
        );
        
        const pixels = new Uint8Array(atlasWidth * atlasHeight * 4);
        
        // Step 3: For each LAB point, find nearest gamut color
        for (let bIdx = 0; bIdx < res; bIdx++) {          // b* axis (slices)
            for (let aIdx = 0; aIdx < res; aIdx++) {      // a* axis (columns within slice)
                for (let lIdx = 0; lIdx < res; lIdx++) {  // L* axis (rows)
                    
                    // Convert index to LAB
                    const L = (lIdx / (res - 1)) * 100;
                    const a = (aIdx / (res - 1)) * 256 - 128;
                    const b = (bIdx / (res - 1)) * 256 - 128;
                    
                    // Find nearest gamut color
                    const projected = this.projectToGamut(new vec3(L, a, b));
                    
                    // Store in atlas
                    const atlasX = bIdx * res + aIdx;
                    const atlasY = lIdx;
                    const pixelIdx = (atlasY * atlasWidth + atlasX) * 4;
                    
                    pixels[pixelIdx + 0] = Math.round(projected.x * 255);
                    pixels[pixelIdx + 1] = Math.round(projected.y * 255);
                    pixels[pixelIdx + 2] = Math.round(projected.z * 255);
                    pixels[pixelIdx + 3] = 255;
                }
            }
        }
        
        // Write to texture
        (this.lutTexture.control as ProceduralTextureProvider).setPixels(
            0, 0, atlasWidth, atlasHeight, pixels
        );
        
        // Assign to material
        if (this.projectionMaterial) {
            this.projectionMaterial.mainPass.projectionLUT = this.lutTexture;
            this.projectionMaterial.mainPass.lutResolution = res;
        }
        
        const elapsed = getTime() - startTime;
        print(`LUT built: ${res}³ = ${res*res*res} entries in ${elapsed.toFixed(2)}s`);
        print(`Gamut size: ${this.gamutCache.length} colors`);
    }
    
    private cacheGamut(): void {
        if (!this.gamutPosTexture || !this.gamutColorTexture) return;
        
        try {
            const posTemp = ProceduralTextureProvider.createFromTexture(this.gamutPosTexture);
            const colTemp = ProceduralTextureProvider.createFromTexture(this.gamutColorTexture);
            
            const size = this.gamutTexSize;
            const posPixels = new Uint8Array(size * size * 4);
            const colPixels = new Uint8Array(size * size * 4);
            
            (posTemp.control as ProceduralTextureProvider).getPixels(0, 0, size, size, posPixels);
            (colTemp.control as ProceduralTextureProvider).getPixels(0, 0, size, size, colPixels);
            
            this.gamutCache = [];
            
            for (let i = 0; i < size * size; i++) {
                const idx = i * 4;
                
                // Check alpha for validity
                if (posPixels[idx + 3] < 128) continue;
                
                // Denormalize LAB (matches encoder output)
                const normA = posPixels[idx + 0] / 255;
                const normL = posPixels[idx + 1] / 255;
                const normB = posPixels[idx + 2] / 255;
                
                const L = normL * 100;
                const a = normA * 255 - 128;
                const b = normB * 255 - 128;
                
                // RGB
                const r = colPixels[idx + 0] / 255;
                const g = colPixels[idx + 1] / 255;
                const bCol = colPixels[idx + 2] / 255;
                
                this.gamutCache.push({
                    lab: new vec3(L, a, b),
                    rgb: new vec3(r, g, bCol)
                });
            }
            
            print(`Cached ${this.gamutCache.length} gamut colors`);
            
        } catch (e) {
            print("Error caching gamut: " + e);
        }
    }
    
    private projectToGamut(targetLab: vec3): vec3 {
        if (this.gamutCache.length === 0) {
            return new vec3(0.5, 0.5, 0.5);
        }
        
        let minDist = Infinity;
        let closestRGB = this.gamutCache[0].rgb;
        
        if (this.projectionMethod < 0.5) {
            // Method 0: Minimum ΔE (Euclidean in LAB)
            for (const entry of this.gamutCache) {
                const dist = this.labDistance(targetLab, entry.lab);
                if (dist < minDist) {
                    minDist = dist;
                    closestRGB = entry.rgb;
                }
            }
        } else {
            // Method 1: Hue-preserving
            const targetLCH = this.lab2lch(targetLab);
            
            for (const entry of this.gamutCache) {
                const entryLCH = this.lab2lch(entry.lab);
                
                // Hue difference (circular)
                let hDiff = Math.abs(targetLCH.z - entryLCH.z);
                hDiff = Math.min(hDiff, 360 - hDiff);
                
                // Weighted distance prioritizing hue
                const dist = hDiff * 2 + 
                            Math.abs(targetLCH.x - entryLCH.x) * 0.5 + 
                            Math.abs(targetLCH.y - entryLCH.y) * 0.5;
                
                if (dist < minDist) {
                    minDist = dist;
                    closestRGB = entry.rgb;
                }
            }
        }
        
        return closestRGB;
    }
    
    private labDistance(a: vec3, b: vec3): number {
        const dL = a.x - b.x;
        const da = a.y - b.y;
        const db = a.z - b.z;
        return Math.sqrt(dL * dL + da * da + db * db);
    }
    
    private lab2lch(lab: vec3): vec3 {
        const c = Math.sqrt(lab.y * lab.y + lab.z * lab.z);
        let h = Math.atan2(lab.z, lab.y) * (180 / Math.PI);
        if (h < 0) h += 360;
        return new vec3(lab.x, c, h);
    }
}