// PaletteProjector.ts
// Self-contained palette projection - no external component dependencies
// Based on HTML pipeline: buildGamut → extractPalette → project → regenerate

@component
export class PaletteProjector extends BaseScriptComponent {

    // ============ INPUTS ============

    @input
    @hint("Input image to process")
    inputTexture: Texture;

    @input
    @hint("Mesh to display output")
    outputMesh: SceneObject;

    @input
    @hint("Material for output (needs baseTex property)")
    outputMaterial: Material;

    @input
    @hint("Number of colors to extract")
    paletteSize: number = 12;

    // ============ PIGMENT PALETTE (Kubelka-Munk) ============

    @input
    @widget(new ColorWidget())
    @hint("Pigment 1: Titanium White")
    pig0: vec3 = new vec3(1, 1, 1);

    @input
    @widget(new ColorWidget())
    @hint("Pigment 2: Ivory Black")
    pig1: vec3 = new vec3(0.08, 0.08, 0.08);

    @input
    @widget(new ColorWidget())
    @hint("Pigment 3: Cadmium Yellow")
    pig2: vec3 = new vec3(1, 0.92, 0);

    @input
    @widget(new ColorWidget())
    @hint("Pigment 4: Cadmium Red")
    pig3: vec3 = new vec3(0.89, 0, 0.13);

    @input
    @widget(new ColorWidget())
    @hint("Pigment 5: Ultramarine Blue")
    pig4: vec3 = new vec3(0.1, 0.1, 0.7);

    @input
    @widget(new ColorWidget())
    @hint("Pigment 6: Viridian Green")
    pig5: vec3 = new vec3(0, 0.47, 0.44);

    @input
    @hint("Mix resolution (higher = more gamut colors)")
    mixSteps: number = 12;

    // ============ STATE ============

    private gamut: { rgb: vec3; lab: vec3 }[] = [];
    private extractedPalette: vec3[] = [];
    private projectedPalette: vec3[] = [];
    private isReady: boolean = false;

    // ============ K-M COEFFICIENTS (simplified) ============
    // Real K-M would need proper k/s values; this uses RGB approximation

    private pigments: { rgb: vec3; k: vec3; s: vec3 }[] = [];

    onAwake(): void {
        this.initPigments();
        this.buildGamut();
        this.isReady = true;
        print(`PaletteProjector: Ready with ${this.gamut.length} gamut colors`);
    }

    private initPigments(): void {
        // Simplified K-M coefficients derived from RGB
        this.pigments = [
            { rgb: this.pig0, k: new vec3(0.02, 0.02, 0.02), s: new vec3(1, 1, 1) },
            { rgb: this.pig1, k: new vec3(8, 8, 8), s: new vec3(0.2, 0.2, 0.2) },
            { rgb: this.pig2, k: new vec3(0.1, 0.15, 2.5), s: new vec3(0.8, 0.8, 0.3) },
            { rgb: this.pig3, k: new vec3(0.2, 2.5, 2), s: new vec3(0.8, 0.3, 0.3) },
            { rgb: this.pig4, k: new vec3(2, 2, 0.2), s: new vec3(0.4, 0.4, 0.9) },
            { rgb: this.pig5, k: new vec3(2.5, 0.5, 1.5), s: new vec3(0.3, 0.8, 0.6) },
        ];
    }

    // ============ KUBELKA-MUNK MIXING ============

    private mixPigments(concentrations: number[]): vec3 {
        let sum = 0;
        for (const c of concentrations) sum += c;
        if (sum === 0) return new vec3(0.5, 0.5, 0.5);

        const norm = concentrations.map(c => c / sum);

        let k = new vec3(0, 0, 0);
        let s = new vec3(0, 0, 0);

        for (let i = 0; i < this.pigments.length; i++) {
            k.x += norm[i] * this.pigments[i].k.x;
            k.y += norm[i] * this.pigments[i].k.y;
            k.z += norm[i] * this.pigments[i].k.z;
            s.x += norm[i] * this.pigments[i].s.x;
            s.y += norm[i] * this.pigments[i].s.y;
            s.z += norm[i] * this.pigments[i].s.z;
        }

        // K-M reflectance formula: R = 1 + K/S - sqrt((K/S)² + 2K/S)
        const computeR = (kv: number, sv: number): number => {
            if (sv === 0) return 0;
            const ks = kv / sv;
            return Math.max(0, Math.min(1, 1 + ks - Math.sqrt(ks * ks + 2 * ks)));
        };

        return new vec3(
            computeR(k.x, s.x),
            computeR(k.y, s.y),
            computeR(k.z, s.z)
        );
    }

