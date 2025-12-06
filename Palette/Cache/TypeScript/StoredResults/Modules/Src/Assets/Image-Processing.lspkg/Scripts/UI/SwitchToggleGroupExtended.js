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
exports.SwitchToggleGroupExtended = exports.ToggleSelectionEvent = void 0;
var __selfType = requireType("./SwitchToggleGroupExtended");
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
const BaseToggleGroup_1 = require("SpectaclesUIKit.lspkg/Scripts/Components/Toggle/BaseToggleGroup");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
/**
 * Event data for toggle selection
 */
class ToggleSelectionEvent {
    constructor(index, switchComponent, label, sceneObject) {
        this.index = index;
        this.switchComponent = switchComponent;
        this.label = label;
        this.sceneObject = sceneObject;
    }
}
exports.ToggleSelectionEvent = ToggleSelectionEvent;
/**
 * Extended toggle group with text labels and selection tracking
 */
let SwitchToggleGroupExtended = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseToggleGroup_1.BaseToggleGroup;
    var SwitchToggleGroupExtended = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._switches = this._switches;
            this._labels = this._labels;
            this.labelTexts = this.labelTexts;
            this.selectedLabelColor = this.selectedLabelColor;
            this.unselectedLabelColor = this.unselectedLabelColor;
            this.defaultSelectedIndex = this.defaultSelectedIndex;
            // Selection tracking
            this._selectedIndex = -1;
            this._previousSelectedIndex = -1;
            // Events
            this.onSelectionChangedEvent = new Event_1.default();
            this.onSelectionChanged = this.onSelectionChangedEvent.publicApi();
            this.onDeselectionEvent = new Event_1.default();
            this.onDeselection = this.onDeselectionEvent.publicApi();
        }
        __initialize() {
            super.__initialize();
            this._switches = this._switches;
            this._labels = this._labels;
            this.labelTexts = this.labelTexts;
            this.selectedLabelColor = this.selectedLabelColor;
            this.unselectedLabelColor = this.unselectedLabelColor;
            this.defaultSelectedIndex = this.defaultSelectedIndex;
            // Selection tracking
            this._selectedIndex = -1;
            this._previousSelectedIndex = -1;
            // Events
            this.onSelectionChangedEvent = new Event_1.default();
            this.onSelectionChanged = this.onSelectionChangedEvent.publicApi();
            this.onDeselectionEvent = new Event_1.default();
            this.onDeselection = this.onDeselectionEvent.publicApi();
        }
        // BaseToggleGroup implementation
        get toggleables() {
            return this._switches;
        }
        onAwake() {
            super.onAwake();
            this.createEvent("OnStartEvent").bind(() => this.initializeExtended());
        }
        initializeExtended() {
            // Setup label texts
            this.setupLabels();
            // Listen to each switch's value changes
            for (let i = 0; i < this._switches.length; i++) {
                const switchComponent = this._switches[i];
                const index = i;
                switchComponent.onValueChange.add((value) => {
                    this.handleSwitchValueChanged(index, value);
                });
            }
            // Set default selection
            if (this.defaultSelectedIndex >= 0 && this.defaultSelectedIndex < this._switches.length) {
                this.setSelectedIndex(this.defaultSelectedIndex, false);
            }
            // Update label colors
            this.updateLabelColors();
            print(`SwitchToggleGroupExtended: Initialized with ${this._switches.length} switches`);
        }
        setupLabels() {
            if (this.labelTexts.length === 0)
                return;
            const texts = this.labelTexts.split(",").map(t => t.trim());
            for (let i = 0; i < Math.min(this._labels.length, texts.length); i++) {
                if (this._labels[i]) {
                    this._labels[i].text = texts[i];
                }
            }
        }
        handleSwitchValueChanged(index, value) {
            if (value === 1) {
                // Switch turned ON
                this._previousSelectedIndex = this._selectedIndex;
                this._selectedIndex = index;
                this.updateLabelColors();
                // Invoke selection event
                const event = new ToggleSelectionEvent(index, this._switches[index], this.getLabelText(index), this._switches[index].sceneObject);
                this.onSelectionChangedEvent.invoke(event);
                // Invoke deselection event for previous
                if (this._previousSelectedIndex >= 0 && this._previousSelectedIndex !== index) {
                    const deselectionEvent = new ToggleSelectionEvent(this._previousSelectedIndex, this._switches[this._previousSelectedIndex], this.getLabelText(this._previousSelectedIndex), this._switches[this._previousSelectedIndex].sceneObject);
                    this.onDeselectionEvent.invoke(deselectionEvent);
                }
            }
        }
        updateLabelColors() {
            for (let i = 0; i < this._labels.length; i++) {
                if (!this._labels[i])
                    continue;
                if (i === this._selectedIndex) {
                    this._labels[i].textFill.color = this.selectedLabelColor;
                }
                else {
                    this._labels[i].textFill.color = this.unselectedLabelColor;
                }
            }
        }
        // ============ PUBLIC API ============
        /**
         * Get the currently selected index
         */
        getSelectedIndex() {
            return this._selectedIndex;
        }
        /**
         * Get the previously selected index
         */
        getPreviousSelectedIndex() {
            return this._previousSelectedIndex;
        }
        /**
         * Set the selected index programmatically
         */
        setSelectedIndex(index, notify = true) {
            if (index < 0 || index >= this._switches.length) {
                print(`SwitchToggleGroupExtended: Index ${index} out of range`);
                return;
            }
            if (index === this._selectedIndex)
                return;
            // Turn off current selection
            if (this._selectedIndex >= 0 && this._selectedIndex < this._switches.length) {
                this._switches[this._selectedIndex].isOn = false;
            }
            // Turn on new selection
            this._previousSelectedIndex = this._selectedIndex;
            this._selectedIndex = index;
            this._switches[index].isOn = true;
            this.updateLabelColors();
            if (notify) {
                const event = new ToggleSelectionEvent(index, this._switches[index], this.getLabelText(index), this._switches[index].sceneObject);
                this.onSelectionChangedEvent.invoke(event);
            }
        }
        /**
         * Get the selected switch component
         */
        getSelectedSwitch() {
            if (this._selectedIndex >= 0 && this._selectedIndex < this._switches.length) {
                return this._switches[this._selectedIndex];
            }
            return null;
        }
        /**
         * Get the label text for a specific index
         */
        getLabelText(index) {
            if (index >= 0 && index < this._labels.length && this._labels[index]) {
                return this._labels[index].text;
            }
            return "";
        }
        /**
         * Set the label text for a specific index
         */
        setLabelText(index, text) {
            if (index >= 0 && index < this._labels.length && this._labels[index]) {
                this._labels[index].text = text;
            }
        }
        /**
         * Get all label texts
         */
        getAllLabelTexts() {
            return this._labels.map(label => label ? label.text : "");
        }
        /**
         * Set all label texts
         */
        setAllLabelTexts(texts) {
            for (let i = 0; i < Math.min(this._labels.length, texts.length); i++) {
                if (this._labels[i]) {
                    this._labels[i].text = texts[i];
                }
            }
        }
        /**
         * Get switch by index
         */
        getSwitch(index) {
            if (index >= 0 && index < this._switches.length) {
                return this._switches[index];
            }
            return null;
        }
        /**
         * Get the number of switches
         */
        getSwitchCount() {
            return this._switches.length;
        }
        /**
         * Set label colors
         */
        setLabelColors(selected, unselected) {
            this.selectedLabelColor = selected;
            this.unselectedLabelColor = unselected;
            this.updateLabelColors();
        }
    };
    __setFunctionName(_classThis, "SwitchToggleGroupExtended");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SwitchToggleGroupExtended = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SwitchToggleGroupExtended = _classThis;
})();
exports.SwitchToggleGroupExtended = SwitchToggleGroupExtended;
//# sourceMappingURL=SwitchToggleGroupExtended.js.map