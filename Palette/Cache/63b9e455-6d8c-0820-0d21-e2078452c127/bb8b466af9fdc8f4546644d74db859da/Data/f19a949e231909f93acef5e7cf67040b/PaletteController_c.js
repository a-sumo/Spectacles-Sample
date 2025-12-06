if (script.onAwake) {
    script.onAwake();
    return;
}
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @input Asset.ObjectPrefab[] itemPrefabs = {} {"hint":"List of prefabs to instantiate as palette items"}
// @input SceneObject colorGamutObject {"hint":"Color Gamut SceneObject (already in scene)"}
// @input string pigmentEncoderPath = "Encoder_PigmentMix" {"hint":"Path to Encoder_PigmentMix child within colorGamutObject"}
// @input string itemIds {"hint":"Optional IDs for each prefab (comma-separated)"}
// @input string coloredSquarePath = "Colored Square" {"hint":"Path to the colored square within item hierarchy"}
// @input string slotTextPath = "Text" {"hint":"Path to the slot's text within item hierarchy"}
// @input float columns {"hint":"Number of columns in the grid (0 = auto-calculate)"}
// @input float rows {"hint":"Number of rows in the grid (0 = auto-calculate)"}
// @input vec2 padding = {5,5} {"hint":"Padding between items"}
// @input vec2 offset = {0,0} {"hint":"Offset of the item grid"}
// @input float defaultSelectedIndex {"hint":"Index of the default selected item (-1 for none)"}
// @input bool layoutByRow = true {"hint":"Layout direction: true = row-first, false = column-first"}
// @input SceneObject editorTestButton {"hint":"In editor scanner creation button"}
// @input SceneObject presetToggleGroupObject {"hint":"Optional: SceneObject containing the preset toggle group script"}
// @input float defaultPresetIndex {"hint":"Default preset if toggle group not found"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/PaletteController");
Object.setPrototypeOf(script, Module.PaletteController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("itemPrefabs", []);
    checkUndefined("colorGamutObject", []);
    checkUndefined("pigmentEncoderPath", []);
    checkUndefined("itemIds", []);
    checkUndefined("coloredSquarePath", []);
    checkUndefined("slotTextPath", []);
    checkUndefined("columns", []);
    checkUndefined("rows", []);
    checkUndefined("padding", []);
    checkUndefined("offset", []);
    checkUndefined("defaultSelectedIndex", []);
    checkUndefined("layoutByRow", []);
    checkUndefined("editorTestButton", []);
    checkUndefined("presetToggleGroupObject", []);
    checkUndefined("defaultPresetIndex", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
