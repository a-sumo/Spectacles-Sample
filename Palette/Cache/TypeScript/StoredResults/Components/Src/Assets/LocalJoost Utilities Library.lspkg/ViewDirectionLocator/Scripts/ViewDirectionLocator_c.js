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
// @input bool autoStop = true
// @input SceneObject lookDownIndicator
// @input SceneObject locationDisplayer
// @input AssignableType interactable
// @input Component.MeshVisual worldMesh
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/LocalJoost Utilities Library.lspkg/ViewDirectionLocator/Scripts/ViewDirectionLocator");
Object.setPrototypeOf(script, Module.ViewDirectionLocator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("autoStop", []);
    checkUndefined("lookDownIndicator", []);
    checkUndefined("locationDisplayer", []);
    checkUndefined("interactable", []);
    checkUndefined("worldMesh", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
