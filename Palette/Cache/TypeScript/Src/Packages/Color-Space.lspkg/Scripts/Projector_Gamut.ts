// Projector_Gamut.ts
// CPU-based gamut projection - finds nearest achievable color for each input
// No GPU shader dependency - reads encoder textures directly

@component
export class Projector_Gamut extends BaseScriptComponent {

    @input
    @hint("Encoder script (Encoder_PigmentMix or Encoder_FullRGB)")
    encoder: ScriptComponent;

    // ============ PRIVATE STATE ============

    private gamutTexSize: number = 64;
    private gamutColors: vec3[] = [];  // RGB colors from encoder
    private gamutLAB: vec3[] = [];     // LAB positions from encoder
    private inputColors: vec3[] = [];
    private projectedColors: vec3[] = [];
    private projectedLAB: vec3[] = [];
    private isInitialized: boolean = false;

    onAwake(): void {
        this.createEvent("UpdateEvent").bind(() => this.tryInit());
    }

    private initAttempts: number = 0;

    private tryInit(): void {
        if (this.isInitialized) return;

        this.initAttempts++;

        // Debug every 10 attempts
        if (this.initAttempts % 10 === 1) {
            print(`Projector_Gamut: Init attempt ${this.initAttempts}`);
            print(`  encoder assigned: ${this.encoder != null}`);
            if (this.encoder) {
                const enc = this.encoder as any;
                print(`  encoder.isReady exists: ${typeof enc.isReady === 'function'}`);
                if (typeof enc.isReady === 'function') {
                    print(`  encoder.isReady(): ${enc.isReady()}`);
                }
            }
        }

        if (!this.encoder) return;

        const enc = this.encoder as any;
        if (!enc.isReady || !enc.isReady()) return;

        // Get encoder data
        this.gamutTexSize = enc.getTexSize();
        const posRT = enc.getPosRenderTarget();
        const colorRT = enc.getColorRenderTarget();

        if (!posRT || !colorRT) {
            print("Projector_Gamut: Encoder textures not ready");
            return;
        }

        // Read gamut data from render targets
        this.loadGamutData(posRT, colorRT);

        this.isInitialized = true;
        print(`Projector_Gamut: Ready (${this.gamutColors.length} gamut colors loaded)`);
    }

    private loadGamutData(posRT: Texture, colorRT: Texture): void {
        try {
            const size = this.gamutTexSize;

            // Read position texture (LAB encoded)
            const posTemp = ProceduralTextureProvider.createFromTexture(posRT);
            const posProvider = posTemp.control as ProceduralTextureProvider;
            const posPixels = new Uint8Array(size * size * 4);
            posProvider.getPixels(0, 0, size, size, posPixels);

            // Read color texture (RGB)
            const colorTemp = ProceduralTextureProvider.createFromTexture(colorRT);
            const colorProvider = colorTemp.control as ProceduralTextureProvider;
            const colorPixels = new Uint8Array(size * size * 4);
            colorProvider.getPixels(0, 0, size, size, colorPixels);

            // Parse pixels into arrays
            this.gamutColors = [];
            this.gamutLAB = [];

            for (let i = 0; i < size * size; i++) {
                const idx = i * 4;
                const alpha = posPixels[idx + 3];

                // Skip invalid entries (alpha < 128)
                if (alpha < 128) continue;

                // Decode LAB from position texture
                // Format: R = normA, G = normL, B = normB (same as input encoding)
                const normA = posPixels[idx + 0] / 255;
                const normL = posPixels[idx + 1] / 255;
                const normB = posPixels[idx + 2] / 255;

                const L = normL * 100;
                const a = normA * 255 - 128;
                const b = normB * 255 - 128;

                this.gamutLAB.push(new vec3(L, a, b));

                // Decode RGB from color texture
                const r = colorPixels[idx + 0] / 255;
                const g = colorPixels[idx + 1] / 255;
                const bCol = colorPixels[idx + 2] / 255;

                this.gamutColors.push(new vec3(r, g, bCol));
            }

            print(`Projector_Gamut: Loaded ${this.gamutColors.length} valid gamut entries`);

            // Debug: print first few colors
            for (let i = 0; i < Math.min(3, this.gamutColors.length); i++) {
                const c = this.gamutColors[i];
                const lab = this.gamutLAB[i];
                print(`  [${i}] RGB(${(c.x*255).toFixed(0)}, ${(c.y*255).toFixed(0)}, ${(c.z*255).toFixed(0)}) LAB(${lab.x.toFixed(1)}, ${lab.y.toFixed(1)}, ${lab.z.toFixed(1)})`);
            }

        } catch (e) {
            print("Projector_Gamut: Error loading gamut data: " + e);
        }
    }

