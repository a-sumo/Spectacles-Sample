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
// @input Asset.Material encoderMaterial {"hint":"Material with encoder Code Node"}
// @input Component.VFXComponent vfxComponent {"hint":"VFX component to receive textures"}
// @input float texSize = 64 {"hint":"Texture size (64 = 4096 pixels)"}
// @input float rgbRes = 16 {"hint":"RGB resolution (16 = 16³ = 4096 points)"}
// @input float scale = 100 {"hint":"Scale for VFX positions"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Color-Space.lspkg/Scripts/Encoder_RGBCube");
Object.setPrototypeOf(script, Module.Encoder_RGBCube.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("encoderMaterial", []);
    checkUndefined("vfxComponent", []);
    checkUndefined("texSize", []);
    checkUndefined("rgbRes", []);
    checkUndefined("scale", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
