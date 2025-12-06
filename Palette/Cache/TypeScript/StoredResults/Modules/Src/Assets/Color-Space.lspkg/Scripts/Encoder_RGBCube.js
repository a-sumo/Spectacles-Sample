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
exports.Encoder_RGBCube = void 0;
var __selfType = requireType("./Encoder_RGBCube");
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
// Encoder_RGBCube.ts
// Encodes RGB color space as a 3D cube visualization
let Encoder_RGBCube = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Encoder_RGBCube = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.encoderMaterial = this.encoderMaterial;
            this.vfxComponent = this.vfxComponent;
            this.texSize = this.texSize;
            this.rgbRes = this.rgbRes;
            this.scale = this.scale;
        }
        __initialize() {
            super.__initialize();
            this.encoderMaterial = this.encoderMaterial;
            this.vfxComponent = this.vfxComponent;
            this.texSize = this.texSize;
            this.rgbRes = this.rgbRes;
            this.scale = this.scale;
        }
        onAwake() {
            if (!this.encoderMaterial) {
                print("ERROR: encoderMaterial not set");
                return;
            }
            const res = new vec2(this.texSize, this.texSize);
            this.renderTarget = this.createRenderTarget(res);
            // Clone and configure material
            const material = this.encoderMaterial.clone();
            material.mainPass.texSize = this.texSize;
            material.mainPass.rgbRes = this.rgbRes;
            const layer = LayerSet.makeUnique();
            const cameraObj = this.createCamera(this.renderTarget, layer);
            this.createPostEffect(cameraObj, material, layer);
            this.assignToVFX();
            print("RGBCubeEncoder: Setup complete");
            print(`Texture: ${this.texSize}x${this.texSize}`);
            print(`RGB res: ${this.rgbRes}³ = ${this.rgbRes * this.rgbRes * this.rgbRes} points`);
            print(`Spawn count needed: ${this.texSize * this.texSize * 2}`);
            // Debug after a few frames
            let frameCount = 0;
            this.createEvent("UpdateEvent").bind(() => {
                frameCount++;
                if (frameCount === 5) {
                    this.debugReadRenderTarget();
                }
            });
        }
        createRenderTarget(resolution) {
            const rt = global.scene.createRenderTargetTexture();
            rt.control.useScreenResolution = false;
            rt.control.resolution = resolution;
            rt.control.clearColorEnabled = true;
            return rt;
        }
        createCamera(renderTarget, layer) {
            const obj = global.scene.createSceneObject("EncoderCamera");
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
            cam.renderTarget = renderTarget;
            // Must set up colorRenderTargets - this is what makes it work!
            const colorRenderTargets = cam.colorRenderTargets;
            if (colorRenderTargets.length === 0) {
                colorRenderTargets.push(Camera.createColorRenderTarget());
            }
            colorRenderTargets[0].targetTexture = renderTarget;
            colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
            cam.colorRenderTargets = colorRenderTargets;
            print("Camera created with render target");
            return obj;
        }
        createPostEffect(cameraObj, material, layer) {
            const obj = global.scene.createSceneObject("EncoderQuad");
            obj.setParent(cameraObj);
            obj.layer = layer;
            const pe = obj.createComponent("Component.PostEffectVisual");
            pe.mainMaterial = material;
            print("PostEffectVisual created");
        }
        assignToVFX() {
            if (this.vfxComponent && this.vfxComponent.asset) {
                const props = this.vfxComponent.asset.properties;
                // Single texture for both position and color (RGB = XYZ = Color)
                props["posMap"] = this.renderTarget;
                props["texSize"] = this.texSize;
                props["scale"] = this.scale;
                print(`Assigned to VFX: ${this.vfxComponent.getSceneObject().name}`);
            }
            else {
                print("ERROR: VFX component or asset is null");
            }
        }
        debugReadRenderTarget() {
            if (!this.renderTarget) {
                print("DEBUG: No render target");
                return;
            }
            try {
                const tempTexture = ProceduralTextureProvider.createFromTexture(this.renderTarget);
                const provider = tempTexture.control;
                const size = this.texSize;
                const pixelBuffer = new Uint8Array(size * size * 4);
                provider.getPixels(0, 0, size, size, pixelBuffer);
                print("=== RENDER TARGET DEBUG ===");
                const printPixel = (idx, label) => {
                    const x = idx % size;
                    const y = Math.floor(idx / size);
                    const i = idx * 4;
                    print(`${label} [${idx}] (${x},${y}): R=${pixelBuffer[i]}, G=${pixelBuffer[i + 1]}, B=${pixelBuffer[i + 2]}, A=${pixelBuffer[i + 3]}`);
                };
                // Expected for RGB cube with rgbRes=16:
                // Pixel 0: R=0, G=0, B=0 (black corner)
                // Pixel 15: R=0, G=0, B=255 (blue)
                // Pixel 16: R=0, G=17, B=0 (slight green)
                printPixel(0, "Pixel");
                printPixel(1, "Pixel");
                printPixel(15, "Pixel");
                printPixel(16, "Pixel");
                printPixel(255, "Pixel");
                printPixel(4095, "Last valid");
                print("=== END DEBUG ===");
            }
            catch (e) {
                print("DEBUG ERROR: " + e);
            }
        }
    };
    __setFunctionName(_classThis, "Encoder_RGBCube");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Encoder_RGBCube = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Encoder_RGBCube = _classThis;
})();
exports.Encoder_RGBCube = Encoder_RGBCube;
//# sourceMappingURL=Encoder_RGBCube.js.map