    // ============ BUILD GAMUT ============

    private buildGamut(): void {
        this.gamut = [];
        const n = this.pigments.length;
        const steps = this.mixSteps;

        // Pure pigments
        for (let i = 0; i < n; i++) {
            const conc = Array(n).fill(0);
            conc[i] = 1;
            const rgb = this.mixPigments(conc);
            const lab = this.rgb2lab(rgb);
            this.gamut.push({ rgb, lab });
        }

        // Two-way mixes
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                for (let s = 1; s < steps; s++) {
                    const r = s / steps;
                    const conc = Array(n).fill(0);
                    conc[i] = r;
                    conc[j] = 1 - r;
                    const rgb = this.mixPigments(conc);
                    const lab = this.rgb2lab(rgb);
                    this.gamut.push({ rgb, lab });
                }
            }
        }

        // Three-way mixes (reduced resolution)
        const steps3 = Math.min(6, steps);
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                for (let k = j + 1; k < n; k++) {
                    for (let s1 = 1; s1 < steps3; s1++) {
                        for (let s2 = 1; s2 < steps3 - s1; s2++) {
                            const r1 = s1 / steps3;
                            const r2 = s2 / steps3;
                            const r3 = 1 - r1 - r2;
                            if (r3 <= 0) continue;
                            const conc = Array(n).fill(0);
                            conc[i] = r1;
                            conc[j] = r2;
                            conc[k] = r3;
                            const rgb = this.mixPigments(conc);
                            const lab = this.rgb2lab(rgb);
                            this.gamut.push({ rgb, lab });
                        }
                    }
                }
            }
        }

        print(`PaletteProjector: Built gamut with ${this.gamut.length} colors`);
    }

    // ============ COLOR CONVERSION ============

    public rgb2lab(rgb: vec3): vec3 {
        let r = rgb.x > 0.04045 ? Math.pow((rgb.x + 0.055) / 1.055, 2.4) : rgb.x / 12.92;
        let g = rgb.y > 0.04045 ? Math.pow((rgb.y + 0.055) / 1.055, 2.4) : rgb.y / 12.92;
        let b = rgb.z > 0.04045 ? Math.pow((rgb.z + 0.055) / 1.055, 2.4) : rgb.z / 12.92;

        let x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100;
        let y = (r * 0.2126729 + g * 0.7151522 + b * 0.072175) * 100;
        let z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) * 100;

        x /= 95.047;
        y /= 100;
        z /= 108.883;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

        return new vec3((116 * y) - 16, 500 * (x - y), 200 * (y - z));
    }

    public lab2rgb(lab: vec3): vec3 {
        let y = (lab.x + 16) / 116;
        let x = lab.y / 500 + y;
        let z = y - lab.z / 200;

        x = Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16 / 116) / 7.787;
        y = Math.pow(y, 3) > 0.008856 ? Math.pow(y, 3) : (y - 16 / 116) / 7.787;
        z = Math.pow(z, 3) > 0.008856 ? Math.pow(z, 3) : (z - 16 / 116) / 7.787;

        x *= 95.047 / 100;
        y *= 100 / 100;
        z *= 108.883 / 100;

        let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
        let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
        let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

        r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
        g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
        b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

        return new vec3(
            Math.max(0, Math.min(1, r)),
            Math.max(0, Math.min(1, g)),
            Math.max(0, Math.min(1, b))
        );
    }

    // ============ PALETTE EXTRACTION (K-MEANS) ============

    public extractPalette(texture?: Texture): vec3[] {
        const tex = texture || this.inputTexture;
        if (!tex) {
            print("PaletteProjector: No input texture");
            return [];
        }

        const w = tex.getWidth();
        const h = tex.getHeight();

        // Read pixels
        const tempTex = ProceduralTextureProvider.createFromTexture(tex);
        const provider = tempTex.control as ProceduralTextureProvider;
        const pixels = new Uint8Array(w * h * 4);
        provider.getPixels(0, 0, w, h, pixels);

        // Sample pixels for k-means
        const sampleCount = Math.min(5000, w * h);
        const sampled: vec3[] = [];
        for (let i = 0; i < sampleCount; i++) {
            const idx = Math.floor(Math.random() * w * h) * 4;
            sampled.push(new vec3(
                pixels[idx] / 255,
                pixels[idx + 1] / 255,
                pixels[idx + 2] / 255
            ));
        }

        // K-means clustering
        this.extractedPalette = this.kmeans(sampled, this.paletteSize);

        print(`PaletteProjector: Extracted ${this.extractedPalette.length} colors`);
        return this.extractedPalette;
    }

    private kmeans(pixels: vec3[], k: number, maxIter: number = 30): vec3[] {
        // Initialize centroids randomly
        let centroids: vec3[] = [];
        for (let i = 0; i < k; i++) {
            const p = pixels[Math.floor(Math.random() * pixels.length)];
            centroids.push(new vec3(p.x, p.y, p.z));
        }

        for (let iter = 0; iter < maxIter; iter++) {
            // Assign pixels to nearest centroid
            const clusters: vec3[][] = Array(k).fill(null).map(() => []);

            for (const p of pixels) {
                let minD = Infinity;
                let nearest = 0;
                for (let c = 0; c < k; c++) {
                    const dx = p.x - centroids[c].x;
                    const dy = p.y - centroids[c].y;
                    const dz = p.z - centroids[c].z;
                    const d = dx * dx + dy * dy + dz * dz;
                    if (d < minD) {
                        minD = d;
                        nearest = c;
                    }
                }
                clusters[nearest].push(p);
            }

            // Update centroids
            let changed = false;
            for (let c = 0; c < k; c++) {
                if (clusters[c].length === 0) continue;
                let sx = 0, sy = 0, sz = 0;
                for (const p of clusters[c]) {
                    sx += p.x;
                    sy += p.y;
                    sz += p.z;
                }
                const newX = sx / clusters[c].length;
                const newY = sy / clusters[c].length;
                const newZ = sz / clusters[c].length;

                if (Math.abs(newX - centroids[c].x) > 0.001 ||
                    Math.abs(newY - centroids[c].y) > 0.001 ||
                    Math.abs(newZ - centroids[c].z) > 0.001) {
                    changed = true;
                }
                centroids[c] = new vec3(newX, newY, newZ);
            }

            if (!changed) break;
        }

        return centroids;
    }

    // ============ PROJECTION ============

    public projectPalette(palette?: vec3[]): { rgb: vec3; lab: vec3; deltaE: number }[] {
        const pal = palette || this.extractedPalette;
        if (pal.length === 0) {
            print("PaletteProjector: No palette to project");
            return [];
        }

        const results: { rgb: vec3; lab: vec3; deltaE: number }[] = [];
        this.projectedPalette = [];

        for (const inputRGB of pal) {
            const inputLAB = this.rgb2lab(inputRGB);

            // Find nearest gamut color
            let minDistSq = Infinity;
            let bestRGB = new vec3(0.5, 0.5, 0.5);
            let bestLAB = new vec3(50, 0, 0);

            for (const g of this.gamut) {
                const dL = inputLAB.x - g.lab.x;
                const da = inputLAB.y - g.lab.y;
                const db = inputLAB.z - g.lab.z;
                const distSq = dL * dL + da * da + db * db;

                if (distSq < minDistSq) {
                    minDistSq = distSq;
                    bestRGB = g.rgb;
                    bestLAB = g.lab;
                }
            }

            const deltaE = Math.sqrt(minDistSq);
            this.projectedPalette.push(bestRGB);
            results.push({ rgb: bestRGB, lab: bestLAB, deltaE });
        }

        print(`PaletteProjector: Projected ${results.length} colors`);
        return results;
    }

    // ============ GPU-BASED IMAGE REGENERATION ============

    private paletteTexture: Texture;
    private paletteProvider: ProceduralTextureProvider;
    private remapMaterial: Material;

    private initRemapMaterial(): void {
        if (this.paletteTexture) return; // Already initialized

        // Create 8x8 palette texture (first 32 = original, next 32 = projected)
        this.paletteTexture = ProceduralTextureProvider.createWithFormat(8, 8, TextureFormat.RGBA8Unorm);
        this.paletteProvider = this.paletteTexture.control as ProceduralTextureProvider;
    }

    private updatePaletteTexture(): void {
        if (!this.paletteProvider) return;

        const paletteSize = Math.min(this.extractedPalette.length, 32);
        const pixels = new Uint8Array(8 * 8 * 4);

        // First 32 pixels: original colors
        for (let i = 0; i < paletteSize; i++) {
            const idx = i * 4;
            pixels[idx] = Math.round(this.extractedPalette[i].x * 255);
            pixels[idx + 1] = Math.round(this.extractedPalette[i].y * 255);
            pixels[idx + 2] = Math.round(this.extractedPalette[i].z * 255);
            pixels[idx + 3] = 255;
        }

        // Next 32 pixels: projected colors
        for (let i = 0; i < paletteSize; i++) {
            const idx = (32 + i) * 4;
            const p = this.projectedPalette[i] || this.extractedPalette[i];
            pixels[idx] = Math.round(p.x * 255);
            pixels[idx + 1] = Math.round(p.y * 255);
            pixels[idx + 2] = Math.round(p.z * 255);
            pixels[idx + 3] = 255;
        }

        this.paletteProvider.setPixels(0, 0, 8, 8, pixels);
    }

    public applyToMesh(meshVisual: RenderMeshVisual, inputTex?: Texture): void {
        const tex = inputTex || this.inputTexture;
        if (!tex || !this.outputMaterial) {
            print("PaletteProjector: Cannot apply - missing texture or material");
            return;
        }

        this.initRemapMaterial();
        this.updatePaletteTexture();

        const mat = this.outputMaterial.clone();
        const pass = mat.mainPass;

        pass.inputTex = tex;
        pass.paletteTex = this.paletteTexture;
        pass.paletteSize = Math.min(this.extractedPalette.length, 32);
        pass.ditherStrength = 0.15;
        pass.enableDither = 1.0;

        meshVisual.mainMaterial = mat;

        print(`PaletteProjector: Applied GPU remap to mesh`);
    }

    // ============ FULL PIPELINE ============

    public process(texture?: Texture): void {
        const tex = texture || this.inputTexture;
        if (!tex) {
            print("PaletteProjector: No input texture");
            return;
        }

        print("\n=== PALETTE PROJECTOR PIPELINE ===");
        const startTime = Date.now();

        // Step 1: Extract palette
        this.extractPalette(tex);

        // Step 2: Project to gamut
        const projResults = this.projectPalette();

        // Log projection stats
        let totalDeltaE = 0;
        let maxDeltaE = 0;
        for (const r of projResults) {
            totalDeltaE += r.deltaE;
            maxDeltaE = Math.max(maxDeltaE, r.deltaE);
        }
        print(`Average ΔE: ${(totalDeltaE / projResults.length).toFixed(2)}`);
        print(`Max ΔE: ${maxDeltaE.toFixed(2)}`);

        // Step 3: Apply GPU shader to output mesh
        if (this.outputMesh && this.outputMaterial) {
            const rmv = this.outputMesh.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv) {
                this.applyToMesh(rmv, tex);
                print(`Applied to mesh: ${this.outputMesh.name}`);
            }
        }

        const elapsed = Date.now() - startTime;
        print(`Pipeline complete in ${elapsed}ms`);
        print("=================================\n");
    }

    // ============ PUBLIC API ============

    public getGamutSize(): number {
        return this.gamut.length;
    }

    public getExtractedPalette(): vec3[] {
        return [...this.extractedPalette];
    }

    public getProjectedPalette(): vec3[] {
        return [...this.projectedPalette];
    }

    public rebuildGamut(): void {
        this.initPigments();
        this.buildGamut();
    }
}
