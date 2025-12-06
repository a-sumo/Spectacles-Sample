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
exports.PipelineTester = void 0;
var __selfType = requireType("./PipelineTester");
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
// PipelineTester.ts
// Test each pipeline step independently with mock data
let PipelineTester = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PipelineTester = _classThis = class extends _classSuper {
        constructor() {
            super();
            // ============ COMPONENT REFERENCES ============
            this.paletteExtractor = this.paletteExtractor;
            this.gamutProjector = this.gamutProjector;
            this.imageRegenerator = this.imageRegenerator;
            // ============ TEST INPUTS ============
            this.testImage = this.testImage;
            this.extractColors = this.extractColors;
            // ============ PREVIEW OUTPUT ============
            this.previewMesh = this.previewMesh;
            this.originalMesh = this.originalMesh;
            // ============ TEST CONTROL ============
            this.testMode = this.testMode;
            this.autoRun = this.autoRun;
            this.isInitialized = false;
            this.frameCount = 0;
            this.testState = "idle";
            this.waitFrames = 0;
            // Preview materials (cached)
            this.previewMaterial = null;
            this.originalMaterial = null;
            // Mock palettes for isolated testing
            this.mockOriginalPalette = [];
            this.mockProjectedPalette = [];
            // Results storage
            this.extractedPalette = [];
            this.projectedPalette = [];
            this.outputTexture = null;
            this.projectionRetryCount = 0;
        }
        __initialize() {
            super.__initialize();
            // ============ COMPONENT REFERENCES ============
            this.paletteExtractor = this.paletteExtractor;
            this.gamutProjector = this.gamutProjector;
            this.imageRegenerator = this.imageRegenerator;
            // ============ TEST INPUTS ============
            this.testImage = this.testImage;
            this.extractColors = this.extractColors;
            // ============ PREVIEW OUTPUT ============
            this.previewMesh = this.previewMesh;
            this.originalMesh = this.originalMesh;
            // ============ TEST CONTROL ============
            this.testMode = this.testMode;
            this.autoRun = this.autoRun;
            this.isInitialized = false;
            this.frameCount = 0;
            this.testState = "idle";
            this.waitFrames = 0;
            // Preview materials (cached)
            this.previewMaterial = null;
            this.originalMaterial = null;
            // Mock palettes for isolated testing
            this.mockOriginalPalette = [];
            this.mockProjectedPalette = [];
            // Results storage
            this.extractedPalette = [];
            this.projectedPalette = [];
            this.outputTexture = null;
            this.projectionRetryCount = 0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
            this.createEvent("UpdateEvent").bind(() => this.onUpdate());
        }
        initialize() {
            this.extractor = this.paletteExtractor;
            this.projector = this.gamutProjector;
            this.regenerator = this.imageRegenerator;
            // Create mock palettes
            this.createMockPalettes();
            // Cache preview materials
            this.setupPreviewMeshes();
            this.isInitialized = true;
            print("PipelineTester: Ready");
            print("  Test modes: 1=extraction, 2=projection, 3=regeneration, 4=full");
            if (this.autoRun && this.testMode > 0) {
                this.runTest(this.testMode);
            }
        }
        setupPreviewMeshes() {
            // Setup output preview mesh
            if (this.previewMesh) {
                const rmv = this.previewMesh.getComponent("Component.RenderMeshVisual");
                if (rmv) {
                    // Clone material so we don't affect other objects
                    this.previewMaterial = rmv.mainMaterial.clone();
                    rmv.mainMaterial = this.previewMaterial;
                    print("PipelineTester: Preview mesh ready");
                }
                else {
                    print("WARNING: previewMesh has no RenderMeshVisual");
                }
            }
            // Setup original preview mesh
            if (this.originalMesh) {
                const rmv = this.originalMesh.getComponent("Component.RenderMeshVisual");
                if (rmv) {
                    this.originalMaterial = rmv.mainMaterial.clone();
                    rmv.mainMaterial = this.originalMaterial;
                    // Set original image immediately if available
                    if (this.testImage) {
                        this.setMaterialTexture(this.originalMaterial, this.testImage);
                        print("PipelineTester: Original mesh showing input");
                    }
                }
            }
        }
        setMaterialTexture(material, texture) {
            if (!material || !texture)
                return;
            const pass = material.mainPass;
            // Try common texture property names
            const textureNames = ["baseTex", "mainTex", "diffuseTex", "baseColor"];
            for (const name of textureNames) {
                try {
                    pass.baseTex = texture;
                    return;
                }
                catch (e) {
                    print("Property doesn't exist, try next");
                }
            }
            // Fallback: try setting directly
            try {
                pass.baseTex = texture;
            }
            catch (e) {
                print("WARNING: Could not set texture on material");
            }
        }
        updatePreview() {
            if (this.previewMaterial && this.outputTexture) {
                this.setMaterialTexture(this.previewMaterial, this.outputTexture);
                print("PipelineTester: Preview updated with output texture");
            }
        }
        createMockPalettes() {
            // Mock original palette (varied colors)
            this.mockOriginalPalette = [
                new vec3(0.9, 0.2, 0.1), // Red
                new vec3(0.1, 0.7, 0.2), // Green
                new vec3(0.1, 0.3, 0.9), // Blue
                new vec3(0.95, 0.9, 0.1), // Yellow
                new vec3(0.1, 0.8, 0.8), // Cyan
                new vec3(0.8, 0.1, 0.8), // Magenta
                new vec3(0.95, 0.6, 0.2), // Orange
                new vec3(0.5, 0.2, 0.6), // Purple
                new vec3(0.95, 0.95, 0.95), // White
                new vec3(0.1, 0.1, 0.1), // Black
                new vec3(0.6, 0.4, 0.2), // Brown
                new vec3(0.4, 0.7, 0.4), // Light green
            ];
            // Mock projected palette (simulated gamut-mapped versions)
            this.mockProjectedPalette = [
                new vec3(0.85, 0.25, 0.15),
                new vec3(0.15, 0.65, 0.25),
                new vec3(0.2, 0.35, 0.8),
                new vec3(0.9, 0.85, 0.15),
                new vec3(0.2, 0.7, 0.7),
                new vec3(0.7, 0.2, 0.7),
                new vec3(0.9, 0.55, 0.25),
                new vec3(0.45, 0.25, 0.55),
                new vec3(0.9, 0.9, 0.88),
                new vec3(0.12, 0.12, 0.12),
                new vec3(0.55, 0.4, 0.25),
                new vec3(0.38, 0.65, 0.38),
            ];
        }
        onUpdate() {
            this.frameCount++;
            if (this.testState === "waiting") {
                this.waitFrames--;
                if (this.waitFrames <= 0) {
                    this.continueTest();
                }
            }
        }
        // ============ PUBLIC API ============
        runTest(mode) {
            this.testMode = mode;
            switch (mode) {
                case 1:
                    this.testExtraction();
                    break;
                case 2:
                    this.testProjection();
                    break;
                case 3:
                    this.testRegeneration();
                    break;
                case 4:
                    this.testFullPipeline();
                    break;
                default:
                    print("PipelineTester: Invalid test mode");
            }
        }
        testExtraction() {
            print("\n=== TEST 1: PALETTE EXTRACTION ===");
            if (!this.extractor) {
                print("ERROR: No PaletteExtractor assigned");
                return;
            }
            if (!this.testImage) {
                print("ERROR: No testImage assigned");
                return;
            }
            this.testState = "running";
            this.extractor.setInputTexture(this.testImage);
            this.extractor.paletteSize = this.extractColors;
            const startTime = Date.now();
            this.extractedPalette = this.extractor.extractPalette();
            const elapsed = Date.now() - startTime;
            print(`Extraction complete in ${elapsed}ms`);
            print(`Extracted ${this.extractedPalette.length} colors:`);
            for (let i = 0; i < this.extractedPalette.length; i++) {
                const c = this.extractedPalette[i];
                const hex = this.rgbToHex(c);
                print(`  [${i}] RGB(${(c.x * 255).toFixed(0)}, ${(c.y * 255).toFixed(0)}, ${(c.z * 255).toFixed(0)}) ${hex}`);
            }
            this.testState = "complete";
            print("=== EXTRACTION TEST COMPLETE ===\n");
        }
        testProjection() {
            print("\n=== TEST 2: GAMUT PROJECTION ===");
            if (!this.projector) {
                print("ERROR: No Projector_Gamut assigned");
                return;
            }
            if (!this.projector.isReady?.()) {
                this.projectionRetryCount++;
                if (this.projectionRetryCount > 50) {
                    print("ERROR: Projector_Gamut failed to initialize after 50 retries");
                    this.testState = "complete";
                    return;
                }
                print(`WARNING: Projector_Gamut not ready, retrying... (${this.projectionRetryCount})`);
                this.testState = "waiting";
                this.waitFrames = 3;
                this.testMode = 2; // Ensure continueTest calls the right method
                return;
            }
            this.projectionRetryCount = 0;
            this.testState = "running";
            const inputPalette = this.extractedPalette.length > 0
                ? this.extractedPalette
                : this.mockOriginalPalette;
            print(`Projecting ${inputPalette.length} colors...`);
            this.projector.setInputColors(inputPalette);
            this.testState = "waiting";
            this.waitFrames = 2;
        }
        continueTest() {
            if (this.testMode === 2) {
                // Check if we're still waiting for projector to be ready
                if (this.projectionRetryCount > 0 && !this.projector.isReady?.()) {
                    this.testProjection();
                }
                else {
                    this.finishProjectionTest();
                }
            }
            else if (this.testMode === 4) {
                this.continueFullPipeline();
            }
        }
        finishProjectionTest() {
            this.projectedPalette = this.projector.getProjectedColors();
            const results = this.projector.getProjectionResults();
            print(`Projection complete: ${this.projectedPalette.length} colors`);
            print("");
            let totalDeltaE = 0;
            let maxDeltaE = 0;
            for (let i = 0; i < results.length; i++) {
                const r = results[i];
                totalDeltaE += r.deltaE;
                maxDeltaE = Math.max(maxDeltaE, r.deltaE);
                const inHex = this.rgbToHex(r.input);
                const outHex = this.rgbToHex(r.projected);
                print(`  [${i}] ${inHex} → ${outHex}  ΔE=${r.deltaE.toFixed(2)}`);
            }
            print("");
            print(`Average ΔE: ${(totalDeltaE / results.length).toFixed(2)}`);
            print(`Max ΔE: ${maxDeltaE.toFixed(2)}`);
            this.testState = "complete";
            print("=== PROJECTION TEST COMPLETE ===\n");
        }
        testRegeneration() {
            print("\n=== TEST 3: IMAGE REGENERATION ===");
            if (!this.regenerator) {
                print("ERROR: No ImageRegenerator assigned");
                return;
            }
            if (!this.testImage) {
                print("ERROR: No testImage assigned");
                return;
            }
            if (!this.regenerator.isReady()) {
                print("ERROR: ImageRegenerator not ready");
                return;
            }
            this.testState = "running";
            const original = this.extractedPalette.length > 0
                ? this.extractedPalette
                : this.mockOriginalPalette;
            const projected = this.projectedPalette.length > 0
                ? this.projectedPalette
                : this.mockProjectedPalette;
            print("Using " + original.length + " original colors");
            print("Using " + projected.length + " projected colors");
            this.regenerator.setInputTexture(this.testImage);
            this.regenerator.setPalette(original, projected);
            if (this.previewMesh) {
                const rmv = this.previewMesh.getComponent("Component.RenderMeshVisual");
                if (rmv) {
                    this.regenerator.applyToMesh(rmv);
                    print("Applied remapped material to preview mesh");
                }
            }
            this.testState = "complete";
            print("=== REGENERATION TEST COMPLETE ===\n");
        }
        testFullPipeline() {
            print("\n=== TEST 4: FULL PIPELINE ===");
            print("Step 1/3: Extraction");
            if (!this.extractor || !this.projector || !this.regenerator) {
                print("ERROR: Missing pipeline components");
                return;
            }
            if (!this.testImage) {
                print("ERROR: No testImage assigned");
                return;
            }
            this.testState = "running";
            // Update original preview
            if (this.originalMaterial) {
                this.setMaterialTexture(this.originalMaterial, this.testImage);
            }
            // Step 1: Extract
            this.regenerator.inputTexture = this.testImage;
            this.extractor.paletteSize = this.extractColors;
            this.extractedPalette = this.extractor.extractPalette();
            print(`  Extracted ${this.extractedPalette.length} colors`);
            if (this.extractedPalette.length === 0) {
                print("ERROR: Extraction failed");
                this.testState = "complete";
                return;
            }
            // Step 2: Project
            print("Step 2/3: Projection");
            if (!this.projector.isReady?.()) {
                print("  WARNING: Projector not ready, using pass-through");
                this.projectedPalette = this.extractedPalette;
                this.finishFullPipeline();
                return;
            }
            this.projector.setInputColors(this.extractedPalette);
            this.testState = "waiting";
            this.waitFrames = 2;
        }
        continueFullPipeline() {
            this.projectedPalette = this.projector.getProjectedColors();
            if (this.projectedPalette.length === 0) {
                print("  WARNING: Projection returned empty, using original");
                this.projectedPalette = this.extractedPalette;
            }
            else {
                const results = this.projector.getProjectionResults();
                const avgDeltaE = results.reduce((s, r) => s + r.deltaE, 0) / results.length;
                print(`  Projected ${this.projectedPalette.length} colors (avg ΔE=${avgDeltaE.toFixed(2)})`);
            }
            this.finishFullPipeline();
        }
        finishFullPipeline() {
            print("Step 3/3: Regeneration");
            this.regenerator.setInputTexture(this.testImage);
            this.regenerator.setPalette(this.extractedPalette, this.projectedPalette);
            // Apply to preview mesh using GPU-based material
            if (this.previewMesh) {
                const rmv = this.previewMesh.getComponent("Component.RenderMeshVisual");
                if (rmv) {
                    this.regenerator.applyToMesh(rmv);
                    print("  Applied remapped material to preview mesh");
                }
            }
            this.testState = "complete";
            print("=== FULL PIPELINE COMPLETE ===\n");
            this.printSummary();
        }
        printSummary() {
            print("--- PIPELINE SUMMARY ---");
            print(`Input: ${this.testImage?.getWidth()}x${this.testImage?.getHeight()}`);
            print(`Palette: ${this.extractedPalette.length} colors extracted`);
            print(`Projection: ${this.projectedPalette.length} colors mapped`);
            print(`Output: GPU material applied`);
            if (this.previewMesh) {
                print(`Preview: Updated on ${this.previewMesh.name}`);
            }
            print("------------------------");
        }
        // ============ UTILITY ============
        rgbToHex(c) {
            const r = Math.round(c.x * 255)
                .toString(16)
                .padStart(2, "0");
            const g = Math.round(c.y * 255)
                .toString(16)
                .padStart(2, "0");
            const b = Math.round(c.z * 255)
                .toString(16)
                .padStart(2, "0");
            return `#${r}${g}${b}`;
        }
        // ============ GETTERS ============
        getExtractedPalette() {
            return [...this.extractedPalette];
        }
        getProjectedPalette() {
            return [...this.projectedPalette];
        }
        getOutputTexture() {
            return this.outputTexture;
        }
        isComplete() {
            return this.testState === "complete";
        }
        getState() {
            return this.testState;
        }
        /**
         * Manually set output to a different mesh
         */
        setOutputToMesh(mesh) {
            if (!this.outputTexture) {
                print("No output texture to display");
                return;
            }
            const rmv = mesh.getComponent("Component.RenderMeshVisual");
            if (rmv && rmv.mainMaterial) {
                this.setMaterialTexture(rmv.mainMaterial, this.outputTexture);
                print(`Set output texture on ${mesh.name}`);
            }
        }
    };
    __setFunctionName(_classThis, "PipelineTester");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PipelineTester = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PipelineTester = _classThis;
})();
exports.PipelineTester = PipelineTester;
//# sourceMappingURL=PipelineTester.js.map