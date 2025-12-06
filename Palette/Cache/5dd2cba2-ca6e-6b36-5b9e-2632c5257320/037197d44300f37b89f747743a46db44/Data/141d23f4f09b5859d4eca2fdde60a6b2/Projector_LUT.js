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
exports.Projector_LUT = void 0;
var __selfType = requireType("./Projector_LUT");
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
// Projector_LUT.ts
// Generates a 3D LUT that maps any LAB color to nearest gamut color
// Alternative to Projector_Gamut for real-time image processing
let Projector_LUT = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Projector_LUT = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.gamutPosTexture = this.gamutPosTexture;
            this.gamutColorTexture = this.gamutColorTexture;
            this.lutResolution = this.lutResolution;
            this.gamutTexSize = this.gamutTexSize;
            this.projectionMaterial = this.projectionMaterial;
            this.projectionMethod = this.projectionMethod;
            this.gamutCache = [];
        }
        __initialize() {
            super.__initialize();
            this.gamutPosTexture = this.gamutPosTexture;
            this.gamutColorTexture = this.gamutColorTexture;
            this.lutResolution = this.lutResolution;
            this.gamutTexSize = this.gamutTexSize;
            this.projectionMaterial = this.projectionMaterial;
            this.projectionMethod = this.projectionMethod;
            this.gamutCache = [];
        }
        onAwake() {
            // Wait for gamut textures to be ready
            this.createEvent("UpdateEvent").bind(() => {
                this.buildLUT();
            });
        }
        buildLUT() {
            // Only build once
            if (this.lutTexture)
                return;
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
            this.lutTexture = ProceduralTextureProvider.createWithFormat(atlasWidth, atlasHeight, TextureFormat.RGBA8Unorm);
            const pixels = new Uint8Array(atlasWidth * atlasHeight * 4);
            // Step 3: For each LAB point, find nearest gamut color
            for (let bIdx = 0; bIdx < res; bIdx++) { // b* axis (slices)
                for (let aIdx = 0; aIdx < res; aIdx++) { // a* axis (columns within slice)
                    for (let lIdx = 0; lIdx < res; lIdx++) { // L* axis (rows)
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
            this.lutTexture.control.setPixels(0, 0, atlasWidth, atlasHeight, pixels);
            // Assign to material
            if (this.projectionMaterial) {
                this.projectionMaterial.mainPass.projectionLUT = this.lutTexture;
                this.projectionMaterial.mainPass.lutResolution = res;
            }
            const elapsed = getTime() - startTime;
            print(`LUT built: ${res}³ = ${res * res * res} entries in ${elapsed.toFixed(2)}s`);
            print(`Gamut size: ${this.gamutCache.length} colors`);
        }
        cacheGamut() {
            if (!this.gamutPosTexture || !this.gamutColorTexture)
                return;
            try {
                const posTemp = ProceduralTextureProvider.createFromTexture(this.gamutPosTexture);
                const colTemp = ProceduralTextureProvider.createFromTexture(this.gamutColorTexture);
                const size = this.gamutTexSize;
                const posPixels = new Uint8Array(size * size * 4);
                const colPixels = new Uint8Array(size * size * 4);
                posTemp.control.getPixels(0, 0, size, size, posPixels);
                colTemp.control.getPixels(0, 0, size, size, colPixels);
                this.gamutCache = [];
                for (let i = 0; i < size * size; i++) {
                    const idx = i * 4;
                    // Check alpha for validity
                    if (posPixels[idx + 3] < 128)
                        continue;
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
            }
            catch (e) {
                print("Error caching gamut: " + e);
            }
        }
        projectToGamut(targetLab) {
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
            }
            else {
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
        labDistance(a, b) {
            const dL = a.x - b.x;
            const da = a.y - b.y;
            const db = a.z - b.z;
            return Math.sqrt(dL * dL + da * da + db * db);
        }
        lab2lch(lab) {
            const c = Math.sqrt(lab.y * lab.y + lab.z * lab.z);
            let h = Math.atan2(lab.z, lab.y) * (180 / Math.PI);
            if (h < 0)
                h += 360;
            return new vec3(lab.x, c, h);
        }
    };
    __setFunctionName(_classThis, "Projector_LUT");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Projector_LUT = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Projector_LUT = _classThis;
})();
exports.Projector_LUT = Projector_LUT;
//# sourceMappingURL=Projector_LUT.js.map