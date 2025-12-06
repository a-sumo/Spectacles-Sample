// Extracts a color palette from an input texture using k-means clustering

@component
export class PaletteExtractor extends BaseScriptComponent {
    
    @input
    @hint("Input texture to extract palette from")
    inputTexture: Texture;
    
    @input
    @hint("Number of colors to extract")
    paletteSize: number = 24;
    
    @input
    @hint("Max iterations for k-means")
    maxIterations: number = 30;
    
    @input
    @hint("Sample size for faster processing")
    sampleSize: number = 5000;
    
    @input
    @hint("Reference to Projector_Gamut for projection")
    gamutProjector: ScriptComponent;
    
    @input
    debugMode: boolean = true;
    
    private extractedPalette: vec3[] = [];
    private projectedPalette: vec3[] = [];
    private isInitialized: boolean = false;
    private textureProvider: ProceduralTextureProvider | null = null;
    
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
    }
    
    private initialize(): void {
        if (!this.inputTexture) {
            print("PaletteExtractor ERROR: No inputTexture assigned!");
            return;
        }
        
        try {
            const temp = ProceduralTextureProvider.createFromTexture(this.inputTexture);
            this.textureProvider = temp.control as ProceduralTextureProvider;
        } catch (e) {
            print(`PaletteExtractor ERROR: Cannot read texture: ${e}`);
            return;
        }
        
        this.isInitialized = true;
        
        if (this.debugMode) {
            print("PaletteExtractor: Initialized");
        }
    }
    
    /**
     * Extract palette from the input texture
     */
    public extractPalette(): vec3[] {
        if (!this.isInitialized || !this.textureProvider) {
            print("PaletteExtractor: Not initialized");
            return [];
        }
        
        const width = this.inputTexture.getWidth();
        const height = this.inputTexture.getHeight();
        const totalPixels = width * height;
        
        // Read all pixels
        const pixels = new Uint8Array(totalPixels * 4);
        this.textureProvider.getPixels(0, 0, width, height, pixels);
        
        // Sample pixels for k-means (faster than using all)
        const sampled: vec3[] = [];
        const step = Math.max(1, Math.floor(totalPixels / this.sampleSize));
        
        for (let i = 0; i < totalPixels; i += step) {
            const idx = i * 4;
            const r = pixels[idx] / 255;
            const g = pixels[idx + 1] / 255;
            const b = pixels[idx + 2] / 255;
            const a = pixels[idx + 3] / 255;
            
            // Skip transparent pixels
            if (a < 0.5) continue;
            
            sampled.push(new vec3(r, g, b));
        }
        
        if (sampled.length < this.paletteSize) {
            print(`PaletteExtractor: Not enough valid pixels (${sampled.length})`);
            return [];
        }
        
        if (this.debugMode) {
            print(`PaletteExtractor: Sampled ${sampled.length} pixels from ${totalPixels}`);
        }
        
        // Run k-means clustering
        this.extractedPalette = this.kMeans(sampled, this.paletteSize, this.maxIterations);
        
        if (this.debugMode) {
            print(`PaletteExtractor: Extracted ${this.extractedPalette.length} colors`);
        }
        
        return this.extractedPalette;
    }
    
    /**
     * K-means clustering implementation
     */
    private kMeans(pixels: vec3[], k: number, maxIter: number): vec3[] {
        // Initialize centroids randomly from input pixels
        const centroids: vec3[] = [];
        const usedIndices = new Set<number>();
        
        while (centroids.length < k && centroids.length < pixels.length) {
            const idx = Math.floor(Math.random() * pixels.length);
            if (!usedIndices.has(idx)) {
                usedIndices.add(idx);
                centroids.push(new vec3(pixels[idx].x, pixels[idx].y, pixels[idx].z));
            }
        }
        
        // Iterate
        for (let iter = 0; iter < maxIter; iter++) {
            // Assign pixels to nearest centroid
            const clusters: vec3[][] = Array(k).fill(null).map(() => []);
            
            for (const p of pixels) {
                let minDist = Infinity;
                let nearestIdx = 0;
                
                for (let c = 0; c < centroids.length; c++) {
                    const d = this.colorDistanceSq(p, centroids[c]);
                    if (d < minDist) {
                        minDist = d;
                        nearestIdx = c;
                    }
                }
                
                clusters[nearestIdx].push(p);
            }
            
            // Update centroids
            let changed = false;
            
            for (let c = 0; c < k; c++) {
                if (clusters[c].length === 0) continue;
                
                let sumR = 0, sumG = 0, sumB = 0;
                for (const p of clusters[c]) {
                    sumR += p.x;
                    sumG += p.y;
                    sumB += p.z;
                }
                
                const newCentroid = new vec3(
                    sumR / clusters[c].length,
                    sumG / clusters[c].length,
                    sumB / clusters[c].length
                );
                
                if (this.colorDistanceSq(centroids[c], newCentroid) > 0.0001) {
                    changed = true;
                    centroids[c] = newCentroid;
                }
            }
            
            if (!changed) {
                if (this.debugMode) {
                    print(`PaletteExtractor: K-means converged at iteration ${iter}`);
                }
                break;
            }
        }
        
        // Sort by luminance for consistent ordering
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
    
    /**
     * Extract and project palette through GamutProjector
     */
    public extractAndProject(): { original: vec3[]; projected: vec3[] } {
        const extracted = this.extractPalette();
        
        if (extracted.length === 0) {
            return { original: [], projected: [] };
        }
        
        if (!this.gamutProjector) {
            print("PaletteExtractor: No Projector_Gamut assigned, returning unprojected");
            return { original: extracted, projected: extracted };
        }

        const projector = this.gamutProjector as any;

        if (!projector.isReady?.()) {
            print("PaletteExtractor: Projector_Gamut not ready");
            return { original: extracted, projected: extracted };
        }
        
        // Send colors to projector
        projector.setInputColors(extracted);
        
        // Wait a frame for GPU projection, then read back
        // For now, return extracted - caller should wait and call getProjectedPalette()
        this.extractedPalette = extracted;
        
        return { original: extracted, projected: [] };
    }
    
    /**
     * Get projected palette (call after extractAndProject and waiting a frame)
     */
    public getProjectedPalette(): vec3[] {
        if (!this.gamutProjector) return this.extractedPalette;
        
        const projector = this.gamutProjector as any;
        if (!projector.isReady?.()) return this.extractedPalette;
        
        this.projectedPalette = projector.getProjectedColors() || [];
        return this.projectedPalette;
    }
    
    /**
     * Get the last extracted palette
     */
    public getExtractedPalette(): vec3[] {
        return [...this.extractedPalette];
    }
    
    /**
     * Set input texture dynamically
     */
    public setInputTexture(texture: Texture): void {
        this.inputTexture = texture;
        try {
            const temp = ProceduralTextureProvider.createFromTexture(texture);
            this.textureProvider = temp.control as ProceduralTextureProvider;
            this.isInitialized = true;
        } catch (e) {
            print(`PaletteExtractor: Failed to set texture: ${e}`);
        }
    }
    
    public isReady(): boolean {
        return this.isInitialized;
    }
}