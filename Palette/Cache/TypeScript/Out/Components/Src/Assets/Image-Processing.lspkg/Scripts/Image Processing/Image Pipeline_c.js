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
// @input Component.ScriptComponent paletteExtractor
// @input Component.ScriptComponent gamutProjector
// @input Component.ScriptComponent imageRegenerator
// @input Asset.Texture inputTexture
// @input float paletteSize = 24 {"hint":"Number of colors to extract"}
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
var Module = require("../../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/Image Processing/Image Pipeline");
Object.setPrototypeOf(script, Module.ImagePipeline.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("paletteExtractor", []);
    checkUndefined("gamutProjector", []);
    checkUndefined("imageRegenerator", []);
    checkUndefined("inputTexture", []);
    checkUndefined("paletteSize", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
