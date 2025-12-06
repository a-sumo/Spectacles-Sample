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
exports.Test_MinimalEncoder = void 0;
var __selfType = requireType("./Test_MinimalEncoder");
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
// Test_MinimalEncoder.ts
// Simplest possible encode → render → decode test
let Test_MinimalEncoder = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Test_MinimalEncoder = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.encoderMaterial = this.encoderMaterial;
            this.vfxComponent = this.vfxComponent;
            this.texSize = this.texSize;
            this.scale = this.scale;
        }
        __initialize() {
            super.__initialize();
            this.encoderMaterial = this.encoderMaterial;
            this.vfxComponent = this.vfxComponent;
            this.texSize = this.texSize;
            this.scale = this.scale;
        }
        onAwake() {
            if (!this.encoderMaterial) {
                print("ERROR: encoderMaterial not set");
                return;
            }
            const res = new vec2(this.texSize, this.texSize);
            this.renderTarget = this.createRenderTarget(res);
            print("Created render target: " + this.renderTarget);
            const layer = LayerSet.makeUnique();
            const cameraObj = this.createCamera(this.renderTarget, layer);
            this.createPostEffect(cameraObj, this.encoderMaterial.clone(), layer);
            this.assignToVFX();
            print("MinimalEncoderTest: Setup complete");
            print(`Texture: ${this.texSize}x${this.texSize}`);
            print(`Spawn count needed: ${this.texSize * this.texSize * 2}`);
            // Debug: Read render target after a delay to ensure it's rendered
            this.createEvent("DelayedCallbackEvent").bind(() => {
                this.debugReadRenderTarget();
            });
            // Also read after a few frames
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
            const obj = global.scene.createSceneObject("TestEncoderCamera");
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
            // Set up render target properly
            cam.renderTarget = renderTarget;
            // Also set via colorRenderTargets for MRT compatibility
            const colorRenderTargets = cam.colorRenderTargets;
            if (colorRenderTargets.length === 0) {
                colorRenderTargets.push(Camera.createColorRenderTarget());
            }
            colorRenderTargets[0].targetTexture = renderTarget;
            colorRenderTargets[0].clearColor = new vec4(0, 0, 0, 0);
            cam.colorRenderTargets = colorRenderTargets;
            print("Camera created, renderTarget assigned");
            return obj;
        }
        createPostEffect(cameraObj, material, layer) {
            const obj = global.scene.createSceneObject("TestEncoderQuad");
            obj.setParent(cameraObj);
            obj.layer = layer;
            const pe = obj.createComponent("Component.PostEffectVisual");
            pe.mainMaterial = material;
            print("PostEffectVisual created with material");
        }
        assignToVFX() {
            if (this.vfxComponent && this.vfxComponent.asset) {
                const props = this.vfxComponent.asset.properties;
                print("Assigning render target to VFX...");
                print("Render target: " + this.renderTarget);
                props["testMap"] = this.renderTarget;
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
                print("DEBUG: No render target to read");
                return;
            }
            try {
                // Create procedural texture from render target to read pixels
                const tempTexture = ProceduralTextureProvider.createFromTexture(this.renderTarget);
                const provider = tempTexture.control;
                const size = this.texSize;
                const pixelBuffer = new Uint8Array(size * size * 4);
                provider.getPixels(0, 0, size, size, pixelBuffer);
                // Print first few pixels
                print("=== RENDER TARGET DEBUG ===");
                print(`Size: ${size}x${size}`);
                // Print corners and center
                const printPixel = (x, y, label) => {
                    const idx = (y * size + x) * 4;
                    const r = pixelBuffer[idx];
                    const g = pixelBuffer[idx + 1];
                    const b = pixelBuffer[idx + 2];
                    const a = pixelBuffer[idx + 3];
                    print(`${label} (${x},${y}): R=${r}, G=${g}, B=${b}, A=${a}`);
                };
                printPixel(0, 0, "Bottom-left");
                printPixel(size - 1, 0, "Bottom-right");
                printPixel(0, size - 1, "Top-left");
                printPixel(size - 1, size - 1, "Top-right");
                printPixel(Math.floor(size / 2), Math.floor(size / 2), "Center");
                // Check if all black
                let allBlack = true;
                let allSame = true;
                const firstR = pixelBuffer[0];
                const firstG = pixelBuffer[1];
                const firstB = pixelBuffer[2];
                for (let i = 0; i < pixelBuffer.length; i += 4) {
                    if (pixelBuffer[i] !== 0 || pixelBuffer[i + 1] !== 0 || pixelBuffer[i + 2] !== 0) {
                        allBlack = false;
                    }
                    if (pixelBuffer[i] !== firstR || pixelBuffer[i + 1] !== firstG || pixelBuffer[i + 2] !== firstB) {
                        allSame = false;
                    }
                }
                print(`All black: ${allBlack}`);
                print(`All same color: ${allSame}`);
                print("=== END DEBUG ===");
            }
            catch (e) {
                print("DEBUG ERROR: " + e);
            }
        }
    };
    __setFunctionName(_classThis, "Test_MinimalEncoder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Test_MinimalEncoder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Test_MinimalEncoder = _classThis;
})();
exports.Test_MinimalEncoder = Test_MinimalEncoder;
//# sourceMappingURL=Test_MinimalEncoder.js.map