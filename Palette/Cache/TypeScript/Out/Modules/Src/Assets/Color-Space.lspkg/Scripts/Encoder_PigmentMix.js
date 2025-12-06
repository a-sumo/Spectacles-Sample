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
exports.Encoder_PigmentMix = void 0;
var __selfType = requireType("./Encoder_PigmentMix");
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
// Encoder_PigmentMix.ts
// Encodes the achievable gamut from mixing physical pigments (Kubelka-Munk)
let Encoder_PigmentMix = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Encoder_PigmentMix = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.encoderMaterial = this.encoderMaterial;
            this.vfxComponent = this.vfxComponent;
            this.texSize = this.texSize;
            this.mixSteps = this.mixSteps;
            this.scale = this.scale;
            // Pigment inputs
            this.pig0Color = this.pig0Color;
            this.pig1Color = this.pig1Color;
            this.pig2Color = this.pig2Color;
            this.pig3Color = this.pig3Color;
            this.pig4Color = this.pig4Color;
            this.pig5Color = this.pig5Color;
            this.initialized = false;
        }
        __initialize() {
            super.__initialize();
            this.encoderMaterial = this.encoderMaterial;
            this.vfxComponent = this.vfxComponent;
            this.texSize = this.texSize;
            this.mixSteps = this.mixSteps;
            this.scale = this.scale;
            // Pigment inputs
            this.pig0Color = this.pig0Color;
            this.pig1Color = this.pig1Color;
            this.pig2Color = this.pig2Color;
            this.pig3Color = this.pig3Color;
            this.pig4Color = this.pig4Color;
            this.pig5Color = this.pig5Color;
            this.initialized = false;
        }
        onAwake() {
            if (!this.encoderMaterial) {
                print("Encoder_PigmentMix: ERROR - encoderMaterial not set");
                return;
            }
            // Create pigment texture
            this.pigmentTexture = ProceduralTextureProvider.createWithFormat(Encoder_PigmentMix.NUM_PIGMENTS, 1, TextureFormat.RGBA8Unorm);
            this.updatePigmentTexture();
            // Create render targets
            const res = new vec2(this.texSize, this.texSize);
            this.posRenderTarget = this.createRenderTarget(res);
            this.colorRenderTarget = this.createRenderTarget(res);
            // Clone and configure material
            const material = this.encoderMaterial.clone();
            material.mainPass.pigmentTex = this.pigmentTexture;
            material.mainPass.numPigments = Encoder_PigmentMix.NUM_PIGMENTS;
            material.mainPass.texWidth = Encoder_PigmentMix.NUM_PIGMENTS;
            material.mainPass.texSize = this.texSize;
            material.mainPass.mixSteps = this.mixSteps;
            // Create camera and post effect
            const layer = LayerSet.makeUnique();
            const cameraObj = this.createCameraMRT(layer);
            this.createPostEffect(cameraObj, material, layer);
            // Assign to VFX
            this.assignToVFX();
            // Update pigments every frame
            this.createEvent("UpdateEvent").bind(() => this.updatePigmentTexture());
            this.initialized = true;
            print("Encoder_PigmentMix: Ready");
        }
        updatePigmentTexture() {
            const pixels = new Uint8Array(Encoder_PigmentMix.NUM_PIGMENTS * 4);
            const pigments = [
                this.pig0Color,
                this.pig1Color,
                this.pig2Color,
                this.pig3Color,
                this.pig4Color,
                this.pig5Color,
            ];
            for (let i = 0; i < Encoder_PigmentMix.NUM_PIGMENTS; i++) {
                const idx = i * 4;
                pixels[idx + 0] = Math.round(pigments[i].x * 255);
                pixels[idx + 1] = Math.round(pigments[i].y * 255);
                pixels[idx + 2] = Math.round(pigments[i].z * 255);
                pixels[idx + 3] = 255;
            }
            this.pigmentTexture.control.setPixels(0, 0, Encoder_PigmentMix.NUM_PIGMENTS, 1, pixels);
        }
        createRenderTarget(resolution) {
            const rt = global.scene.createRenderTargetTexture();
            rt.control.useScreenResolution = false;
            rt.control.resolution = resolution;
            rt.control.clearColorEnabled = true;
            return rt;
        }
        createCameraMRT(layer) {
            const obj = global.scene.createSceneObject("Encoder_PigmentMix_Camera");
            const cam = obj.createComponent("Component.Camera");
            cam.enabled = true;
            cam.type = Camera.Type.Orthographic;
            cam.size = 2.0;
            cam.aspect = 1.0;
            cam.near = 0.5;
            cam.far = 100.0;
            cam.renderLayer = layer;
            cam.renderOrder = -100;
            cam.devicePropertyUsage = Camera.DeviceProperty.None;
            cam.renderTarget = this.posRenderTarget;
            const colorRenderTargets = cam.colorRenderTargets;
            while (colorRenderTargets.length < 2) {
                colorRenderTargets.push(Camera.createColorRenderTarget());
            }
            colorRenderTargets[0].targetTexture = this.posRenderTarget;
            colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
            colorRenderTargets[1].targetTexture = this.colorRenderTarget;
            colorRenderTargets[1].clearColor = new vec4(0, 0, 0, 0);
            cam.colorRenderTargets = colorRenderTargets;
            return obj;
        }
        createPostEffect(cameraObj, material, layer) {
            const obj = global.scene.createSceneObject("Encoder_PigmentMix_Quad");
            obj.setParent(cameraObj);
            obj.layer = layer;
            const pe = obj.createComponent("Component.PostEffectVisual");
            pe.mainMaterial = material;
        }
        assignToVFX() {
            if (this.vfxComponent?.asset) {
                const props = this.vfxComponent.asset.properties;
                props["posMap"] = this.posRenderTarget;
                props["colorMap"] = this.colorRenderTarget;
                props["texSize"] = this.texSize;
                props["scale"] = this.scale;
            }
        }
        // ============ PUBLIC API ============
        isReady() {
            return this.initialized;
        }
        getPosRenderTarget() {
            return this.posRenderTarget;
        }
        getColorRenderTarget() {
            return this.colorRenderTarget;
        }
        getTexSize() {
            return this.texSize;
        }
        getGamutValidCount() {
            const n = Encoder_PigmentMix.NUM_PIGMENTS;
            const steps = this.mixSteps;
            const purePigments = n;
            const twoWayMixes = (n * (n - 1) / 2) * (steps - 1);
            let threeWaySteps = 0;
            for (let s1 = 1; s1 < steps - 1; s1++) {
                for (let s2 = 1; s2 < steps - s1; s2++) {
                    threeWaySteps++;
                }
            }
            const threeWayMixes = (n * (n - 1) * (n - 2) / 6) * threeWaySteps;
            return purePigments + twoWayMixes + threeWayMixes;
        }
    };
    __setFunctionName(_classThis, "Encoder_PigmentMix");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Encoder_PigmentMix = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.NUM_PIGMENTS = 6;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Encoder_PigmentMix = _classThis;
})();
exports.Encoder_PigmentMix = Encoder_PigmentMix;
//# sourceMappingURL=Encoder_PigmentMix.js.map