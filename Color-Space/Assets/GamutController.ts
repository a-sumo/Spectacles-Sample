// GamutController.ts - Lens Studio TypeScript Component
// Attach to SceneObject with mesh + material using the gamut shader

@component
export class GamutController extends BaseScriptComponent {
    
    @input
    material: Material;
    
    @input
    scale: number = 50.0;
    
    // Pigment definitions: K (absorption), S (scattering)
    private pigments = [
        { name: 'White',  k: new vec3(0.02, 0.02, 0.02), s: new vec3(1.0, 1.0, 1.0) },
        { name: 'Black',  k: new vec3(8.0, 8.0, 8.0),    s: new vec3(0.2, 0.2, 0.2) },
        { name: 'Yellow', k: new vec3(0.1, 0.15, 2.5),   s: new vec3(0.8, 0.8, 0.3) },
        { name: 'Red',    k: new vec3(0.2, 2.5, 2.0),    s: new vec3(0.8, 0.3, 0.3) },
        { name: 'Blue',   k: new vec3(2.0, 2.0, 0.2),    s: new vec3(0.4, 0.4, 0.9) },
        { name: 'Green',  k: new vec3(2.5, 0.5, 1.5),    s: new vec3(0.3, 0.8, 0.6) },
    ];
    
    // Currently selected pigment indices
    private selected: number[] = [0, 3, 4]; // White, Red, Blue
    
    onAwake() {
        this.updateMaterial();
    }
    
    // Call this when pigment selection changes
    setSelectedPigments(indices: number[]) {
        // Pad to 3 pigments
        this.selected = [
            indices[0] ?? 0,
            indices[1] ?? indices[0] ?? 0,
            indices[2] ?? indices[1] ?? indices[0] ?? 0
        ];
        this.updateMaterial();
    }
    
    private updateMaterial() {
        if (!this.material) return;
        
        const p0 = this.pigments[this.selected[0]];
        const p1 = this.pigments[this.selected[1]];
        const p2 = this.pigments[this.selected[2]];
        
        // Set uniforms
        this.material.mainPass.uK0 = p0.k;
        this.material.mainPass.uS0 = p0.s;
        this.material.mainPass.uK1 = p1.k;
        this.material.mainPass.uS1 = p1.s;
        this.material.mainPass.uK2 = p2.k;
        this.material.mainPass.uS2 = p2.s;
        this.material.mainPass.scale = this.scale;
    }
    
    // === PROJECTION LOGIC (CPU-side) ===
    
    // RGB to LAB conversion
    private rgb2lab(r: number, g: number, b: number): vec3 {
        // Normalize and linearize
        let rr = r / 255, gg = g / 255, bb = b / 255;
        rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
        gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
        bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;
        
        // RGB -> XYZ
        let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
        let y = rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750;
        let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883;
        
        // XYZ -> LAB
        const f = (t: number) => t > 0.008856 ? Math.pow(t, 1/3) : 7.787 * t + 16/116;
        const fx = f(x), fy = f(y), fz = f(z);
        
        return new vec3(
            116 * fy - 16,
            500 * (fx - fy),
            200 * (fy - fz)
        );
    }
    
    // Kubelka-Munk mixing (CPU)
    private mixKM(weights: vec3): vec3 {
        const p0 = this.pigments[this.selected[0]];
        const p1 = this.pigments[this.selected[1]];
        const p2 = this.pigments[this.selected[2]];
        
        // Blend K and S
        const k = new vec3(
            weights.x * p0.k.x + weights.y * p1.k.x + weights.z * p2.k.x,
            weights.x * p0.k.y + weights.y * p1.k.y + weights.z * p2.k.y,
            weights.x * p0.k.z + weights.y * p1.k.z + weights.z * p2.k.z
        );
        const s = new vec3(
            weights.x * p0.s.x + weights.y * p1.s.x + weights.z * p2.s.x,
            weights.x * p0.s.y + weights.y * p1.s.y + weights.z * p2.s.y,
            weights.x * p0.s.z + weights.y * p1.s.z + weights.z * p2.s.z
        );
        
        // KM equation per channel
        const refl = (kv: number, sv: number) => {
            const ks = kv / sv;
            return Math.max(0, Math.min(1, 1 + ks - Math.sqrt(ks * ks + 2 * ks)));
        };
        
        const r = refl(k.x, s.x);
        const g = refl(k.y, s.y);
        const b = refl(k.z, s.z);
        
        // Gamma correction
        const gamma = (v: number) => v > 0.0031308 ? 1.055 * Math.pow(v, 1/2.4) - 0.055 : 12.92 * v;
        
        return new vec3(
            Math.round(gamma(r) * 255),
            Math.round(gamma(g) * 255),
            Math.round(gamma(b) * 255)
        );
    }
    
    // Build gamut lookup table for projection
    private gamutPoints: { lab: vec3, rgb: vec3, weights: vec3 }[] = [];
    
    buildGamutLookup(steps: number = 32) {
        this.gamutPoints = [];
        
        for (let i = 0; i <= steps; i++) {
            for (let j = 0; j <= steps - i; j++) {
                const k = steps - i - j;
                const w = new vec3(i / steps, j / steps, k / steps);
                const rgb = this.mixKM(w);
                const lab = this.rgb2lab(rgb.x, rgb.y, rgb.z);
                
                this.gamutPoints.push({ lab, rgb, weights: w });
            }
        }
        
        print(`Built gamut with ${this.gamutPoints.length} points`);
    }
    
    // Project a color to the gamut (find closest point)
    projectToGamut(r: number, g: number, b: number): { 
        rgb: vec3, 
        lab: vec3, 
        deltaE: number,
        weights: vec3 
    } {
        const targetLab = this.rgb2lab(r, g, b);
        
        let minDist = Infinity;
        let closest = this.gamutPoints[0];
        
        for (const p of this.gamutPoints) {
            const dist = Math.sqrt(
                Math.pow(targetLab.x - p.lab.x, 2) +
                Math.pow(targetLab.y - p.lab.y, 2) +
                Math.pow(targetLab.z - p.lab.z, 2)
            );
            
            if (dist < minDist) {
                minDist = dist;
                closest = p;
            }
        }
        
        return {
            rgb: closest.rgb,
            lab: closest.lab,
            deltaE: minDist,
            weights: closest.weights
        };
    }
    
    // Convert LAB to world position (for visualization)
    labToWorldPos(lab: vec3): vec3 {
        return new vec3(
            lab.y * this.scale / 128,        // a -> X
            (lab.x - 50) * this.scale / 50,  // L -> Y
            lab.z * this.scale / 128         // b -> Z
        );
    }
}