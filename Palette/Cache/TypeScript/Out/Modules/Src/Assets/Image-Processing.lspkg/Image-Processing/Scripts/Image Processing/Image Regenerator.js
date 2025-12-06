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
exports.ImageRegenerator = void 0;
var __selfType = requireType("./Image Regenerator");
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
let ImageRegenerator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ImageRegenerator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.remapMaterial = this.remapMaterial;
            this.inputTexture = this.inputTexture;
            this.enableDither = this.enableDither;
            this.ditherStrength = this.ditherStrength;
            this.debugMode = this.debugMode;
            this.originalPalette = [];
            this.projectedPalette = [];
            this.isInitialized = false;
        }
        __initialize() {
            super.__initialize();
            this.remapMaterial = this.remapMaterial;
            this.inputTexture = this.inputTexture;
            this.enableDither = this.enableDither;
            this.ditherStrength = this.ditherStrength;
            this.debugMode = this.debugMode;
            this.originalPalette = [];
            this.projectedPalette = [];
            this.isInitialized = false;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
        }
        initialize() {
            if (!this.remapMaterial) {
                print("ImageRegenerator ERROR: No remapMaterial assigned");
                return;
            }
            this.paletteTexture = ProceduralTextureProvider.createWithFormat(8, 8, TextureFormat.RGBA8Unorm);
            this.paletteProvider = this.paletteTexture.control;
            this.material = this.remapMaterial.clone();
            this.isInitialized = true;
            if (this.debugMode) {
                print("ImageRegenerator: Initialized");
            }
        }
        setPalette(original, projected) {
            if (!this.isInitialized) {
                print("ImageRegenerator: Not initialized");
                return;
            }
            this.originalPalette = original;
            this.projectedPalette = projected;
            const paletteSize = Math.min(original.length, 32);
            const pixels = new Uint8Array(8 * 8 * 4);
            for (let i = 0; i < paletteSize; i++) {
                const idx = i * 4;
                pixels[idx] = Math.round(original[i].x * 255);
                pixels[idx + 1] = Math.round(original[i].y * 255);
                pixels[idx + 2] = Math.round(original[i].z * 255);
                pixels[idx + 3] = 255;
            }
            for (let i = 0; i < paletteSize; i++) {
                const idx = (32 + i) * 4;
                const p = projected[i] || original[i];
                pixels[idx] = Math.round(p.x * 255);
                pixels[idx + 1] = Math.round(p.y * 255);
                pixels[idx + 2] = Math.round(p.z * 255);
                pixels[idx + 3] = 255;
            }
            this.paletteProvider.setPixels(0, 0, 8, 8, pixels);
            const pass = this.material.mainPass;
            pass.paletteTex = this.paletteTexture;
            pass.paletteSize = paletteSize;
            pass.ditherStrength = this.ditherStrength;
            pass.enableDither = this.enableDither ? 1.0 : 0.0;
            if (this.debugMode) {
                print("ImageRegenerator: Palette set (" + paletteSize + " colors)");
            }
        }
        getMaterial() {
            if (!this.isInitialized) {
                return null;
            }
            if (this.inputTexture) {
                this.material.mainPass.inputTex = this.inputTexture;
            }
            return this.material;
        }
        setInputTexture(tex) {
            this.inputTexture = tex;
            if (this.material) {
                this.material.mainPass.inputTex = tex;
            }
        }
        applyToMesh(meshVisual) {
            if (!this.isInitialized) {
                return;
            }
            if (this.inputTexture) {
                this.material.mainPass.inputTex = this.inputTexture;
            }
            meshVisual.mainMaterial = this.material;
            if (this.debugMode) {
                print("ImageRegenerator: Applied to mesh");
            }
        }
        isReady() {
            return this.isInitialized;
        }
        getPaletteSize() {
            return this.projectedPalette.length;
        }
    };
    __setFunctionName(_classThis, "ImageRegenerator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ImageRegenerator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ImageRegenerator = _classThis;
})();
exports.ImageRegenerator = ImageRegenerator;
//# sourceMappingURL=Image%20Regenerator.js.map