    // ============ COLOR CONVERSION ============

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

    // ============ PROJECTION (CPU) ============

    private findNearestGamutColor(inputLAB: vec3): { rgb: vec3; lab: vec3; deltaE: number } {
        let bestRGB = new vec3(0.5, 0.5, 0.5);
        let bestLAB = new vec3(50, 0, 0);
        let minDistSq = Infinity;

        for (let i = 0; i < this.gamutLAB.length; i++) {
            const gamutLab = this.gamutLAB[i];

            const dL = inputLAB.x - gamutLab.x;
            const da = inputLAB.y - gamutLab.y;
            const db = inputLAB.z - gamutLab.z;
            const distSq = dL * dL + da * da + db * db;

            if (distSq < minDistSq) {
                minDistSq = distSq;
                bestRGB = this.gamutColors[i];
                bestLAB = gamutLab;
            }
        }

        return {
            rgb: bestRGB,
            lab: bestLAB,
            deltaE: Math.sqrt(minDistSq)
        };
    }

    // ============ PUBLIC API ============

    public isReady(): boolean {
        return this.isInitialized && this.gamutColors.length > 0;
    }

    public setInputColors(colors: vec3[]): void {
        this.inputColors = colors.slice();
        this.projectColors();
    }

    private projectColors(): void {
        if (!this.isReady()) {
            print("Projector_Gamut: Not ready, cannot project");
            return;
        }

        this.projectedColors = [];
        this.projectedLAB = [];

        for (const inputRGB of this.inputColors) {
            const inputLAB = this.rgb2lab(inputRGB);
            const result = this.findNearestGamutColor(inputLAB);
            this.projectedColors.push(result.rgb);
            this.projectedLAB.push(result.lab);
        }
    }

    public getInputColors(): vec3[] {
        return [...this.inputColors];
    }

    public getProjectedColors(): vec3[] {
        return [...this.projectedColors];
    }

    public getProjectedLAB(): vec3[] {
        return [...this.projectedLAB];
    }

    public getProjectionResults(): { input: vec3; projected: vec3; inputLAB: vec3; projectedLAB: vec3; deltaE: number }[] {
        const results: { input: vec3; projected: vec3; inputLAB: vec3; projectedLAB: vec3; deltaE: number }[] = [];

        for (let i = 0; i < this.inputColors.length; i++) {
            const inputRGB = this.inputColors[i];
            const inputLAB = this.rgb2lab(inputRGB);
            const projRGB = this.projectedColors[i] || new vec3(0.5, 0.5, 0.5);
            const projLAB = this.projectedLAB[i] || new vec3(50, 0, 0);

            const dL = inputLAB.x - projLAB.x;
            const da = inputLAB.y - projLAB.y;
            const db = inputLAB.z - projLAB.z;
            const deltaE = Math.sqrt(dL * dL + da * da + db * db);

            results.push({ input: inputRGB, projected: projRGB, inputLAB, projectedLAB: projLAB, deltaE });
        }

        return results;
    }

    public getGamutSize(): number {
        return this.gamutColors.length;
    }
}
