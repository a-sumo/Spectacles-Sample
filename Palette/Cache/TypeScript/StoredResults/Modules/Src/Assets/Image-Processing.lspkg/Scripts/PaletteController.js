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
exports.PaletteController = exports.PresetChangedEvent = exports.PaletteSelectionEvent = void 0;
var __selfType = requireType("./PaletteController");
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
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
class PaletteSelectionEvent {
    constructor(id, index, sceneObject) {
        this.id = id;
        this.index = index;
        this.sceneObject = sceneObject;
    }
}
exports.PaletteSelectionEvent = PaletteSelectionEvent;
class PresetChangedEvent {
    constructor(presetName, presetIndex, colors) {
        this.presetName = presetName;
        this.presetIndex = presetIndex;
        this.colors = colors;
    }
}
exports.PresetChangedEvent = PresetChangedEvent;
const OIL_PIGMENT_PRESETS = {
    classic: [
        { name: "Titanium White", color: new vec4(0.98, 0.98, 0.96, 1.0) },
        { name: "Ivory Black", color: new vec4(0.08, 0.08, 0.08, 1.0) },
        { name: "Cadmium Yellow", color: new vec4(1.0, 0.85, 0.0, 1.0) },
        { name: "Cadmium Red", color: new vec4(0.89, 0.09, 0.05, 1.0) },
        { name: "Ultramarine Blue", color: new vec4(0.15, 0.15, 0.7, 1.0) },
        { name: "Viridian Green", color: new vec4(0.0, 0.5, 0.45, 1.0) },
    ],
    zorn: [
        { name: "Titanium White", color: new vec4(0.98, 0.98, 0.96, 1.0) },
        { name: "Ivory Black", color: new vec4(0.08, 0.08, 0.08, 1.0) },
        { name: "Yellow Ochre", color: new vec4(0.8, 0.65, 0.25, 1.0) },
        { name: "Cadmium Red", color: new vec4(0.89, 0.09, 0.05, 1.0) },
        { name: "Burnt Sienna", color: new vec4(0.54, 0.27, 0.12, 1.0) },
        { name: "Raw Umber", color: new vec4(0.44, 0.32, 0.18, 1.0) },
    ],
    primary: [
        { name: "Titanium White", color: new vec4(0.98, 0.98, 0.96, 1.0) },
        { name: "Ivory Black", color: new vec4(0.08, 0.08, 0.08, 1.0) },
        { name: "Cadmium Yellow Light", color: new vec4(1.0, 0.92, 0.0, 1.0) },
        { name: "Cadmium Red Medium", color: new vec4(0.89, 0.09, 0.05, 1.0) },
        { name: "Ultramarine Blue", color: new vec4(0.15, 0.15, 0.7, 1.0) },
        { name: "Phthalo Blue", color: new vec4(0.0, 0.25, 0.55, 1.0) },
    ],
    impressionist: [
        { name: "Titanium White", color: new vec4(0.98, 0.98, 0.96, 1.0) },
        { name: "Cadmium Yellow", color: new vec4(1.0, 0.85, 0.0, 1.0) },
        { name: "Cadmium Orange", color: new vec4(0.93, 0.53, 0.18, 1.0) },
        { name: "Cadmium Red", color: new vec4(0.89, 0.09, 0.05, 1.0) },
        { name: "Ultramarine Blue", color: new vec4(0.15, 0.15, 0.7, 1.0) },
        { name: "Viridian Green", color: new vec4(0.0, 0.5, 0.45, 1.0) },
    ],
    earth: [
        { name: "Titanium White", color: new vec4(0.98, 0.98, 0.96, 1.0) },
        { name: "Ivory Black", color: new vec4(0.08, 0.08, 0.08, 1.0) },
        { name: "Yellow Ochre", color: new vec4(0.8, 0.65, 0.25, 1.0) },
        { name: "Burnt Sienna", color: new vec4(0.54, 0.27, 0.12, 1.0) },
        { name: "Raw Umber", color: new vec4(0.44, 0.32, 0.18, 1.0) },
        { name: "Sap Green", color: new vec4(0.31, 0.4, 0.18, 1.0) },
    ],
};
const PRESET_ORDER = [
    "classic",
    "zorn",
    "primary",
    "impressionist",
    "earth",
];
// Clear/empty color (black with zero alpha)
const CLEAR_COLOR = new vec4(0, 0, 0, 0);
let PaletteController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PaletteController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.itemPrefabs = this.itemPrefabs;
            this.colorGamutObject = this.colorGamutObject;
            this.pigmentEncoderPath = this.pigmentEncoderPath;
            this.itemIds = this.itemIds;
            this.coloredSquarePath = this.coloredSquarePath;
            this.slotTextPath = this.slotTextPath;
            this.columns = this.columns;
            this.rows = this.rows;
            this.padding = this.padding;
            this.offset = this.offset;
            this.defaultSelectedIndex = this.defaultSelectedIndex;
            this.layoutByRow = this.layoutByRow;
            this.editorTestButton = this.editorTestButton;
            this.presetToggleGroupObject = this.presetToggleGroupObject;
            this.defaultPresetIndex = this.defaultPresetIndex;
            this.isEditor = global.deviceInfoSystem.isEditor();
            this.items = new Map();
            this.itemList = [];
            this.activeItemId = null;
            this.isUpdatingSelection = false;
            this.initialized = false;
            this.pigmentEncoderScript = null;
            // Preset state - null means uninitialized or cleared
            this.currentPreset = null;
            this.currentPresetIndex = -1;
            this.presetToggleGroup = null;
            this.onSelectionChangedEvent = new Event_1.default();
            this.onSelectionChanged = this.onSelectionChangedEvent.publicApi();
            this.onPresetChangedEvent = new Event_1.default();
            this.onPresetChanged = this.onPresetChangedEvent.publicApi();
        }
        __initialize() {
            super.__initialize();
            this.itemPrefabs = this.itemPrefabs;
            this.colorGamutObject = this.colorGamutObject;
            this.pigmentEncoderPath = this.pigmentEncoderPath;
            this.itemIds = this.itemIds;
            this.coloredSquarePath = this.coloredSquarePath;
            this.slotTextPath = this.slotTextPath;
            this.columns = this.columns;
            this.rows = this.rows;
            this.padding = this.padding;
            this.offset = this.offset;
            this.defaultSelectedIndex = this.defaultSelectedIndex;
            this.layoutByRow = this.layoutByRow;
            this.editorTestButton = this.editorTestButton;
            this.presetToggleGroupObject = this.presetToggleGroupObject;
            this.defaultPresetIndex = this.defaultPresetIndex;
            this.isEditor = global.deviceInfoSystem.isEditor();
            this.items = new Map();
            this.itemList = [];
            this.activeItemId = null;
            this.isUpdatingSelection = false;
            this.initialized = false;
            this.pigmentEncoderScript = null;
            // Preset state - null means uninitialized or cleared
            this.currentPreset = null;
            this.currentPresetIndex = -1;
            this.presetToggleGroup = null;
            this.onSelectionChangedEvent = new Event_1.default();
            this.onSelectionChanged = this.onSelectionChangedEvent.publicApi();
            this.onPresetChangedEvent = new Event_1.default();
            this.onPresetChanged = this.onPresetChangedEvent.publicApi();
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.initialize.bind(this));
            if (this.editorTestButton && !this.isEditor) {
                this.editorTestButton.enabled = false;
            }
        }
        initialize() {
            if (this.initialized)
                return;
            this.instantiateItems();
            this.layoutItems();
            this.setupButtonListeners();
            if (this.defaultSelectedIndex >= 0 &&
                this.defaultSelectedIndex < this.itemList.length) {
                const defaultItem = this.itemList[this.defaultSelectedIndex];
                this.setActiveItem(defaultItem.id, false);
            }
            this.initializeColorGamut();
            this.initializePreset();
            this.initialized = true;
            print("PaletteController: Initialization complete");
        }
        initializePreset() {
            if (this.presetToggleGroupObject) {
                this.connectToToggleGroup();
            }
            let initialPresetIndex = this.defaultPresetIndex;
            if (this.presetToggleGroup) {
                const toggleGroupAny = this.presetToggleGroup;
                const selectedIndex = typeof toggleGroupAny.getSelectedIndex === "function"
                    ? toggleGroupAny.getSelectedIndex()
                    : -1;
                if (selectedIndex >= 0 && selectedIndex < PRESET_ORDER.length) {
                    initialPresetIndex = selectedIndex;
                    print(`PaletteController: Using toggle group selection (index ${selectedIndex})`);
                }
            }
            else {
                print(`PaletteController: No toggle group found, using default preset index ${this.defaultPresetIndex}`);
            }
            // Force apply on initialization (currentPreset is null, so no early return)
            this.applyPresetByIndex(initialPresetIndex, false);
        }
        connectToToggleGroup() {
            if (!this.presetToggleGroupObject)
                return;
            const scripts = this.presetToggleGroupObject.getComponents("Component.ScriptComponent");
            for (const script of scripts) {
                const scriptAny = script;
                if (typeof scriptAny.getSelectedIndex === "function" &&
                    scriptAny.onSelectionChanged &&
                    typeof scriptAny.onSelectionChanged.add === "function") {
                    this.presetToggleGroup = script;
                    scriptAny.onSelectionChanged.add((event) => {
                        this.onToggleGroupSelectionChanged(event);
                    });
                    print("PaletteController: Connected to preset toggle group");
                    return;
                }
                if (scriptAny.onToggleSelected &&
                    typeof scriptAny.onToggleSelected.add === "function") {
                    this.presetToggleGroup = script;
                    scriptAny.onToggleSelected.add((event) => {
                        const index = this.findToggleIndex(event.toggleable);
                        if (index >= 0) {
                            this.applyPresetByIndex(index, true);
                        }
                    });
                    print("PaletteController: Connected to BaseToggleGroup");
                    return;
                }
            }
            print("PaletteController: Could not find compatible toggle group script");
        }
        findToggleIndex(toggleable) {
            if (!this.presetToggleGroup)
                return -1;
            const toggleGroupAny = this.presetToggleGroup;
            const toggleables = toggleGroupAny.toggleables;
            if (!toggleables)
                return -1;
            for (let i = 0; i < toggleables.length; i++) {
                if (toggleables[i] === toggleable) {
                    return i;
                }
            }
            return -1;
        }
        onToggleGroupSelectionChanged(event) {
            const index = event.index ?? event.presetIndex ?? -1;
            if (index >= 0 && index < PRESET_ORDER.length) {
                print(`PaletteController: Toggle group changed to index ${index}`);
                this.applyPresetByIndex(index, true);
            }
        }
        applyPresetByIndex(index, notify = true) {
            if (index < 0 || index >= PRESET_ORDER.length) {
                print(`PaletteController: Invalid preset index ${index}`);
                return;
            }
            const presetName = PRESET_ORDER[index];
            this.applyPreset(presetName, index, notify);
        }
        setOilPigmentPreset(presetName = "classic", notify = true) {
            const index = PRESET_ORDER.indexOf(presetName);
            if (index < 0) {
                print(`PaletteController: Unknown preset '${presetName}'`);
                return;
            }
            this.applyPreset(presetName, index, notify);
        }
        applyPreset(presetName, presetIndex, notify) {
            const preset = OIL_PIGMENT_PRESETS[presetName];
            if (!preset)
                return;
            // Only skip if already applied (null means never applied)
            if (this.currentPreset !== null &&
                this.currentPreset === presetName &&
                this.currentPresetIndex === presetIndex) {
                return;
            }
            this.currentPreset = presetName;
            this.currentPresetIndex = presetIndex;
            const count = Math.min(this.itemList.length, preset.length);
            const colors = [];
            for (let i = 0; i < count; i++) {
                const pigment = preset[i];
                const item = this.itemList[i];
                item.color = pigment.color;
                colors.push(pigment.color);
                const itemData = this.items.get(item.id);
                if (itemData) {
                    itemData.color = pigment.color;
                }
                if (item.coloredSquareMaterial) {
                    item.coloredSquareMaterial.mainPass.mainColor = pigment.color;
                }
                if (item.slotTextObj) {
                    const textComponent = item.slotTextObj.getComponent("Text");
                    if (textComponent) {
                        textComponent.text = `${i + 1}`;
                    }
                }
            }
            this.syncPigmentColors();
            print(`PaletteController: Applied '${presetName}' preset (index ${presetIndex})`);
            if (notify) {
                this.onPresetChangedEvent.invoke(new PresetChangedEvent(presetName, presetIndex, colors));
            }
        }
        /**
         * Clear all slot colors to black with zero alpha
         * This effectively empties the palette
         */
        clearSlotColors(notify = true) {
            const colors = [];
            for (let i = 0; i < this.itemList.length; i++) {
                const item = this.itemList[i];
                const clearColor = new vec4(0, 0, 0, 0);
                item.color = clearColor;
                colors.push(clearColor);
                const itemData = this.items.get(item.id);
                if (itemData) {
                    itemData.color = clearColor;
                }
                if (item.coloredSquareMaterial) {
                    item.coloredSquareMaterial.mainPass.mainColor = clearColor;
                }
            }
            // Reset preset state
            this.currentPreset = null;
            this.currentPresetIndex = -1;
            this.syncPigmentColors();
            print("PaletteController: Cleared all slot colors");
            if (notify) {
                this.onPresetChangedEvent.invoke(new PresetChangedEvent(null, -1, colors));
            }
        }
        /**
         * Check if the palette is cleared (all slots empty)
         */
        isCleared() {
            return this.currentPreset === null && this.currentPresetIndex === -1;
        }
        /**
         * Check if a specific slot is empty (zero alpha)
         */
        isSlotEmpty(index) {
            if (index < 0 || index >= this.itemList.length)
                return true;
            return this.itemList[index].color.w === 0;
        }
        /**
         * Get number of non-empty slots
         */
        getActiveSlotCount() {
            let count = 0;
            for (const item of this.itemList) {
                if (item.color.w > 0) {
                    count++;
                }
            }
            return count;
        }
        initializeColorGamut() {
            if (!this.colorGamutObject) {
                print("PaletteController: No colorGamutObject set");
                return;
            }
            let encoderObj = null;
            if (this.pigmentEncoderPath === "" || this.pigmentEncoderPath === ".") {
                encoderObj = this.colorGamutObject;
            }
            else {
                encoderObj = this.findChildByPath(this.colorGamutObject, this.pigmentEncoderPath);
            }
            if (!encoderObj) {
                print(`PaletteController: Could not find '${this.pigmentEncoderPath}' in colorGamutObject`);
                return;
            }
            this.pigmentEncoderScript = encoderObj.getComponent("Component.ScriptComponent");
            if (!this.pigmentEncoderScript) {
                print("PaletteController: No ScriptComponent found on Encoder_PigmentMix");
                return;
            }
            print("PaletteController: Color gamut initialized");
        }
        syncPigmentColors() {
            if (!this.pigmentEncoderScript) {
                return;
            }
            const maxPigments = 6;
            const encoder = this.pigmentEncoderScript;
            for (let i = 0; i < maxPigments; i++) {
                const pigmentKey = `pig${i}Color`;
                if (i < this.itemList.length) {
                    const itemColor = this.itemList[i].color;
                    // Use RGB from color, alpha determines if it's "active"
                    const pigmentColor = new vec3(itemColor.x, itemColor.y, itemColor.z);
                    encoder[pigmentKey] = pigmentColor;
                }
                else {
                    // Default to black for unused slots
                    encoder[pigmentKey] = new vec3(0, 0, 0);
                }
            }
            const activeCount = this.getActiveSlotCount();
            print(`PaletteController: Synced ${activeCount} active pigment colors to encoder`);
        }
        instantiateItems() {
            const ids = this.itemIds
                .split(",")
                .map((id) => id.trim())
                .filter((id) => id.length > 0);
            for (let i = 0; i < this.itemPrefabs.length; i++) {
                const prefab = this.itemPrefabs[i];
                if (!prefab)
                    continue;
                const sceneObject = prefab.instantiate(this.getSceneObject());
                const id = ids[i] || `item_${i}`;
                sceneObject.name = `PaletteItem_${id}`;
                const button = this.findButtonComponent(sceneObject);
                if (!button) {
                    print(`PaletteController: No BaseButton found on prefab ${i}, skipping`);
                    sceneObject.destroy();
                    continue;
                }
                const coloredSquare = this.findChildByPath(sceneObject, this.coloredSquarePath);
                let coloredSquareMaterial = null;
                if (coloredSquare) {
                    const renderMesh = coloredSquare.getComponent("Component.RenderMeshVisual");
                    if (renderMesh && renderMesh.mainMaterial) {
                        renderMesh.mainMaterial = renderMesh.mainMaterial.clone();
                        coloredSquareMaterial = renderMesh.mainMaterial;
                    }
                }
                const slotTextObj = this.findChildByPath(sceneObject, this.slotTextPath);
                if (slotTextObj) {
                    const textComp = slotTextObj.getComponent("Text");
                    if (textComp) {
                        textComp.text = `${i + 1}`;
                    }
                }
                button.setIsToggleable(true);
                // Initialize with clear color - preset will be applied after
                const initialColor = new vec4(0, 0, 0, 0);
                const itemData = {
                    sceneObject,
                    button,
                    index: this.itemList.length,
                    slotTextObj,
                    coloredSquare,
                    coloredSquareMaterial,
                    color: initialColor,
                };
                this.items.set(id, itemData);
                this.itemList.push({
                    id,
                    sceneObject,
                    button,
                    slotTextObj,
                    coloredSquare,
                    coloredSquareMaterial,
                    color: initialColor,
                });
            }
            print(`PaletteController: Instantiated ${this.itemList.length} items`);
        }
        findChildByPath(sceneObject, path) {
            if (!path)
                return sceneObject;
            const pathParts = path.split("/");
            let current = sceneObject;
            for (const part of pathParts) {
                let found = false;
                for (let i = 0; i < current.getChildrenCount(); i++) {
                    const child = current.getChild(i);
                    if (child.name === part) {
                        current = child;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return null;
                }
            }
            return current;
        }
        findButtonComponent(sceneObject) {
            const button = sceneObject.getComponent("Component.ScriptComponent");
            if (button && typeof button.setIsToggleable === "function") {
                return button;
            }
            for (let i = 0; i < sceneObject.getChildrenCount(); i++) {
                const child = sceneObject.getChild(i);
                const childButton = this.findButtonComponent(child);
                if (childButton)
                    return childButton;
            }
            return null;
        }
        layoutItems() {
            if (this.itemList.length === 0)
                return;
            const itemCount = this.itemList.length;
            let cols = this.columns;
            let rows = this.rows;
            if (cols <= 0 && rows <= 0) {
                cols = Math.ceil(Math.sqrt(itemCount));
                rows = Math.ceil(itemCount / cols);
            }
            else if (cols <= 0) {
                cols = Math.ceil(itemCount / rows);
            }
            else if (rows <= 0) {
                rows = Math.ceil(itemCount / cols);
            }
            const boundingBoxes = this.itemList.map((item) => this.calculateBoundingBox(item.sceneObject));
            let maxWidth = 0;
            let maxHeight = 0;
            for (const bbox of boundingBoxes) {
                maxWidth = Math.max(maxWidth, bbox.size.x);
                maxHeight = Math.max(maxHeight, bbox.size.y);
            }
            if (maxWidth === 0)
                maxWidth = 10;
            if (maxHeight === 0)
                maxHeight = 10;
            const cellWidth = maxWidth + this.padding.x;
            const cellHeight = maxHeight + this.padding.y;
            const totalWidth = cols * cellWidth;
            const totalHeight = rows * cellHeight;
            const startX = -totalWidth / 2 + cellWidth / 2;
            const startY = totalHeight / 2 - cellHeight / 2;
            for (let i = 0; i < this.itemList.length; i++) {
                let col;
                let row;
                if (this.layoutByRow) {
                    col = i % cols;
                    row = Math.floor(i / cols);
                }
                else {
                    row = i % rows;
                    col = Math.floor(i / rows);
                }
                const x = startX + col * cellWidth;
                const y = startY - row * cellHeight;
                const item = this.itemList[i];
                const transform = item.sceneObject.getTransform();
                transform.setLocalPosition(new vec3(x + this.offset.x, y + this.offset.y, 0));
            }
            print(`PaletteController: Laid out ${itemCount} items in ${rows}x${cols} grid`);
        }
        calculateBoundingBox(sceneObject) {
            const defaultBox = {
                min: vec3.zero(),
                max: vec3.zero(),
                size: vec3.zero(),
                center: vec3.zero(),
            };
            const meshVisuals = this.findMeshVisuals(sceneObject);
            if (meshVisuals.length === 0)
                return defaultBox;
            let minX = Infinity;
            let minY = Infinity;
            let minZ = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
            let maxZ = -Infinity;
            for (const meshVisual of meshVisuals) {
                const aabbMin = meshVisual.localAabbMin();
                const aabbMax = meshVisual.localAabbMax();
                minX = Math.min(minX, aabbMin.x);
                minY = Math.min(minY, aabbMin.y);
                minZ = Math.min(minZ, aabbMin.z);
                maxX = Math.max(maxX, aabbMax.x);
                maxY = Math.max(maxY, aabbMax.y);
                maxZ = Math.max(maxZ, aabbMax.z);
            }
            if (!isFinite(minX))
                return defaultBox;
            const min = new vec3(minX, minY, minZ);
            const max = new vec3(maxX, maxY, maxZ);
            const size = max.sub(min);
            const center = min.add(max).uniformScale(0.5);
            return { min, max, size, center };
        }
        findMeshVisuals(sceneObject) {
            const results = [];
            const meshVisual = sceneObject.getComponent("Component.RenderMeshVisual");
            if (meshVisual)
                results.push(meshVisual);
            for (let i = 0; i < sceneObject.getChildrenCount(); i++) {
                const childResults = this.findMeshVisuals(sceneObject.getChild(i));
                results.push(...childResults);
            }
            return results;
        }
        setupButtonListeners() {
            for (const item of this.itemList) {
                const itemId = item.id;
                item.button.onValueChange.add((value) => {
                    if (this.isUpdatingSelection)
                        return;
                    if (value === 1) {
                        this.setActiveItem(itemId, true);
                    }
                    else if (this.activeItemId === itemId) {
                        this.isUpdatingSelection = true;
                        item.button.toggle(true);
                        if (item.slotTextObj) {
                            const textComp = item.slotTextObj.getComponent("Text");
                            if (textComp) {
                                textComp.textFill.color = new vec4(1, 1, 1, 1);
                            }
                        }
                        this.isUpdatingSelection = false;
                    }
                });
            }
        }
        setActiveItem(id, notify = true) {
            if (this.activeItemId === id)
                return;
            if (this.isUpdatingSelection)
                return;
            const newItem = this.items.get(id);
            if (!newItem) {
                print(`PaletteController: Item '${id}' not found`);
                return;
            }
            this.isUpdatingSelection = true;
            if (this.activeItemId !== null) {
                const prevItem = this.items.get(this.activeItemId);
                if (prevItem) {
                    prevItem.button.toggle(false);
                    if (prevItem.slotTextObj) {
                        const textComp = prevItem.slotTextObj.getComponent("Text");
                        if (textComp) {
                            textComp.textFill.color = new vec4(0.9, 0.9, 0.9, 1);
                        }
                    }
                }
            }
            this.activeItemId = id;
            newItem.button.toggle(true);
            if (newItem.slotTextObj) {
                const textComp = newItem.slotTextObj.getComponent("Text");
                if (textComp) {
                    textComp.textFill.color = new vec4(1, 0.85, 0, 1);
                }
            }
            this.isUpdatingSelection = false;
            if (notify) {
                this.onSelectionChangedEvent.invoke(new PaletteSelectionEvent(id, newItem.index, newItem.sceneObject));
            }
        }
        setActiveItemByIndex(index, notify = true) {
            if (index < 0 || index >= this.itemList.length)
                return;
            this.setActiveItem(this.itemList[index].id, notify);
        }
        getActiveItemId() {
            return this.activeItemId;
        }
        getActiveItemIndex() {
            if (this.activeItemId === null)
                return -1;
            const item = this.items.get(this.activeItemId);
            return item ? item.index : -1;
        }
        getActiveSceneObject() {
            if (this.activeItemId === null)
                return null;
            const item = this.items.get(this.activeItemId);
            return item ? item.sceneObject : null;
        }
        getItemById(id) {
            const item = this.items.get(id);
            return item ? item.sceneObject : null;
        }
        getItemByIndex(index) {
            if (index < 0 || index >= this.itemList.length)
                return null;
            return this.itemList[index].sceneObject;
        }
        getItemCount() {
            return this.itemList.length;
        }
        getAllItemIds() {
            return this.itemList.map((item) => item.id);
        }
        relayout() {
            this.layoutItems();
        }
        setActiveItemColor(color) {
            if (this.activeItemId === null)
                return;
            this.setItemColor(this.activeItemId, color);
        }
        setItemColor(id, color) {
            const item = this.items.get(id);
            if (!item)
                return;
            item.color = color;
            const listItem = this.itemList.find((i) => i.id === id);
            if (listItem) {
                listItem.color = color;
            }
            if (item.coloredSquareMaterial) {
                item.coloredSquareMaterial.mainPass.mainColor = color;
            }
            // Mark as custom preset
            this.currentPreset = null;
            this.currentPresetIndex = -1;
            this.syncPigmentColors();
        }
        setItemColorByIndex(index, color) {
            if (index < 0 || index >= this.itemList.length)
                return;
            this.setItemColor(this.itemList[index].id, color);
        }
        getItemColor(id) {
            const item = this.items.get(id);
            return item ? item.color : null;
        }
        getActiveItemColor() {
            if (this.activeItemId === null)
                return null;
            return this.getItemColor(this.activeItemId);
        }
        getCurrentPreset() {
            return this.currentPreset;
        }
        getCurrentPresetIndex() {
            return this.currentPresetIndex;
        }
        getAvailablePresets() {
            return [...PRESET_ORDER];
        }
        getPresetInfo(presetName) {
            const preset = OIL_PIGMENT_PRESETS[presetName];
            if (!preset)
                return null;
            return preset.map((p) => ({
                name: p.name,
                color: new vec4(p.color.x, p.color.y, p.color.z, p.color.w),
            }));
        }
        getAllColors() {
            return this.itemList.map((item) => new vec4(item.color.x, item.color.y, item.color.z, item.color.w));
        }
        setColorsFromArray(colors) {
            const count = Math.min(this.itemList.length, colors.length);
            for (let i = 0; i < count; i++) {
                const item = this.itemList[i];
                item.color = colors[i];
                if (item.coloredSquareMaterial) {
                    item.coloredSquareMaterial.mainPass.mainColor = colors[i];
                }
            }
            // Mark as custom
            this.currentPreset = null;
            this.currentPresetIndex = -1;
            this.syncPigmentColors();
        }
        logCurrentPalette() {
            const presetStr = this.currentPreset !== null
                ? `${this.currentPreset} (index ${this.currentPresetIndex})`
                : "custom/cleared";
            print(`=== Current Palette: ${presetStr} ===`);
            for (let i = 0; i < this.itemList.length; i++) {
                const item = this.itemList[i];
                const c = item.color;
                const status = c.w > 0 ? "active" : "empty";
                print(`  [${i}] RGBA(${c.x.toFixed(2)}, ${c.y.toFixed(2)}, ${c.z.toFixed(2)}, ${c.w.toFixed(2)}) - ${status}`);
            }
        }
        getColorGamutObject() {
            return this.colorGamutObject;
        }
        getPigmentEncoderScript() {
            return this.pigmentEncoderScript;
        }
    };
    __setFunctionName(_classThis, "PaletteController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaletteController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaletteController = _classThis;
})();
exports.PaletteController = PaletteController;
//# sourceMappingURL=PaletteController.js.map