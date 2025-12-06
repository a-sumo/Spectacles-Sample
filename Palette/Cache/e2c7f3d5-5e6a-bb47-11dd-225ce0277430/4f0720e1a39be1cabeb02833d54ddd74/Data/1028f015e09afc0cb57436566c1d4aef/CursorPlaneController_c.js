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
// @input SceneObject cursorPlane {"hint":"The cursor plane SceneObject to move around"}
// @input SceneObject regionHoverPlane {"hint":"The region hover plane SceneObject (positioned at hit with normal offset)"}
// @input Component.Text sampledColorText {"hint":"Text component to display the sampled color as HEX code"}
// @input SceneObject sampleColorIndicator {"hint":"Object whose material mainColor will be set to the sampled color"}
// @input SceneObject sampleRegionIndicator {"hint":"Object showing the sampled region grid"}
// @input float defaultGridSize = 9 {"hint":"Default grid size for texture sampling (odd number, e.g., 9 = 9x9 grid). Overridden by slider if assigned."}
// @input string cameraCropPath = "ImageAnchor/CameraCrop" {"hint":"Path to cameraCrop within scanner hierarchy"}
// @input AssignableType paletteController {"hint":"PaletteController to set colors on when sampling"}
// @input SceneObject gridSizeSlider {"hint":"Slider to control grid size (optional). If assigned, this overrides defaultGridSize."}
// @input Component.Text gridSizeText {"hint":"Text to display current grid size (optional)"}
// @input float minGridSize = 3 {"hint":"Minimum grid size"}
// @input float maxGridSize = 21 {"hint":"Maximum grid size"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/CursorPlaneController");
Object.setPrototypeOf(script, Module.CursorPlaneController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("cursorPlane", []);
    checkUndefined("regionHoverPlane", []);
    checkUndefined("sampledColorText", []);
    checkUndefined("sampleColorIndicator", []);
    checkUndefined("sampleRegionIndicator", []);
    checkUndefined("defaultGridSize", []);
    checkUndefined("cameraCropPath", []);
    checkUndefined("paletteController", []);
    checkUndefined("gridSizeSlider", []);
    checkUndefined("gridSizeText", []);
    checkUndefined("minGridSize", []);
    checkUndefined("maxGridSize", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
