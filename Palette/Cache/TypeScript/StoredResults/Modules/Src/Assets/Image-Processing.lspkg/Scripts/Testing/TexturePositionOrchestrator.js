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
exports.TexturePositionTestOrchestrator = void 0;
var __selfType = requireType("./TexturePositionOrchestrator");
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
let TexturePositionTestOrchestrator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var TexturePositionTestOrchestrator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.positionSync = this.positionSync;
            this.autoToggleInterval = this.autoToggleInterval;
            this.autoToggleEnabled = this.autoToggleEnabled;
            this.debugMode = this.debugMode;
            this.sync = null;
            this.timer = 0;
        }
        __initialize() {
            super.__initialize();
            this.positionSync = this.positionSync;
            this.autoToggleInterval = this.autoToggleInterval;
            this.autoToggleEnabled = this.autoToggleEnabled;
            this.debugMode = this.debugMode;
            this.sync = null;
            this.timer = 0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
            this.createEvent("UpdateEvent").bind((e) => this.onUpdate(e));
        }
        initialize() {
            if (!this.positionSync) {
                print("TexturePositionTestOrchestrator ERROR: No positionSync assigned!");
                return;
            }
            this.sync = this.positionSync;
            this.timer = this.autoToggleInterval;
            if (this.debugMode) {
                print("TexturePositionTestOrchestrator: Ready");
            }
        }
        onUpdate(e) {
            if (!this.sync || !this.autoToggleEnabled)
                return;
            this.timer -= e.getDeltaTime();
            if (this.timer <= 0) {
                this.timer = this.autoToggleInterval;
                this.sync.toggle();
                if (this.debugMode) {
                    const atParticle = this.sync.atParticlePositions;
                    print(`Toggle: ${atParticle ? "PARTICLE (gamut)" : "CIRCLE (rest)"}`);
                }
            }
        }
        toggle() {
            if (this.sync)
                this.sync.toggle();
        }
        toParticles() {
            if (this.sync)
                this.sync.setAtParticlePositions(true);
        }
        toCircle() {
            if (this.sync)
                this.sync.setAtParticlePositions(false);
        }
    };
    __setFunctionName(_classThis, "TexturePositionTestOrchestrator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TexturePositionTestOrchestrator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TexturePositionTestOrchestrator = _classThis;
})();
exports.TexturePositionTestOrchestrator = TexturePositionTestOrchestrator;
//# sourceMappingURL=TexturePositionOrchestrator.js.map