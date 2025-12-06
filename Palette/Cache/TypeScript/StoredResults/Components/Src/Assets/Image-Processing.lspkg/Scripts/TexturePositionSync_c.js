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
// @input Asset.ObjectPrefab objectPrefab
// @input Component.ScriptComponent gamutProjector
// @input Component.VFXComponent vfxComponent
// @input float texWidth = 8
// @input float texHeight = 8
// @input vec3 pos = {0,0,0}
// @input vec3 scale = {1,1,1}
// @input vec3 rot = {0,0,0}
// @input vec3 circleCenter = {0,3,0}
// @input float circleRadius = 5
// @input float circleRotationOffset
// @input float circlePlane = 1 {"hint":"0=XZ, 1=XY, 2=YZ"}
// @input float tweenDuration = 500
// @input float staggerDelay = 30
// @input bool continuousUpdate = true
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
var Module = require("../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/TexturePositionSync");
Object.setPrototypeOf(script, Module.TexturePositionSync.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("objectPrefab", []);
    checkUndefined("gamutProjector", []);
    checkUndefined("vfxComponent", []);
    checkUndefined("texWidth", []);
    checkUndefined("texHeight", []);
    checkUndefined("pos", []);
    checkUndefined("scale", []);
    checkUndefined("rot", []);
    checkUndefined("circleCenter", []);
    checkUndefined("circleRadius", []);
    checkUndefined("circleRotationOffset", []);
    checkUndefined("circlePlane", []);
    checkUndefined("tweenDuration", []);
    checkUndefined("staggerDelay", []);
    checkUndefined("continuousUpdate", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
