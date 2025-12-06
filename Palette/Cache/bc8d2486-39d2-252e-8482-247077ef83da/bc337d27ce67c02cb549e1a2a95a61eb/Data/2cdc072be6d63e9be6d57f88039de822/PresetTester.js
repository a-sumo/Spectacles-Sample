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
exports.PresetTester = void 0;
var __selfType = requireType("./PresetTester");
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
let PresetTester = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PresetTester = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.toggleGroup = this.toggleGroup;
            this.paletteController = this.paletteController;
            this.debugMode = this.debugMode;
            // 3 presets for testing
            this.presets = [
                { name: "classic", label: "Classic" },
                { name: "zorn", label: "Zorn" },
                { name: "impressionist", label: "Impressionist" }
            ];
        }
        __initialize() {
            super.__initialize();
            this.toggleGroup = this.toggleGroup;
            this.paletteController = this.paletteController;
            this.debugMode = this.debugMode;
            // 3 presets for testing
            this.presets = [
                { name: "classic", label: "Classic" },
                { name: "zorn", label: "Zorn" },
                { name: "impressionist", label: "Impressionist" }
            ];
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
        }
        initialize() {
            // Validate inputs
            if (!this.toggleGroup) {
                print("PresetTester ERROR: toggleGroup not assigned");
                return;
            }
            if (!this.paletteController) {
                print("PresetTester ERROR: paletteController not assigned");
                return;
            }
            this.group = this.toggleGroup;
            this.palette = this.paletteController;
            // Setup labels
            const labels = this.presets.map(p => p.label);
            this.group.setAllLabelTexts(labels);
            // Listen to selection changes
            this.group.onSelectionChanged.add((event) => {
                this.onPresetSelected(event);
            });
            // Listen to deselections
            this.group.onDeselection.add((event) => {
                if (this.debugMode) {
                    print(`PresetTester: Deselected '${event.label}'`);
                }
            });
            // Apply initial preset (first one)
            this.applyPreset(0);
            if (this.debugMode) {
                print(`PresetTester: Initialized with ${this.presets.length} presets`);
                print(`  Available: ${labels.join(", ")}`);
            }
        }
        onPresetSelected(event) {
            if (this.debugMode) {
                print(`PresetTester: Selected '${event.label}' (index: ${event.index})`);
            }
            this.applyPreset(event.index);
        }
        applyPreset(index) {
            if (index < 0 || index >= this.presets.length) {
                print(`PresetTester: Invalid preset index ${index}`);
                return;
            }
            const preset = this.presets[index];
            this.palette.setOilPigmentPreset(preset.name);
            if (this.debugMode) {
                print(`PresetTester: Applied '${preset.name}' preset`);
                this.palette.logCurrentPalette();
            }
        }
        // ============ PUBLIC API ============
        /**
         * Select preset by index (0, 1, or 2)
         */
        selectPreset(index) {
            if (index < 0 || index >= this.presets.length) {
                print(`PresetTester: Index ${index} out of range (0-${this.presets.length - 1})`);
                return;
            }
            this.group.setSelectedIndex(index, true);
        }
        /**
         * Select preset by name
         */
        selectPresetByName(name) {
            const index = this.presets.findIndex(p => p.name === name);
            if (index >= 0) {
                this.selectPreset(index);
            }
            else {
                print(`PresetTester: Unknown preset '${name}'`);
            }
        }
        /**
         * Get current preset name
         */
        getCurrentPresetName() {
            const index = this.group.getSelectedIndex();
            if (index >= 0 && index < this.presets.length) {
                return this.presets[index].name;
            }
            return "";
        }
        /**
         * Cycle to next preset
         */
        nextPreset() {
            const current = this.group.getSelectedIndex();
            const next = (current + 1) % this.presets.length;
            this.selectPreset(next);
        }
        /**
         * Cycle to previous preset
         */
        previousPreset() {
            const current = this.group.getSelectedIndex();
            const prev = (current - 1 + this.presets.length) % this.presets.length;
            this.selectPreset(prev);
        }
    };
    __setFunctionName(_classThis, "PresetTester");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PresetTester = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PresetTester = _classThis;
})();
exports.PresetTester = PresetTester;
//# sourceMappingURL=PresetTester.js.map