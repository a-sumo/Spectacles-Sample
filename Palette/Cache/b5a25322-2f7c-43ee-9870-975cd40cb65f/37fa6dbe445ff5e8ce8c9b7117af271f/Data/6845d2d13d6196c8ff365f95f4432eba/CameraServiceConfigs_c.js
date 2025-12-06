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
// @input SceneObject cameraObject
// @input Component.Camera leftSpecsCamera
// @input Component.Camera rightSpecsCamera
// @input Asset.Texture screenCropTexture
// @input Asset.Texture deviceCamTexture
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/CameraServiceConfigs");
Object.setPrototypeOf(script, Module.CameraServiceConfig.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("cameraObject", []);
    checkUndefined("leftSpecsCamera", []);
    checkUndefined("rightSpecsCamera", []);
    checkUndefined("screenCropTexture", []);
    checkUndefined("deviceCamTexture", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
