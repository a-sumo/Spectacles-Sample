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
exports.ViewDirectionLocator = void 0;
var __selfType = requireType("./ViewDirectionLocator");
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
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const HandInputData_1 = require("SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandInputData");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const Pose_1 = require("../../Utils/Pose");
const VectorUtils_1 = require("../../Utils/VectorUtils");
let ViewDirectionLocator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ViewDirectionLocator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.autoStop = this.autoStop;
            this.lookDownIndicator = this.lookDownIndicator;
            this.locationDisplayer = this.locationDisplayer;
            this.interactable = this.interactable;
            this.worldMesh = this.worldMesh;
            this.onLocationDeterminedEvent = new Event_1.default();
            this.onLocationDetermined = this.onLocationDeterminedEvent.publicApi();
            this.cameraTransform = WorldCameraFinderProvider_1.default.getInstance().getTransform();
            this.probe = Physics.createGlobalProbe();
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this.leftHand = this.handProvider.getHand("left");
            this.rightHand = this.handProvider.getHand("right");
            this.hitFailureCount = 0;
            this.reportCount = 0;
            this.lastPose = null;
            this.MIN_VERTICAL_DISTANCE = 75;
            this.EPSILON = 0.01;
            this.MAX_RAY_LENGTH = 10000;
        }
        __initialize() {
            super.__initialize();
            this.autoStop = this.autoStop;
            this.lookDownIndicator = this.lookDownIndicator;
            this.locationDisplayer = this.locationDisplayer;
            this.interactable = this.interactable;
            this.worldMesh = this.worldMesh;
            this.onLocationDeterminedEvent = new Event_1.default();
            this.onLocationDetermined = this.onLocationDeterminedEvent.publicApi();
            this.cameraTransform = WorldCameraFinderProvider_1.default.getInstance().getTransform();
            this.probe = Physics.createGlobalProbe();
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this.leftHand = this.handProvider.getHand("left");
            this.rightHand = this.handProvider.getHand("right");
            this.hitFailureCount = 0;
            this.reportCount = 0;
            this.lastPose = null;
            this.MIN_VERTICAL_DISTANCE = 75;
            this.EPSILON = 0.01;
            this.MAX_RAY_LENGTH = 10000;
        }
        onAwake() {
            this.stop();
            this.locationDisplayerTransform = this.locationDisplayer.getTransform();
            this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
        }
        start() {
            this.hitFailureCount = 0;
            this.reportCount = 0;
            this.setDisplayStatus(false);
            this.isActive = true;
            this.interactable.enabled = global.deviceInfoSystem.isEditor();
            if (this.interactable.enabled && !this.isInitializedOnce) {
                this.interactable.onInteractorTriggerStart.add(() => this.reportLocation(true));
            }
            this.isInitializedOnce = true;
        }
        stop() {
            this.isActive = false;
            this.setDisplayStatus(false);
        }
        onUpdate() {
            if (!this.isActive) {
                return;
            }
            const camPos = this.cameraTransform.getWorldPosition();
            const camForward = this.cameraTransform.forward;
            this.probe.rayCastAll(camPos, camPos.sub(camForward.mult(VectorUtils_1.VectorUtils.scalar3(this.MAX_RAY_LENGTH))), (hits) => {
                var hit = this.getFirstValidHit(hits);
                if (hit !== null) {
                    this.onHitTestResult(hit, camForward, camPos);
                }
            });
            if (this.leftHand.isPinching() || this.rightHand.isPinching()) {
                this.reportLocation();
            }
        }
        getFirstValidHit(hits) {
            for (let i = 0; i < hits.length; i++) {
                const hit = hits[i];
                if (hit.collider.getSceneObject() === this.worldMesh.getSceneObject()) {
                    return hit;
                }
            }
            return null;
        }
        onHitTestResult(hit, camforward, cameraPosition) {
            if (hit === null) {
                this.processHitResult(false);
            }
            else {
                if (1 - Math.abs(hit.normal.normalize().dot(vec3.up())) < this.EPSILON &&
                    cameraPosition.y - hit.position.y > this.MIN_VERTICAL_DISTANCE) {
                    this.processHitResult(true);
                    const toRotation = quat.lookAt(new vec3(camforward.x, 0, camforward.z).normalize(), vec3.up());
                    this.locationDisplayerTransform.setWorldPosition(hit.position.add(new vec3(0, 5, 0)));
                    this.locationDisplayerTransform.setWorldRotation(toRotation);
                }
                else {
                    this.processHitResult(false);
                }
            }
        }
        processHitResult(isHit, force = false) {
            if (!this.isActive) {
                return;
            }
            if (isHit) {
                this.hitFailureCount = 0;
            }
            else {
                this.hitFailureCount++;
                if (this.hitFailureCount < 10 && !force) {
                    return;
                }
            }
            this.setDisplayStatus(isHit);
            this.lastPose = isHit ? Pose_1.Pose.fromTransform(this.locationDisplayerTransform) : null;
        }
        reportLocation(force = false) {
            if (this.lastPose !== null) {
                if (this.reportCount++ < 10 && !force) {
                    return;
                }
                if (this.autoStop) {
                    this.stop();
                }
                this.reportCount = 0;
                this.hitFailureCount = 0;
                this.onLocationDeterminedEvent.invoke(this.lastPose);
                this.lastPose = null;
            }
        }
        setDisplayStatus(isHit) {
            this.locationDisplayer.enabled = isHit && this.isActive;
            this.lookDownIndicator.enabled = !isHit && this.isActive;
        }
    };
    __setFunctionName(_classThis, "ViewDirectionLocator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ViewDirectionLocator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ViewDirectionLocator = _classThis;
})();
exports.ViewDirectionLocator = ViewDirectionLocator;
//# sourceMappingURL=ViewDirectionLocator.js.map