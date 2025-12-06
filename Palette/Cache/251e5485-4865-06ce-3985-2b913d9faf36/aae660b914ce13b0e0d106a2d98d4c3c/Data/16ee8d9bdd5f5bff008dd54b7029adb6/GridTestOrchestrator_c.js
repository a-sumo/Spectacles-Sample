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
// @input Component.ScriptComponent gridSync {"hint":"Reference to SimpleGridPositionSync script"}
// @input float autoToggleInterval = 3 {"hint":"Auto-toggle interval (seconds, 0 = disabled)"}
// @input bool autoToggleEnabled = true {"hint":"Start with auto-toggle enabled"}
// @input bool debugMode = true {"hint":"Log state changes"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/GridTestOrchestrator");
Object.setPrototypeOf(script, Module.GridTestOrchestrator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("gridSync", []);
    checkUndefined("autoToggleInterval", []);
    checkUndefined("autoToggleEnabled", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
