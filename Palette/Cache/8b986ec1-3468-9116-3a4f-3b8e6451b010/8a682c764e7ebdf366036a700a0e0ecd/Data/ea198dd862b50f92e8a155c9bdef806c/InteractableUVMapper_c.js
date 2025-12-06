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
// @input bool clampToBounds = true {"hint":"Should UV coordinates be clamped to 0-1 range?"}
// @input string cameraCropPath = "ImageAnchor/CameraCrop" {"hint":"Path to cameraCrop within scanner hierarchy (e.g., 'ImageAnchor/CameraCrop')"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/InteractableUVMapper");
Object.setPrototypeOf(script, Module.InteractableUVMapper.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("clampToBounds", []);
    checkUndefined("cameraCropPath", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
