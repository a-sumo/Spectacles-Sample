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
exports.ImagePipeline = void 0;
var __selfType = requireType("./Image Pipeline");
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
// ImagePipeline.ts
// Orchestrates the full image → palette → projection → regeneration pipeline
let ImagePipeline = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ImagePipeline = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.paletteExtractor = this.paletteExtractor;
            this.gamutProjector = this.gamutProjector;
            this.imageRegenerator = this.imageRegenerator;
            this.inputTexture = this.inputTexture;
            this.paletteSize = this.paletteSize;
            this.debugMode = this.debugMode;
            this.pipelineState = "idle";
            this.frameCounter = 0;
        }
        __initialize() {
            super.__initialize();
            this.paletteExtractor = this.paletteExtractor;
            this.gamutProjector = this.gamutProjector;
            this.imageRegenerator = this.imageRegenerator;
            this.inputTexture = this.inputTexture;
            this.paletteSize = this.paletteSize;
            this.debugMode = this.debugMode;
            this.pipelineState = "idle";
            this.frameCounter = 0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
            this.createEvent("UpdateEvent").bind(() => this.onUpdate());
        }
        initialize() {
            this.extractor = this.paletteExtractor;
            this.projector = this.gamutProjector;
            this.regenerator = this.imageRegenerator;
            if (this.debugMode) {
                print("ImagePipeline: Initialized");
            }
        }
        onUpdate() {
            if (this.pipelineState === "projecting") {
                this.frameCounter++;
                if (this.frameCounter >= 2) {
                    this.finishProjection();
                }
            }
        }
        /**
         * Run the full pipeline
         */
        run() {
            if (!this.extractor?.isReady?.() || !this.projector?.isReady?.()) {
                print("ImagePipeline: Components not ready");
                return;
            }
            this.pipelineState = "extracting";
            if (this.debugMode) {
                print("ImagePipeline: Starting extraction...");
            }
            // Step 1: Extract palette
            if (this.inputTexture) {
                this.extractor.setInputTexture(this.inputTexture);
            }
            this.extractor.paletteSize = this.paletteSize;
            const { original } = this.extractor.extractAndProject();
            if (original.length === 0) {
                print("ImagePipeline: Extraction failed");
                this.pipelineState = "idle";
                return;
            }
            // Step 2: Send to projector (async - GPU)
            this.projector.setInputColors(original);
            this.pipelineState = "projecting";
            this.frameCounter = 0;
            if (this.debugMode) {
                print(`ImagePipeline: Projecting ${original.length} colors...`);
            }
        }
        finishProjection() {
            // Step 3: Get projected colors
            const original = this.extractor.getExtractedPalette();
            const projected = this.projector.getProjectedColors();
            if (projected.length === 0) {
                print("ImagePipeline: Projection failed");
                this.pipelineState = "idle";
                return;
            }
            if (this.debugMode) {
                print(`ImagePipeline: Got ${projected.length} projected colors`);
                // Log some deltas
                const results = this.projector.getProjectionResults();
                let totalDeltaE = 0;
                for (const r of results) {
                    totalDeltaE += r.deltaE;
                }
                print(`ImagePipeline: Average ΔE = ${(totalDeltaE / results.length).toFixed(2)}`);
            }
            // Step 4: Regenerate image
            this.pipelineState = "regenerating";
            if (this.regenerator?.isReady?.()) {
                this.regenerator.setPalette(original, projected);
                const outputTex = this.regenerator.processCPU();
                if (this.debugMode) {
                    print("ImagePipeline: Regeneration complete");
                }
            }
            this.pipelineState = "complete";
        }
        /**
         * Get extracted palette
         */
        getExtractedPalette() {
            return this.extractor?.getExtractedPalette() || [];
        }
        /**
         * Get projected palette
         */
        getProjectedPalette() {
            return this.projector?.getProjectedColors() || [];
        }
        /**
         * Get output texture
         */
        getOutputTexture() {
            return this.regenerator?.getOutputTexture();
        }
        /**
         * Get pipeline state
         */
        getState() {
            return this.pipelineState;
        }
        /**
         * Check if complete
         */
        isComplete() {
            return this.pipelineState === "complete";
        }
    };
    __setFunctionName(_classThis, "ImagePipeline");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ImagePipeline = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ImagePipeline = _classThis;
})();
exports.ImagePipeline = ImagePipeline;
//# sourceMappingURL=Image%20Pipeline.js.map