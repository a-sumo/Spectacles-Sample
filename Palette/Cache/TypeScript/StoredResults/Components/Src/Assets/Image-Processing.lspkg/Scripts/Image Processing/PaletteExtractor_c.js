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
// @input Asset.Texture inputTexture {"hint":"Input texture to extract palette from"}
// @input float paletteSize = 24 {"hint":"Number of colors to extract"}
// @input float maxIterations = 30 {"hint":"Max iterations for k-means"}
// @input float sampleSize = 5000 {"hint":"Sample size for faster processing"}
// @input Component.ScriptComponent gamutProjector {"hint":"Reference to Projector_Gamut for projection"}
// @input bool debugMode = true
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/Image Processing/PaletteExtractor");
Object.setPrototypeOf(script, Module.PaletteExtractor.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("inputTexture", []);
    checkUndefined("paletteSize", []);
    checkUndefined("maxIterations", []);
    checkUndefined("sampleSize", []);
    checkUndefined("gamutProjector", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
