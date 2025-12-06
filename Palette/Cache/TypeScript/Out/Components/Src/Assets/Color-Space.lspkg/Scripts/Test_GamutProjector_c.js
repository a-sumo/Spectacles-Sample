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
// @input Asset.Material projectionMaterial {"hint":"Material with GamutProjection shader"}
// @input Component.ScriptComponent gamutEncoder {"hint":"Reference to PigmentGamutEncoder script component"}
// @input float gamutTexSize = 64 {"hint":"Size of gamut texture from encoder (e.g., 64 means 64x64 = 4096 pixels)"}
// @input float gamutValidCount = 2000 {"hint":"Actual number of valid colors in gamut (from encoder log)"}
// @input float inputTexWidth = 8 {"hint":"Width of input texture (number of colors to project per row)"}
// @input float inputTexHeight = 8 {"hint":"Height of input texture (number of rows)"}
// @input vec3 input0 = {1,0.5,0} {"widget":"color"}
// @input vec3 input1 = {0,1,0.5} {"widget":"color"}
// @input vec3 input2 = {0.5,0,1} {"widget":"color"}
// @input vec3 input3 = {1,1,0} {"widget":"color"}
// @input vec3 input4 = {0,0.5,0.3} {"widget":"color"}
// @input vec3 input5 = {0.8,0.2,0.2} {"widget":"color"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Color-Space.lspkg/Scripts/Test_GamutProjector");
Object.setPrototypeOf(script, Module.Test_GamutProjector.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("projectionMaterial", []);
    checkUndefined("gamutEncoder", []);
    checkUndefined("gamutTexSize", []);
    checkUndefined("gamutValidCount", []);
    checkUndefined("inputTexWidth", []);
    checkUndefined("inputTexHeight", []);
    checkUndefined("input0", []);
    checkUndefined("input1", []);
    checkUndefined("input2", []);
    checkUndefined("input3", []);
    checkUndefined("input4", []);
    checkUndefined("input5", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
