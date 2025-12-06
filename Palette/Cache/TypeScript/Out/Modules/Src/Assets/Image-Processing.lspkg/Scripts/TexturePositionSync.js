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
exports.TexturePositionSync = void 0;
var __selfType = requireType("./TexturePositionSync");
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
// TexturePositionSync.ts
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
let TexturePositionSync = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var TexturePositionSync = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.objectPrefab = this.objectPrefab;
            this.gamutProjector = this.gamutProjector;
            this.vfxComponent = this.vfxComponent;
            this.texWidth = this.texWidth;
            this.texHeight = this.texHeight;
            this.pos = this.pos;
            this.scale = this.scale;
            this.rot = this.rot;
            this.circleCenter = this.circleCenter;
            this.circleRadius = this.circleRadius;
            this.circleRotationOffset = this.circleRotationOffset;
            this.circlePlane = this.circlePlane;
            this.tweenDuration = this.tweenDuration;
            this.staggerDelay = this.staggerDelay;
            this.continuousUpdate = this.continuousUpdate;
            this.debugMode = this.debugMode;
            this.particleStates = [];
            this.initialized = false;
            this.vfxTransform = null;
            this._isAtTarget = false;
            this.posTextureProvider = null;
            this.colorTextureProvider = null;
            this.frameCount = 0;
        }
        __initialize() {
            super.__initialize();
            this.objectPrefab = this.objectPrefab;
            this.gamutProjector = this.gamutProjector;
            this.vfxComponent = this.vfxComponent;
            this.texWidth = this.texWidth;
            this.texHeight = this.texHeight;
            this.pos = this.pos;
            this.scale = this.scale;
            this.rot = this.rot;
            this.circleCenter = this.circleCenter;
            this.circleRadius = this.circleRadius;
            this.circleRotationOffset = this.circleRotationOffset;
            this.circlePlane = this.circlePlane;
            this.tweenDuration = this.tweenDuration;
            this.staggerDelay = this.staggerDelay;
            this.continuousUpdate = this.continuousUpdate;
            this.debugMode = this.debugMode;
            this.particleStates = [];
            this.initialized = false;
            this.vfxTransform = null;
            this._isAtTarget = false;
            this.posTextureProvider = null;
            this.colorTextureProvider = null;
            this.frameCount = 0;
        }
        onAwake() {
            this.createEvent("UpdateEvent").bind(() => this.onUpdate());
        }
        tryInitialize() {
            if (this.initialized)
                return;
            if (!this.gamutProjector || !this.objectPrefab)
                return;
            const projector = this.gamutProjector;
            const posTex = projector.getProjectedPosTexture?.();
            const colorTex = projector.getProjectedColorTexture?.();
            if (!posTex || !colorTex)
                return;
            try {
                this.posTextureProvider = ProceduralTextureProvider.createFromTexture(posTex).control;
                this.colorTextureProvider = ProceduralTextureProvider.createFromTexture(colorTex).control;
            }
            catch (e) {
                return;
            }
            if (this.vfxComponent) {
                this.vfxTransform = this.vfxComponent.getSceneObject().getTransform();
            }
            this.readTexturesAndSpawn();
            this.initialized = true;
            if (this.debugMode) {
                print(`TexturePositionSync: Ready with ${this.particleStates.length} objects`);
            }
        }
        readTexturesAndSpawn() {
            if (!this.posTextureProvider || !this.colorTextureProvider)
                return;
            const totalPixels = this.texWidth * this.texHeight;
            const posPixels = new Uint8Array(totalPixels * 4);
            this.posTextureProvider.getPixels(0, 0, this.texWidth, this.texHeight, posPixels);
            const colorPixels = new Uint8Array(totalPixels * 4);
            this.colorTextureProvider.getPixels(0, 0, this.texWidth, this.texHeight, colorPixels);
            this.destroySpawnedObjects();
            for (let i = 0; i < totalPixels; i++) {
                const idx = i * 4;
                if (posPixels[idx + 3] < 128)
                    continue;
                const normA = posPixels[idx + 0] / 255;
                const normL = posPixels[idx + 1] / 255;
                const normB = posPixels[idx + 2] / 255;
                const localPos = new vec3(normA - 0.5, normL - 0.5, normB - 0.5);
                const targetPos = this.transformToWorld(localPos);
                const obj = this.objectPrefab.instantiate(this.getSceneObject());
                obj.name = `Particle_${i}`;
                const rmv = obj.getComponent("Component.RenderMeshVisual");
                if (rmv && rmv.mainMaterial) {
                    rmv.mainMaterial = rmv.mainMaterial.clone();
                }
                this.cloneChildMaterials(obj);
                const state = {
                    sceneObject: obj,
                    restPosition: vec3.zero(),
                    targetPosition: targetPos,
                    color: new vec4(colorPixels[idx] / 255, colorPixels[idx + 1] / 255, colorPixels[idx + 2] / 255, 1.0),
                    isAtTarget: false,
                    tweenActive: false
                };
                this.particleStates.push(state);
                this.setObjectColor(obj, state.color);
            }
            // Set rest positions and initial placement
            for (let i = 0; i < this.particleStates.length; i++) {
                const state = this.particleStates[i];
                state.restPosition = this.getCircularPosition(i, this.particleStates.length);
                state.sceneObject.getTransform().setWorldPosition(state.restPosition);
            }
            this._isAtTarget = false;
        }
        transformToWorld(localPos) {
            const sx = localPos.x * this.scale.x;
            const sy = localPos.y * this.scale.y;
            const sz = localPos.z * this.scale.z;
            const toRad = 0.01745329251;
            const rx = this.rot.x * toRad, ry = this.rot.y * toRad, rz = this.rot.z * toRad;
            const cx = Math.cos(rx), snx = Math.sin(rx);
            const cy = Math.cos(ry), sny = Math.sin(ry);
            const cz = Math.cos(rz), snz = Math.sin(rz);
            // Y -> X -> Z rotation
            let x = sx * cy + sz * sny;
            let y = sy;
            let z = -sx * sny + sz * cy;
            let y2 = y * cx - z * snx;
            let z2 = y * snx + z * cx;
            y = y2;
            z = z2;
            let x2 = x * cz - y * snz;
            y2 = x * snz + y * cz;
            x = x2;
            y = y2;
            const local = new vec3(x + this.pos.x, y + this.pos.y, z + this.pos.z);
            return this.vfxTransform ? this.vfxTransform.getWorldTransform().multiplyPoint(local) : local;
        }
        getCircularPosition(index, total) {
            const angle = (index / Math.max(total, 1)) * Math.PI * 2 + (this.circleRotationOffset * Math.PI / 180);
            let x = 0, y = 0, z = 0;
            if (this.circlePlane === 0) {
                x = Math.cos(angle) * this.circleRadius;
                z = Math.sin(angle) * this.circleRadius;
            }
            else if (this.circlePlane === 1) {
                x = Math.cos(angle) * this.circleRadius;
                y = Math.sin(angle) * this.circleRadius;
            }
            else {
                y = Math.sin(angle) * this.circleRadius;
                z = Math.cos(angle) * this.circleRadius;
            }
            return new vec3(this.circleCenter.x + x, this.circleCenter.y + y, this.circleCenter.z + z);
        }
        cloneChildMaterials(parent) {
            for (let i = 0; i < parent.getChildrenCount(); i++) {
                const child = parent.getChild(i);
                const rmv = child.getComponent("Component.RenderMeshVisual");
                if (rmv && rmv.mainMaterial)
                    rmv.mainMaterial = rmv.mainMaterial.clone();
                this.cloneChildMaterials(child);
            }
        }
        destroySpawnedObjects() {
            for (const state of this.particleStates) {
                if (state.sceneObject)
                    state.sceneObject.destroy();
            }
            this.particleStates = [];
        }
        onUpdate() {
            this.frameCount++;
            if (!this.initialized && this.frameCount >= 5) {
                this.tryInitialize();
                return;
            }
            if (!this.initialized)
                return;
            if (this.continuousUpdate) {
                this.syncFromVFX();
                this.updatePositions();
                for (const state of this.particleStates) {
                    if (!state.tweenActive) {
                        const pos = state.isAtTarget ? state.targetPosition : state.restPosition;
                        state.sceneObject.getTransform().setWorldPosition(pos);
                    }
                }
            }
        }
        syncFromVFX() {
            if (!this.vfxComponent?.asset)
                return;
            try {
                const props = this.vfxComponent.asset.properties;
                if (props.pos)
                    this.pos = props.pos;
                if (props.scale)
                    this.scale = props.scale;
                if (props.rot)
                    this.rot = props.rot;
            }
            catch (e) { }
        }
        updatePositions() {
            if (!this.posTextureProvider)
                return;
            const totalPixels = this.texWidth * this.texHeight;
            const posPixels = new Uint8Array(totalPixels * 4);
            this.posTextureProvider.getPixels(0, 0, this.texWidth, this.texHeight, posPixels);
            let validIndex = 0;
            for (let i = 0; i < totalPixels && validIndex < this.particleStates.length; i++) {
                const idx = i * 4;
                if (posPixels[idx + 3] < 128)
                    continue;
                const state = this.particleStates[validIndex];
                const localPos = new vec3(posPixels[idx] / 255 - 0.5, posPixels[idx + 1] / 255 - 0.5, posPixels[idx + 2] / 255 - 0.5);
                state.targetPosition = this.transformToWorld(localPos);
                state.restPosition = this.getCircularPosition(validIndex, this.particleStates.length);
                validIndex++;
            }
        }
        setObjectColor(obj, color) {
            const rmv = obj.getComponent("Component.RenderMeshVisual");
            if (rmv?.mainMaterial?.mainPass) {
                try {
                    rmv.mainMaterial.mainPass.baseColor = color;
                }
                catch {
                    try {
                        rmv.mainMaterial.mainPass.mainColor = color;
                    }
                    catch { }
                }
            }
            for (let i = 0; i < obj.getChildrenCount(); i++)
                this.setObjectColor(obj.getChild(i), color);
        }
        // ============ PUBLIC API ============
        toggle() {
            if (!this.initialized)
                return;
            this._isAtTarget ? this.tweenToCircle() : this.tweenToParticles();
        }
        tweenToParticles() {
            if (!this.initialized || this._isAtTarget)
                return;
            this._isAtTarget = true;
            this.tweenAll(true);
        }
        tweenToCircle() {
            if (!this.initialized || !this._isAtTarget)
                return;
            this._isAtTarget = false;
            this.tweenAll(false);
        }
        tweenAll(toTarget) {
            for (let i = 0; i < this.particleStates.length; i++) {
                const index = i;
                const delayEvent = this.createEvent("DelayedCallbackEvent");
                delayEvent.bind(() => this.tweenOne(index, toTarget));
                delayEvent.reset((i * this.staggerDelay) / 1000);
            }
        }
        tweenOne(index, toTarget) {
            const state = this.particleStates[index];
            if (!state || state.tweenActive)
                return;
            const transform = state.sceneObject.getTransform();
            const endPos = toTarget ? state.targetPosition : state.restPosition;
            state.tweenActive = true;
            LSTween_1.LSTween.moveFromToWorld(transform, transform.getWorldPosition(), endPos, this.tweenDuration)
                .easing(Easing_1.default.Cubic.InOut)
                .onComplete(() => {
                state.isAtTarget = toTarget;
                state.tweenActive = false;
            })
                .start();
        }
        isAtParticlePositions() { return this._isAtTarget; }
        isAnyTweening() { return this.particleStates.some(s => s.tweenActive); }
        getObjectCount() { return this.particleStates.length; }
        onDestroy() { this.destroySpawnedObjects(); }
    };
    __setFunctionName(_classThis, "TexturePositionSync");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TexturePositionSync = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TexturePositionSync = _classThis;
})();
exports.TexturePositionSync = TexturePositionSync;
//# sourceMappingURL=TexturePositionSync.js.map