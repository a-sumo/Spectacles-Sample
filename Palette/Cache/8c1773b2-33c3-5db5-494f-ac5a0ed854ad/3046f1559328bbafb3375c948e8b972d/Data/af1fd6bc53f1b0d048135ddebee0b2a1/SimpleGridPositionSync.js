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
exports.SimpleGridPositionSync = void 0;
var __selfType = requireType("./SimpleGridPositionSync");
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
// SimpleGridPositionSync.ts
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
let SimpleGridPositionSync = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SimpleGridPositionSync = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.objectPrefab = this.objectPrefab;
            this.gridWidth = this.gridWidth;
            this.gridHeight = this.gridHeight;
            this.pos = this.pos;
            this.scale = this.scale;
            this.rot = this.rot;
            this.vfxComponent = this.vfxComponent;
            // ============ CIRCULAR REST CONFIGURATION ============
            this.circleCenter = this.circleCenter;
            this.circleRadius = this.circleRadius;
            this.circleRotationOffset = this.circleRotationOffset;
            this.circlePlane = this.circlePlane;
            // ============ TOGGLE CONTROL ============
            this.atParticlePositions = this.atParticlePositions;
            // ============ TWEEN SETTINGS ============
            this.tweenDuration = this.tweenDuration;
            this.staggerDelay = this.staggerDelay;
            // ============ UPDATE SETTINGS ============
            this.continuousUpdate = this.continuousUpdate;
            this.debugMode = this.debugMode;
            this.objectStates = [];
            this.initialized = false;
            this.vfxTransform = null;
            this.lastAtParticlePositions = false;
        }
        __initialize() {
            super.__initialize();
            this.objectPrefab = this.objectPrefab;
            this.gridWidth = this.gridWidth;
            this.gridHeight = this.gridHeight;
            this.pos = this.pos;
            this.scale = this.scale;
            this.rot = this.rot;
            this.vfxComponent = this.vfxComponent;
            // ============ CIRCULAR REST CONFIGURATION ============
            this.circleCenter = this.circleCenter;
            this.circleRadius = this.circleRadius;
            this.circleRotationOffset = this.circleRotationOffset;
            this.circlePlane = this.circlePlane;
            // ============ TOGGLE CONTROL ============
            this.atParticlePositions = this.atParticlePositions;
            // ============ TWEEN SETTINGS ============
            this.tweenDuration = this.tweenDuration;
            this.staggerDelay = this.staggerDelay;
            // ============ UPDATE SETTINGS ============
            this.continuousUpdate = this.continuousUpdate;
            this.debugMode = this.debugMode;
            this.objectStates = [];
            this.initialized = false;
            this.vfxTransform = null;
            this.lastAtParticlePositions = false;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
            this.createEvent("UpdateEvent").bind(() => this.onUpdate());
        }
        initialize() {
            if (!this.objectPrefab) {
                print("SimpleGridPositionSync ERROR: No objectPrefab assigned!");
                return;
            }
            if (!this.vfxComponent) {
                print("SimpleGridPositionSync ERROR: No vfxComponent assigned!");
                return;
            }
            this.vfxTransform = this.vfxComponent.getSceneObject().getTransform();
            this.syncFromVFX();
            this.spawnObjects();
            this.updateAllPositions();
            // Set initial positions
            this.lastAtParticlePositions = this.atParticlePositions;
            for (const state of this.objectStates) {
                const startPos = this.atParticlePositions ? state.targetPosition : state.restPosition;
                state.sceneObject.getTransform().setWorldPosition(startPos);
                state.isAtTarget = this.atParticlePositions;
            }
            this.initialized = true;
            if (this.debugMode) {
                this.logConfiguration();
            }
        }
        spawnObjects() {
            this.destroySpawnedObjects();
            const totalCount = this.gridWidth * this.gridHeight;
            for (let i = 0; i < totalCount; i++) {
                const obj = this.objectPrefab.instantiate(this.getSceneObject());
                obj.name = `GridObject_${i}`;
                const rmv = obj.getComponent("Component.RenderMeshVisual");
                if (rmv && rmv.mainMaterial) {
                    rmv.mainMaterial = rmv.mainMaterial.clone();
                }
                this.cloneChildMaterials(obj);
                const state = {
                    sceneObject: obj,
                    restPosition: vec3.zero(),
                    targetPosition: vec3.zero(),
                    isAtTarget: false,
                    tweenActive: false
                };
                this.objectStates.push(state);
                this.applyColor(obj, i);
            }
            if (this.debugMode) {
                print(`SimpleGridPositionSync: Spawned ${totalCount} objects`);
            }
        }
        cloneChildMaterials(parent) {
            for (let i = 0; i < parent.getChildrenCount(); i++) {
                const child = parent.getChild(i);
                const rmv = child.getComponent("Component.RenderMeshVisual");
                if (rmv && rmv.mainMaterial) {
                    rmv.mainMaterial = rmv.mainMaterial.clone();
                }
                this.cloneChildMaterials(child);
            }
        }
        destroySpawnedObjects() {
            for (const state of this.objectStates) {
                if (state.sceneObject) {
                    state.sceneObject.destroy();
                }
            }
            this.objectStates = [];
        }
        onUpdate() {
            if (!this.initialized)
                return;
            // Check if toggle changed
            if (this.atParticlePositions !== this.lastAtParticlePositions) {
                this.lastAtParticlePositions = this.atParticlePositions;
                this.tweenAll();
            }
            // Update positions
            if (this.continuousUpdate) {
                this.syncFromVFX();
                this.updateAllPositions();
                // Keep objects at their current target if not tweening
                for (const state of this.objectStates) {
                    if (!state.tweenActive) {
                        const pos = state.isAtTarget ? state.targetPosition : state.restPosition;
                        state.sceneObject.getTransform().setWorldPosition(pos);
                    }
                }
            }
        }
        syncFromVFX() {
            if (!this.vfxComponent || !this.vfxComponent.asset)
                return;
            try {
                const props = this.vfxComponent.asset.properties;
                if (props.gridWidth !== undefined)
                    this.gridWidth = props.gridWidth;
                if (props.gridHeight !== undefined)
                    this.gridHeight = props.gridHeight;
                if (props.pos !== undefined)
                    this.pos = props.pos;
                if (props.scale !== undefined)
                    this.scale = props.scale;
                if (props.rot !== undefined)
                    this.rot = props.rot;
            }
            catch (e) {
                // Properties not available
            }
        }
        updateAllPositions() {
            const count = this.objectStates.length;
            for (let i = 0; i < count; i++) {
                const state = this.objectStates[i];
                // Target = VFX particle position
                state.targetPosition = this.getParticleWorldPosition(i);
                // Rest = circular layout
                state.restPosition = this.getCircularPosition(i, count);
            }
        }
        /**
         * Calculate circular rest position for object
         */
        getCircularPosition(index, total) {
            const angle = (index / total) * Math.PI * 2 + (this.circleRotationOffset * Math.PI / 180);
            let x = 0;
            let y = 0;
            let z = 0;
            switch (this.circlePlane) {
                case 0: // XZ plane (horizontal circle)
                    x = Math.cos(angle) * this.circleRadius;
                    y = 0;
                    z = Math.sin(angle) * this.circleRadius;
                    break;
                case 1: // XY plane (vertical circle facing Z)
                    x = Math.cos(angle) * this.circleRadius;
                    y = Math.sin(angle) * this.circleRadius;
                    z = 0;
                    break;
                case 2: // YZ plane (vertical circle facing X)
                    x = 0;
                    y = Math.sin(angle) * this.circleRadius;
                    z = Math.cos(angle) * this.circleRadius;
                    break;
            }
            return new vec3(this.circleCenter.x + x, this.circleCenter.y + y, this.circleCenter.z + z);
        }
        /**
         * Get LOCAL position for particle (shader output)
         */
        getParticleLocalPosition(particleIndex) {
            const gw = Math.max(this.gridWidth, 1);
            const gh = Math.max(this.gridHeight, 1);
            const col = particleIndex % gw;
            const row = Math.floor(particleIndex / gw);
            const halfWidth = (gw - 1) * 0.5;
            const halfHeight = (gh - 1) * 0.5;
            const localX = (col - halfWidth) / Math.max(gw - 1, 1);
            const localY = 0;
            const localZ = (row - halfHeight) / Math.max(gh - 1, 1);
            const scaledX = localX * this.scale.x;
            const scaledY = localY * this.scale.y;
            const scaledZ = localZ * this.scale.z;
            const toRad = 0.01745329251;
            const rx = this.rot.x * toRad;
            const ry = this.rot.y * toRad;
            const rz = this.rot.z * toRad;
            const cx = Math.cos(rx);
            const sx = Math.sin(rx);
            const cy = Math.cos(ry);
            const sy = Math.sin(ry);
            const cz = Math.cos(rz);
            const sz = Math.sin(rz);
            // Y rotation
            const ryX = scaledX * cy + scaledZ * sy;
            const ryY = scaledY;
            const ryZ = -scaledX * sy + scaledZ * cy;
            // X rotation
            const rxX = ryX;
            const rxY = ryY * cx - ryZ * sx;
            const rxZ = ryY * sx + ryZ * cx;
            // Z rotation
            const rotatedX = rxX * cz - rxY * sz;
            const rotatedY = rxX * sz + rxY * cz;
            const rotatedZ = rxZ;
            return new vec3(rotatedX + this.pos.x, rotatedY + this.pos.y, rotatedZ + this.pos.z);
        }
        /**
         * Get WORLD position for particle
         */
        getParticleWorldPosition(particleIndex) {
            const localPos = this.getParticleLocalPosition(particleIndex);
            if (!this.vfxTransform) {
                return localPos;
            }
            return this.vfxTransform.getWorldTransform().multiplyPoint(localPos);
        }
        applyColor(obj, particleIndex) {
            const gw = Math.max(this.gridWidth, 1);
            const gh = Math.max(this.gridHeight, 1);
            const col = particleIndex % gw;
            const row = Math.floor(particleIndex / gw);
            const u = col / Math.max(gw - 1, 1);
            const v = row / Math.max(gh - 1, 1);
            const color = new vec4(u, 0.5, v, 1.0);
            this.setObjectColor(obj, color);
            for (let i = 0; i < obj.getChildrenCount(); i++) {
                this.setObjectColor(obj.getChild(i), color);
            }
        }
        setObjectColor(obj, color) {
            const rmv = obj.getComponent("Component.RenderMeshVisual");
            if (rmv && rmv.mainMaterial && rmv.mainMaterial.mainPass) {
                try {
                    rmv.mainMaterial.mainPass.baseColor = color;
                }
                catch (e) {
                    try {
                        rmv.mainMaterial.mainPass.mainColor = color;
                    }
                    catch (e2) {
                        // Neither property exists
                    }
                }
            }
        }
        // ============ TWEEN CONTROL ============
        /**
         * Tween all objects based on current atParticlePositions state
         */
        tweenAll() {
            const toTarget = this.atParticlePositions;
            if (this.debugMode) {
                print(`SimpleGridPositionSync: Tweening all to ${toTarget ? "PARTICLE" : "CIRCLE"} positions`);
            }
            for (let i = 0; i < this.objectStates.length; i++) {
                const delay = i * this.staggerDelay;
                const delayEvent = this.createEvent("DelayedCallbackEvent");
                delayEvent.bind(() => {
                    this.tweenObject(i, toTarget);
                });
                delayEvent.reset(delay / 1000);
            }
        }
        /**
         * Tween single object
         */
        tweenObject(index, toTarget) {
            if (index < 0 || index >= this.objectStates.length)
                return;
            const state = this.objectStates[index];
            if (state.tweenActive)
                return;
            const transform = state.sceneObject.getTransform();
            const startPos = transform.getWorldPosition();
            const endPos = toTarget ? state.targetPosition : state.restPosition;
            state.tweenActive = true;
            LSTween_1.LSTween.moveFromToWorld(transform, startPos, endPos, this.tweenDuration)
                .easing(Easing_1.default.Cubic.InOut)
                .onComplete(() => {
                state.isAtTarget = toTarget;
                state.tweenActive = false;
            })
                .start();
        }
        // ============ PUBLIC API ============
        /**
         * Set position mode (triggers tween if changed)
         */
        setAtParticlePositions(value) {
            this.atParticlePositions = value;
            // onUpdate will detect the change and tween
        }
        /**
         * Toggle between particle and circle positions
         */
        toggle() {
            this.atParticlePositions = !this.atParticlePositions;
        }
        /**
         * Snap all to current target (no tween)
         */
        snapAll() {
            for (const state of this.objectStates) {
                const pos = this.atParticlePositions ? state.targetPosition : state.restPosition;
                state.sceneObject.getTransform().setWorldPosition(pos);
                state.isAtTarget = this.atParticlePositions;
                state.tweenActive = false;
            }
        }
        /**
         * Get object count
         */
        getObjectCount() {
            return this.objectStates.length;
        }
        /**
         * Get object at index
         */
        getObjectAt(index) {
            if (index < 0 || index >= this.objectStates.length)
                return null;
            return this.objectStates[index].sceneObject;
        }
        /**
         * Check if any object is tweening
         */
        isAnyTweening() {
            return this.objectStates.some(s => s.tweenActive);
        }
        /**
         * Update circle configuration
         */
        setCircleConfig(center, radius, rotationOffset) {
            this.circleCenter = center;
            this.circleRadius = radius;
            if (rotationOffset !== undefined) {
                this.circleRotationOffset = rotationOffset;
            }
            this.updateAllPositions();
        }
        logConfiguration() {
            print("=== SimpleGridPositionSync ===");
            print(`  Grid: ${this.gridWidth} x ${this.gridHeight} = ${this.objectStates.length} objects`);
            print(`  Circle: center=(${this.circleCenter.x}, ${this.circleCenter.y}, ${this.circleCenter.z}), radius=${this.circleRadius}`);
            print(`  Start at: ${this.atParticlePositions ? "PARTICLE" : "CIRCLE"} positions`);
            print(`  Tween: ${this.tweenDuration}ms, stagger=${this.staggerDelay}ms`);
        }
        onDestroy() {
            this.destroySpawnedObjects();
        }
    };
    __setFunctionName(_classThis, "SimpleGridPositionSync");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SimpleGridPositionSync = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SimpleGridPositionSync = _classThis;
})();
exports.SimpleGridPositionSync = SimpleGridPositionSync;
//# sourceMappingURL=SimpleGridPositionSync.js.map