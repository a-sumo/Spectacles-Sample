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
exports.PaletteExtractor = void 0;
var __selfType = requireType("./PaletteExtractor");
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
// Extracts a color palette from an input texture using k-means clustering
let PaletteExtractor = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PaletteExtractor = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.inputTexture = this.inputTexture;
            this.paletteSize = this.paletteSize;
            this.maxIterations = this.maxIterations;
            this.sampleSize = this.sampleSize;
            this.gamutProjector = this.gamutProjector;
            this.debugMode = this.debugMode;
            this.extractedPalette = [];
            this.projectedPalette = [];
            this.isInitialized = false;
            this.textureProvider = null;
        }
        __initialize() {
            super.__initialize();
            this.inputTexture = this.inputTexture;
            this.paletteSize = this.paletteSize;
            this.maxIterations = this.maxIterations;
            this.sampleSize = this.sampleSize;
            this.gamutProjector = this.gamutProjector;
            this.debugMode = this.debugMode;
            this.extractedPalette = [];
            this.projectedPalette = [];
            this.isInitialized = false;
            this.textureProvider = null;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
        }
        initialize() {
            if (!this.inputTexture) {
                print("PaletteExtractor ERROR: No inputTexture assigned!");
                return;
            }
            try {
                const temp = ProceduralTextureProvider.createFromTexture(this.inputTexture);
                this.textureProvider = temp.control;
            }
            catch (e) {
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
        extractPalette() {
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
            const sampled = [];
            const step = Math.max(1, Math.floor(totalPixels / this.sampleSize));
            for (let i = 0; i < totalPixels; i += step) {
                const idx = i * 4;
                const r = pixels[idx] / 255;
                const g = pixels[idx + 1] / 255;
                const b = pixels[idx + 2] / 255;
                const a = pixels[idx + 3] / 255;
                // Skip transparent pixels
                if (a < 0.5)
                    continue;
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
        kMeans(pixels, k, maxIter) {
            // Initialize centroids randomly from input pixels
            const centroids = [];
            const usedIndices = new Set();
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
                const clusters = Array(k).fill(null).map(() => []);
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
                    if (clusters[c].length === 0)
                        continue;
                    let sumR = 0, sumG = 0, sumB = 0;
                    for (const p of clusters[c]) {
                        sumR += p.x;
                        sumG += p.y;
                        sumB += p.z;
                    }
                    const newCentroid = new vec3(sumR / clusters[c].length, sumG / clusters[c].length, sumB / clusters[c].length);
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
        colorDistanceSq(a, b) {
            const dr = a.x - b.x;
            const dg = a.y - b.y;
            const db = a.z - b.z;
            return dr * dr + dg * dg + db * db;
        }
        /**
         * Extract and project palette through GamutProjector
         */
        extractAndProject() {
            const extracted = this.extractPalette();
            if (extracted.length === 0) {
                return { original: [], projected: [] };
            }
            if (!this.gamutProjector) {
                print("PaletteExtractor: No Projector_Gamut assigned, returning unprojected");
                return { original: extracted, projected: extracted };
            }
            const projector = this.gamutProjector;
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
        getProjectedPalette() {
            if (!this.gamutProjector)
                return this.extractedPalette;
            const projector = this.gamutProjector;
            if (!projector.isReady?.())
                return this.extractedPalette;
            this.projectedPalette = projector.getProjectedColors() || [];
            return this.projectedPalette;
        }
        /**
         * Get the last extracted palette
         */
        getExtractedPalette() {
            return [...this.extractedPalette];
        }
        /**
         * Set input texture dynamically
         */
        setInputTexture(texture) {
            this.inputTexture = texture;
            try {
                const temp = ProceduralTextureProvider.createFromTexture(texture);
                this.textureProvider = temp.control;
                this.isInitialized = true;
            }
            catch (e) {
                print(`PaletteExtractor: Failed to set texture: ${e}`);
            }
        }
        isReady() {
            return this.isInitialized;
        }
    };
    __setFunctionName(_classThis, "PaletteExtractor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaletteExtractor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaletteExtractor = _classThis;
})();
exports.PaletteExtractor = PaletteExtractor;
//# sourceMappingURL=PaletteExtractor.js.map