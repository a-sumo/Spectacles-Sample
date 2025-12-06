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
// @input Component.ScriptComponent gamutProjector {"hint":"Reference to Projector_Gamut script"}
// @input SceneObject[] targetObjects {"hint":"SceneObjects to position (one per projected color)"}
// @input vec3 scale = {100,100,100} {"hint":"Scale factor for LAB space (same as VFX)"}
// @input vec3 rotation = {0,0,0} {"hint":"Rotation in degrees (same as VFX)"}
// @input vec3 offset = {0,0,0} {"hint":"World position offset (same as VFX)"}
// @input bool continuousUpdate = true {"hint":"Update positions every frame"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Packages/Color-Space.lspkg/Scripts/Projector_Controller");
Object.setPrototypeOf(script, Module.Projector_Controller.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("gamutProjector", []);
    checkUndefined("targetObjects", []);
    checkUndefined("scale", []);
    checkUndefined("rotation", []);
    checkUndefined("offset", []);
    checkUndefined("continuousUpdate", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
