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
// @input Asset.Material material
// @input vec3 pig0Color = {1,1,1} {"widget":"color"}
// @input float pig0Conc = 0.2 {"widget":"slider", "min":0, "max":1, "step":0.01}
// @input vec3 pig1Color = {0.08,0.08,0.08} {"widget":"color"}
// @input float pig1Conc = 0.2 {"widget":"slider", "min":0, "max":1, "step":0.01}
// @input vec3 pig2Color = {1,0.92,0} {"widget":"color"}
// @input float pig2Conc = 0.2 {"widget":"slider", "min":0, "max":1, "step":0.01}
// @input vec3 pig3Color = {0.89,0,0.13} {"widget":"color"}
// @input float pig3Conc = 0.15 {"widget":"slider", "min":0, "max":1, "step":0.01}
// @input vec3 pig4Color = {0.1,0.1,0.7} {"widget":"color"}
// @input float pig4Conc = 0.15 {"widget":"slider", "min":0, "max":1, "step":0.01}
// @input vec3 pig5Color = {0,0.47,0.44} {"widget":"color"}
// @input float pig5Conc = 0.1 {"widget":"slider", "min":0, "max":1, "step":0.01}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Color-Space.lspkg/Scripts/Util_SpectralMix");
Object.setPrototypeOf(script, Module.Util_SpectralMix.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("material", []);
    checkUndefined("pig0Color", []);
    checkUndefined("pig0Conc", []);
    checkUndefined("pig1Color", []);
    checkUndefined("pig1Conc", []);
    checkUndefined("pig2Color", []);
    checkUndefined("pig2Conc", []);
    checkUndefined("pig3Color", []);
    checkUndefined("pig3Conc", []);
    checkUndefined("pig4Color", []);
    checkUndefined("pig4Conc", []);
    checkUndefined("pig5Color", []);
    checkUndefined("pig5Conc", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
