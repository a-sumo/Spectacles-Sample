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
// @input Asset.Texture gamutPosTexture {"hint":"Texture with gamut LAB positions (from encoder)"}
// @input Asset.Texture gamutColorTexture {"hint":"Texture with gamut RGB colors (from encoder)"}
// @input float lutResolution = 32 {"hint":"LUT resolution per axis (32 = 32x32x32 = 32K entries)"}
// @input float gamutTexSize = 64 {"hint":"Gamut texture size (must match encoder)"}
// @input Asset.Material projectionMaterial {"hint":"Material to receive LUT"}
// @input float projectionMethod {"hint":"0 = closest (min ΔE), 1 = hue-preserving"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Packages/Color-Space.lspkg/Scripts/Projector_LUT");
Object.setPrototypeOf(script, Module.Projector_LUT.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("gamutPosTexture", []);
    checkUndefined("gamutColorTexture", []);
    checkUndefined("lutResolution", []);
    checkUndefined("gamutTexSize", []);
    checkUndefined("projectionMaterial", []);
    checkUndefined("projectionMethod", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
