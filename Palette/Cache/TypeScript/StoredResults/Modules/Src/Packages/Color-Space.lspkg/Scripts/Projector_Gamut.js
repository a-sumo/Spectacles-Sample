"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projector_Gamut = void 0;
var __selfType = requireType("./Projector_Gamut");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
// Projector_Gamut.ts
// CPU-based gamut projection - finds nearest achievable color for each input
// No GPU shader dependency - reads encoder textures directly
let Projector_Gamut = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Projector_Gamut = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.encoder = this.encoder;
            // ============ PRIVATE STATE ============
            this.gamutTexSize = 64;
            this.gamutColors = []; // RGB colors from encoder
            this.gamutLAB = []; // LAB positions from encoder
            this.inputColors = [];
            this.projectedColors = [];
            this.projectedLAB = [];
            this.isInitialized = false;
            this.initAttempts = 0;
        }
        __initialize() {
            super.__initialize();
            this.encoder = this.encoder;
            // ============ PRIVATE STATE ============
            this.gamutTexSize = 64;
            this.gamutColors = []; // RGB colors from encoder
            this.gamutLAB = []; // LAB positions from encoder
            this.inputColors = [];
            this.projectedColors = [];
            this.projectedLAB = [];
            this.isInitialized = false;
            this.initAttempts = 0;
        }
        onAwake() {
            this.createEvent("UpdateEvent").bind(() => this.tryInit());
        }
        tryInit() {
            if (this.isInitialized)
                return;
            this.initAttempts++;
            // Debug every 10 attempts
            if (this.initAttempts % 10 === 1) {
                print(`Projector_Gamut: Init attempt ${this.initAttempts}`);
                print(`  encoder assigned: ${this.encoder != null}`);
                if (this.encoder) {
                    const enc = this.encoder;
                    print(`  encoder.isReady exists: ${typeof enc.isReady === 'function'}`);
                    if (typeof enc.isReady === 'function') {
                        print(`  encoder.isReady(): ${enc.isReady()}`);
                    }
                }
            }
            if (!this.encoder)
                return;
            const enc = this.encoder;
            if (!enc.isReady || !enc.isReady())
                return;
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
        loadGamutData(posRT, colorRT) {
            try {
                const size = this.gamutTexSize;
                // Read position texture (LAB encoded)
                const posTemp = ProceduralTextureProvider.createFromTexture(posRT);
                const posProvider = posTemp.control;
                const posPixels = new Uint8Array(size * size * 4);
                posProvider.getPixels(0, 0, size, size, posPixels);
                // Read color texture (RGB)
                const colorTemp = ProceduralTextureProvider.createFromTexture(colorRT);
                const colorProvider = colorTemp.control;
                const colorPixels = new Uint8Array(size * size * 4);
                colorProvider.getPixels(0, 0, size, size, colorPixels);
                // Parse pixels into arrays
                this.gamutColors = [];
                this.gamutLAB = [];
                for (let i = 0; i < size * size; i++) {
                    const idx = i * 4;
                    const alpha = posPixels[idx + 3];
                    // Skip invalid entries (alpha < 128)
                    if (alpha < 128)
                        continue;
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
                    print(`  [${i}] RGB(${(c.x * 255).toFixed(0)}, ${(c.y * 255).toFixed(0)}, ${(c.z * 255).toFixed(0)}) LAB(${lab.x.toFixed(1)}, ${lab.y.toFixed(1)}, ${lab.z.toFixed(1)})`);
                }
            }
            catch (e) {
                print("Projector_Gamut: Error loading gamut data: " + e);
            }
        }
        // ============ COLOR CONVERSION ============
        rgb2lab(rgb) {
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
        findNearestGamutColor(inputLAB) {
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
        isReady() {
            return this.isInitialized && this.gamutColors.length > 0;
        }
        setInputColors(colors) {
            this.inputColors = colors.slice();
            this.projectColors();
        }
        projectColors() {
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
        getInputColors() {
            return [...this.inputColors];
        }
        getProjectedColors() {
            return [...this.projectedColors];
        }
        getProjectedLAB() {
            return [...this.projectedLAB];
        }
        getProjectionResults() {
            const results = [];
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
        getGamutSize() {
            return this.gamutColors.length;
        }
    };
    __setFunctionName(_classThis, "Projector_Gamut");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Projector_Gamut = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Projector_Gamut = _classThis;
})();
exports.Projector_Gamut = Projector_Gamut;
//# sourceMappingURL=Projector_Gamut.js.map