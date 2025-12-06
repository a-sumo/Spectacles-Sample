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
// @input Component.VFXComponent vfxComponent {"hint":"VFX component to test decoding"}
// @input float texSize = 8 {"hint":"Texture size (8 = 64 particles for easy debugging)"}
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
var Module = require("../../../../../Modules/Src/Packages/Color-Space.lspkg/Scripts/Test_MinimalEncoder");
Object.setPrototypeOf(script, Module.Test_MinimalEncoder.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("encoderMaterial", []);
    checkUndefined("vfxComponent", []);
    checkUndefined("texSize", []);
    checkUndefined("scale", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
