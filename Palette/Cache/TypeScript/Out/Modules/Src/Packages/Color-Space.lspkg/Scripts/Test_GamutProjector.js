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
exports.Test_GamutProjector = void 0;
var __selfType = requireType("./Test_GamutProjector");
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
// Test_GamutProjector.ts
// OLD VERSION - kept for reference/testing
// Use Projector_Gamut.ts instead
let Test_GamutProjector = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Test_GamutProjector = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.projectionMaterial = this.projectionMaterial;
            this.gamutEncoder = this.gamutEncoder;
            // ============ TEXTURE SIZE CONFIGURATION ============
            this.gamutTexSize = this.gamutTexSize;
            this.gamutValidCount = this.gamutValidCount;
            this.inputTexWidth = this.inputTexWidth;
            this.inputTexHeight = this.inputTexHeight;
            // Total input capacity = inputTexWidth * inputTexHeight = 64 colors
            // ============ INPUT COLORS (SET2) ============
            // These are the colors we want to project onto the gamut
            this.input0 = this.input0; // Orange
            this.input1 = this.input1; // Cyan-ish
            this.input2 = this.input2; // Purple
            this.input3 = this.input3; // Yellow
            this.input4 = this.input4; // Teal
            this.input5 = this.input5; // Red
            this.inputColors = [];
            this.isInitialized = false;
        }
        __initialize() {
            super.__initialize();
            this.projectionMaterial = this.projectionMaterial;
            this.gamutEncoder = this.gamutEncoder;
            // ============ TEXTURE SIZE CONFIGURATION ============
            this.gamutTexSize = this.gamutTexSize;
            this.gamutValidCount = this.gamutValidCount;
            this.inputTexWidth = this.inputTexWidth;
            this.inputTexHeight = this.inputTexHeight;
            // Total input capacity = inputTexWidth * inputTexHeight = 64 colors
            // ============ INPUT COLORS (SET2) ============
            // These are the colors we want to project onto the gamut
            this.input0 = this.input0; // Orange
            this.input1 = this.input1; // Cyan-ish
            this.input2 = this.input2; // Purple
            this.input3 = this.input3; // Yellow
            this.input4 = this.input4; // Teal
            this.input5 = this.input5; // Red
            this.inputColors = [];
            this.isInitialized = false;
        }
        onAwake() {
            // Wait a frame for encoder to initialize its render targets
            this.createEvent("UpdateEvent").bind(() => this.tryInitialize());
        }
        tryInitialize() {
            if (this.isInitialized)
                return;
            // ============ VALIDATION ============
            if (!this.projectionMaterial) {
                print("ERROR: projectionMaterial not set");
                return;
            }
            if (!this.gamutEncoder) {
                print("ERROR: gamutEncoder script reference not set");
                return;
            }
            // ============ GET RENDER TARGETS FROM ENCODER ============
            // Access the encoder's render targets via its public getters or direct property access
            const encoder = this.gamutEncoder;
            // Try to get render targets - they may not exist on first frame
            this.gamutPosTexture = encoder.posRenderTarget || encoder.getPosRenderTarget?.();
            this.gamutColorTexture = encoder.colorRenderTarget || encoder.getColorRenderTarget?.();
            if (!this.gamutPosTexture || !this.gamutColorTexture) {
                // Not ready yet, try again next frame
                print("Waiting for encoder render targets...");
                return;
            }
            print("Got render targets from encoder:");
            print(`  - gamutPosTexture: ${this.gamutTexSize}x${this.gamutTexSize} (${this.gamutTexSize * this.gamutTexSize} pixels)`);
            print(`  - gamutColorTexture: ${this.gamutTexSize}x${this.gamutTexSize}`);
            print(`  - Valid gamut entries: ${this.gamutValidCount}`);
            // ============ COLLECT INPUT COLORS ============
            this.inputColors = [
                this.input0,
                this.input1,
                this.input2,
                this.input3,
                this.input4,
                this.input5
            ];
            print(`Input colors (set2): ${this.inputColors.length} colors`);
            print(`Input texture size: ${this.inputTexWidth}x${this.inputTexHeight} = ${this.inputTexWidth * this.inputTexHeight} pixel capacity`);
            // ============ CREATE INPUT TEXTURE (SET2 IN LAB) ============
            this.inputPosTexture = ProceduralTextureProvider.createWithFormat(this.inputTexWidth, this.inputTexHeight, TextureFormat.RGBA8Unorm);
            this.updateInputTexture();
            // ============ CREATE OUTPUT RENDER TARGETS (SET3) ============
            const outputRes = new vec2(this.inputTexWidth, this.inputTexHeight);
            this.projectedPosRT = this.createRenderTarget(outputRes);
            this.projectedColorRT = this.createRenderTarget(outputRes);
            print(`Output textures (set3): ${this.inputTexWidth}x${this.inputTexHeight}`);
            // ============ SETUP PROJECTION MATERIAL ============
            const material = this.projectionMaterial.clone();
            // Gamut textures (set1)
            material.mainPass.gamutPosTex = this.gamutPosTexture;
            material.mainPass.gamutColorTex = this.gamutColorTexture;
            material.mainPass.gamutTexSize = this.gamutTexSize;
            material.mainPass.gamutValidCount = this.gamutValidCount;
            // Input texture (set2)
            material.mainPass.inputPosTex = this.inputPosTexture;
            material.mainPass.inputTexWidth = this.inputTexWidth;
            material.mainPass.inputTexHeight = this.inputTexHeight;
            // ============ CREATE RENDER PIPELINE ============
            const layer = LayerSet.makeUnique();
            const cameraObj = this.createProjectionCamera(layer);
            this.createPostEffect(cameraObj, material, layer);
            this.isInitialized = true;
            print("GamutProjector initialized successfully");
            // ============ SETUP UPDATE LOOP ============
            this.createEvent("UpdateEvent").bind(() => {
                if (!this.isInitialized)
                    return;
                // Update input colors for live tweaking
                this.inputColors = [
                    this.input0, this.input1, this.input2,
                    this.input3, this.input4, this.input5
                ];
                this.updateInputTexture();
            });
            // ============ DEBUG OUTPUT ============
            let debugFrameCount = 0;
            this.createEvent("UpdateEvent").bind(() => {
                debugFrameCount++;
                if (debugFrameCount === 15) { // Wait a bit longer for projection to complete
                    this.debugProjectionResults();
                }
            });
        }
        updateInputTexture() {
            const width = this.inputTexWidth;
            const height = this.inputTexHeight;
            const totalPixels = width * height;
            const pixels = new Uint8Array(totalPixels * 4);
            // Fill input colors
            for (let i = 0; i < this.inputColors.length; i++) {
                const rgb = this.inputColors[i];
                const lab = this.rgb2lab(rgb);
                // Normalize LAB to 0-255
                // Format: R=normA, G=normL, B=normB (matches encoder output)
                const normL = lab.x / 100.0; // L: 0-100 → 0-1
                const normA = (lab.y + 128.0) / 255.0; // a: -128 to 127 → 0-1
                const normB = (lab.z + 128.0) / 255.0; // b: -128 to 127 → 0-1
                const idx = i * 4;
                pixels[idx + 0] = Math.round(Math.max(0, Math.min(1, normA)) * 255);
                pixels[idx + 1] = Math.round(Math.max(0, Math.min(1, normL)) * 255);
                pixels[idx + 2] = Math.round(Math.max(0, Math.min(1, normB)) * 255);
                pixels[idx + 3] = 255; // Alpha = 255 means valid
            }
            // Mark remaining pixels as invalid (alpha = 0)
            for (let i = this.inputColors.length; i < totalPixels; i++) {
                const idx = i * 4;
                pixels[idx + 0] = 0;
                pixels[idx + 1] = 0;
                pixels[idx + 2] = 0;
                pixels[idx + 3] = 0; // Alpha = 0 means invalid/empty
            }
            this.inputPosTexture.control.setPixels(0, 0, width, height, pixels);
        }
        rgb2lab(rgb) {
            // sRGB to linear
            let r = rgb.x > 0.04045 ? Math.pow((rgb.x + 0.055) / 1.055, 2.4) : rgb.x / 12.92;
            let g = rgb.y > 0.04045 ? Math.pow((rgb.y + 0.055) / 1.055, 2.4) : rgb.y / 12.92;
            let b = rgb.z > 0.04045 ? Math.pow((rgb.z + 0.055) / 1.055, 2.4) : rgb.z / 12.92;
            // Linear RGB to XYZ (D65)
            let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
            let y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
            let z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;
            // Normalize for D65 white point
            x /= 0.95047;
            z /= 1.08883;
            // XYZ to LAB
            const delta = 6.0 / 29.0;
            const delta3 = delta * delta * delta;
            const fx = x > delta3 ? Math.pow(x, 1 / 3) : x / (3 * delta * delta) + 4 / 29;
            const fy = y > delta3 ? Math.pow(y, 1 / 3) : y / (3 * delta * delta) + 4 / 29;
            const fz = z > delta3 ? Math.pow(z, 1 / 3) : z / (3 * delta * delta) + 4 / 29;
            const L = 116 * fy - 16;
            const a = 500 * (fx - fy);
            const bVal = 200 * (fy - fz);
            return new vec3(L, a, bVal);
        }
        createRenderTarget(resolution) {
            const rt = global.scene.createRenderTargetTexture();
            rt.control.useScreenResolution = false;
            rt.control.resolution = resolution;
            rt.control.clearColorEnabled = true;
            return rt;
        }
        createProjectionCamera(layer) {
            const obj = global.scene.createSceneObject("GamutProjectorCamera");
            const cam = obj.createComponent("Component.Camera");
            cam.enabled = true;
            cam.type = Camera.Type.Orthographic;
            cam.size = 2.0;
            cam.aspect = this.inputTexWidth / this.inputTexHeight;
            cam.near = 0.5;
            cam.far = 100.0;
            cam.renderLayer = layer;
            cam.renderOrder = -50; // After encoder (-100), before main render
            cam.devicePropertyUsage = Camera.DeviceProperty.None;
            cam.renderTarget = this.projectedPosRT;
            // MRT: 2 output targets
            const colorRenderTargets = cam.colorRenderTargets;
            // Target 0: Projected LAB positions
            while (colorRenderTargets.length < 1) {
                colorRenderTargets.push(Camera.createColorRenderTarget());
            }
            colorRenderTargets[0].targetTexture = this.projectedPosRT;
            colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
            // Target 1: Projected RGB colors
            while (colorRenderTargets.length < 2) {
                colorRenderTargets.push(Camera.createColorRenderTarget());
            }
            colorRenderTargets[1].targetTexture = this.projectedColorRT;
            colorRenderTargets[1].clearColor = new vec4(0, 0, 0, 0);
            cam.colorRenderTargets = colorRenderTargets;
            print(`Projection camera: renders to ${this.inputTexWidth}x${this.inputTexHeight} MRT`);
            return obj;
        }
        createPostEffect(cameraObj, material, layer) {
            const obj = global.scene.createSceneObject("GamutProjectorQuad");
            obj.setParent(cameraObj);
            obj.layer = layer;
            const pe = obj.createComponent("Component.PostEffectVisual");
            pe.mainMaterial = material;
            print("Projection PostEffectVisual created");
        }
        debugProjectionResults() {
            print("=== PROJECTION RESULTS ===");
            print(`Texture sizes:`);
            print(`  Gamut (set1): ${this.gamutTexSize}x${this.gamutTexSize} = ${this.gamutTexSize * this.gamutTexSize} pixels, ${this.gamutValidCount} valid`);
            print(`  Input (set2): ${this.inputTexWidth}x${this.inputTexHeight} = ${this.inputTexWidth * this.inputTexHeight} pixels, ${this.inputColors.length} used`);
            print(`  Output (set3): ${this.inputTexWidth}x${this.inputTexHeight} = ${this.inputTexWidth * this.inputTexHeight} pixels`);
            try {
                // Read projected RGB colors
                const tempColor = ProceduralTextureProvider.createFromTexture(this.projectedColorRT);
                const colorProvider = tempColor.control;
                const width = this.inputTexWidth;
                const height = this.inputTexHeight;
                const colorPixels = new Uint8Array(width * height * 4);
                colorProvider.getPixels(0, 0, width, height, colorPixels);
                // Read projected LAB positions
                const tempPos = ProceduralTextureProvider.createFromTexture(this.projectedPosRT);
                const posProvider = tempPos.control;
                const posPixels = new Uint8Array(width * height * 4);
                posProvider.getPixels(0, 0, width, height, posPixels);
                print("");
                print("Color projections:");
                for (let i = 0; i < this.inputColors.length; i++) {
                    const idx = i * 4;
                    const inputRGB = this.inputColors[i];
                    const inputLAB = this.rgb2lab(inputRGB);
                    // Output RGB
                    const projR = colorPixels[idx] / 255;
                    const projG = colorPixels[idx + 1] / 255;
                    const projB = colorPixels[idx + 2] / 255;
                    const projAlpha = colorPixels[idx + 3];
                    // Output LAB (denormalize)
                    const projL = (posPixels[idx + 1] / 255) * 100;
                    const projA = (posPixels[idx] / 255) * 255 - 128;
                    const projBVal = (posPixels[idx + 2] / 255) * 255 - 128;
                    // Calculate ΔE
                    const dL = inputLAB.x - projL;
                    const da = inputLAB.y - projA;
                    const db = inputLAB.z - projBVal;
                    const deltaE = Math.sqrt(dL * dL + da * da + db * db);
                    print(`  [${i}] Input: RGB(${inputRGB.x.toFixed(2)}, ${inputRGB.y.toFixed(2)}, ${inputRGB.z.toFixed(2)}) LAB(${inputLAB.x.toFixed(1)}, ${inputLAB.y.toFixed(1)}, ${inputLAB.z.toFixed(1)})`);
                    print(`       → Proj: RGB(${projR.toFixed(2)}, ${projG.toFixed(2)}, ${projB.toFixed(2)}) LAB(${projL.toFixed(1)}, ${projA.toFixed(1)}, ${projBVal.toFixed(1)}) ΔE=${deltaE.toFixed(2)} α=${projAlpha}`);
                }
            }
            catch (e) {
                print("Debug error: " + e);
            }
        }
        // ============ PUBLIC GETTERS ============
        getProjectedPosTexture() {
            return this.projectedPosRT;
        }
        getProjectedColorTexture() {
            return this.projectedColorRT;
        }
        getInputCount() {
            return this.inputColors.length;
        }
    };
    __setFunctionName(_classThis, "Test_GamutProjector");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Test_GamutProjector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Test_GamutProjector = _classThis;
})();
exports.Test_GamutProjector = Test_GamutProjector;
//# sourceMappingURL=Test_GamutProjector.js.map