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
// @input Asset.Material encoderMaterial {"hint":"Material with Encoder_PigmentMixHiRes shader"}
// @input Component.VFXComponent vfxComponent {"hint":"VFX component to receive textures"}
// @input float texSize = 128 {"hint":"Output texture size (128 = 16384 pixels)"}
// @input float mixSteps = 32 {"hint":"Mix steps between pigments (higher = more colors)"}
// @input float scale = 100 {"hint":"Scale for VFX positions"}
// @input vec3 pig0Color = {1,1,1} {"widget":"color"}
// @input vec3 pig1Color = {0.08,0.08,0.08} {"widget":"color"}
// @input vec3 pig2Color = {1,0.92,0} {"widget":"color"}
// @input vec3 pig3Color = {0.89,0,0.13} {"widget":"color"}
// @input vec3 pig4Color = {0.1,0.1,0.7} {"widget":"color"}
// @input vec3 pig5Color = {0,0.47,0.44} {"widget":"color"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Packages/Color-Space.lspkg/Scripts/Encoder_PigmentMixHiRes");
Object.setPrototypeOf(script, Module.Encoder_PigmentMixHiRes.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("encoderMaterial", []);
    checkUndefined("vfxComponent", []);
    checkUndefined("texSize", []);
    checkUndefined("mixSteps", []);
    checkUndefined("scale", []);
    checkUndefined("pig0Color", []);
    checkUndefined("pig1Color", []);
    checkUndefined("pig2Color", []);
    checkUndefined("pig3Color", []);
    checkUndefined("pig4Color", []);
    checkUndefined("pig5Color", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
