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
// @input Asset.Material remapMaterial {"hint":"Material with PaletteRemap shader"}
// @input Asset.Texture inputTexture {"hint":"Input image texture"}
// @input bool enableDither = true {"hint":"Enable ordered dithering"}
// @input float ditherStrength = 0.15 {"hint":"Dithering strength 0-1"}
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
var Module = require("../../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/Image Processing/Image Regenerator");
Object.setPrototypeOf(script, Module.ImageRegenerator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("remapMaterial", []);
    checkUndefined("inputTexture", []);
    checkUndefined("enableDither", []);
    checkUndefined("ditherStrength", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
