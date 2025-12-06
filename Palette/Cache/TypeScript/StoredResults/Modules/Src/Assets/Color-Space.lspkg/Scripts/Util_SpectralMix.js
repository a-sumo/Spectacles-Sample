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
exports.Util_SpectralMix = void 0;
var __selfType = requireType("./Util_SpectralMix");
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
// Util_SpectralMix.ts
// Utility for testing spectral/Kubelka-Munk color mixing
let Util_SpectralMix = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Util_SpectralMix = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.material = this.material;
            this.pig0Color = this.pig0Color;
            this.pig0Conc = this.pig0Conc;
            this.pig1Color = this.pig1Color;
            this.pig1Conc = this.pig1Conc;
            this.pig2Color = this.pig2Color;
            this.pig2Conc = this.pig2Conc;
            this.pig3Color = this.pig3Color;
            this.pig3Conc = this.pig3Conc;
            this.pig4Color = this.pig4Color;
            this.pig4Conc = this.pig4Conc;
            this.pig5Color = this.pig5Color;
            this.pig5Conc = this.pig5Conc;
        }
        __initialize() {
            super.__initialize();
            this.material = this.material;
            this.pig0Color = this.pig0Color;
            this.pig0Conc = this.pig0Conc;
            this.pig1Color = this.pig1Color;
            this.pig1Conc = this.pig1Conc;
            this.pig2Color = this.pig2Color;
            this.pig2Conc = this.pig2Conc;
            this.pig3Color = this.pig3Color;
            this.pig3Conc = this.pig3Conc;
            this.pig4Color = this.pig4Color;
            this.pig4Conc = this.pig4Conc;
            this.pig5Color = this.pig5Color;
            this.pig5Conc = this.pig5Conc;
        }
        onAwake() {
            if (!this.material) {
                print("Util_SpectralMix: No material assigned!");
                return;
            }
            this.mainPass = this.material.mainPass;
            // Create procedural texture (6x1, RGBA)
            this.proceduralTexture = ProceduralTextureProvider.createWithFormat(Util_SpectralMix.NUM_PIGMENTS, 1, TextureFormat.RGBA8Unorm);
            // Assign to material
            this.mainPass.pigmentTex = this.proceduralTexture;
            this.mainPass.numPigments = Util_SpectralMix.NUM_PIGMENTS;
            this.mainPass.texWidth = Util_SpectralMix.NUM_PIGMENTS;
            this.rebuildPixels();
            this.createEvent("UpdateEvent").bind(() => this.rebuildPixels());
            print("Util_SpectralMix initialized");
        }
        rebuildPixels() {
            const pixels = new Uint8Array(Util_SpectralMix.NUM_PIGMENTS * 4);
            const pigments = [
                { color: this.pig0Color, conc: this.pig0Conc },
                { color: this.pig1Color, conc: this.pig1Conc },
                { color: this.pig2Color, conc: this.pig2Conc },
                { color: this.pig3Color, conc: this.pig3Conc },
                { color: this.pig4Color, conc: this.pig4Conc },
                { color: this.pig5Color, conc: this.pig5Conc },
            ];
            for (let i = 0; i < Util_SpectralMix.NUM_PIGMENTS; i++) {
                const idx = i * 4;
                pixels[idx + 0] = Math.round(pigments[i].color.x * 255);
                pixels[idx + 1] = Math.round(pigments[i].color.y * 255);
                pixels[idx + 2] = Math.round(pigments[i].color.z * 255);
                pixels[idx + 3] = Math.round(pigments[i].conc * 255);
            }
            this.proceduralTexture.control.setPixels(0, 0, Util_SpectralMix.NUM_PIGMENTS, 1, pixels);
        }
    };
    __setFunctionName(_classThis, "Util_SpectralMix");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Util_SpectralMix = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.NUM_PIGMENTS = 6;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Util_SpectralMix = _classThis;
})();
exports.Util_SpectralMix = Util_SpectralMix;
//# sourceMappingURL=Util_SpectralMix.js.map