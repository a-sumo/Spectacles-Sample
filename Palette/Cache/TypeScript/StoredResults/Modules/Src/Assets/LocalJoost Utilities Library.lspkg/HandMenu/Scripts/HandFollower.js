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
exports.HandFollower = void 0;
var __selfType = requireType("./HandFollower");
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
const VectorUtils_1 = require("../../Utils/VectorUtils");
const HandInputData_1 = require("SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandInputData");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
let HandFollower = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var HandFollower = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.handFollowObject = this.handFollowObject;
            this.distanceToHand = this.distanceToHand;
            this.maxHandAngle = this.maxHandAngle;
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this.leftHand = this.handProvider.getHand("left");
            this.rightHand = this.handProvider.getHand("right");
            this.camera = WorldCameraFinderProvider_1.default.getInstance();
            this.noTrackCount = 0;
        }
        __initialize() {
            super.__initialize();
            this.handFollowObject = this.handFollowObject;
            this.distanceToHand = this.distanceToHand;
            this.maxHandAngle = this.maxHandAngle;
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this.leftHand = this.handProvider.getHand("left");
            this.rightHand = this.handProvider.getHand("right");
            this.camera = WorldCameraFinderProvider_1.default.getInstance();
            this.noTrackCount = 0;
        }
        onAwake() {
            this.createEvent("UpdateEvent").bind(() => {
                this.update();
            });
            this.handFollowObject.enabled = false;
            if (global.deviceInfoSystem.isEditor()) {
                const delayedEvent = this.createEvent("DelayedCallbackEvent");
                delayedEvent.bind(() => {
                    this.handFollowObject.enabled = true;
                });
                delayedEvent.reset(5);
            }
        }
        update() {
            if (global.deviceInfoSystem.isEditor())
                return;
            if (this.tryShowHandMenu(this.leftHand) || this.tryShowHandMenu(this.rightHand)) {
                this.handFollowObject.enabled = true;
                this.noTrackCount = 0;
            }
            else {
                this.noTrackCount++;
                if (this.noTrackCount > 10) {
                    this.handFollowObject.enabled = false;
                }
            }
        }
        tryShowHandMenu(hand) {
            if (!hand.isTracked()) {
                return false;
            }
            const currentPosition = hand.pinkyKnuckle.position;
            if (currentPosition != null) {
                const knuckleForward = hand.indexKnuckle.forward;
                const cameraForward = this.camera.getTransform().forward;
                const angle = Math.acos(knuckleForward.dot(cameraForward) / (knuckleForward.length * cameraForward.length)) * 180.0 / Math.PI;
                if (Math.abs(angle) > this.maxHandAngle) {
                    return false;
                }
                var directionNextToKnuckle = hand.handType == "left" ? hand.indexKnuckle.right :
                    hand.indexKnuckle.right.mult(VectorUtils_1.VectorUtils.scalar3(-1));
                this.handFollowObject.getTransform().setWorldRotation(hand.indexKnuckle.rotation);
                this.handFollowObject.getTransform().setWorldPosition(currentPosition.add(directionNextToKnuckle.mult(VectorUtils_1.VectorUtils.scalar3(this.distanceToHand))));
                return true;
            }
            return false;
        }
    };
    __setFunctionName(_classThis, "HandFollower");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HandFollower = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HandFollower = _classThis;
})();
exports.HandFollower = HandFollower;
//# sourceMappingURL=HandFollower.js.map