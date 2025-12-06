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
// @input float gridScale = 9 {"hint":"Grid size (odd number). E.g., 9 = 9x9 grid with center pixel in middle"}
// @input Asset.Texture screenCropTexture {"hint":"The source screen texture to capture snapshots from"}
// @input SceneObject cropAreaMesh {"hint":"Mesh displaying the cropped pixel grid"}
// @input SceneObject selectedPixelMesh {"hint":"Mesh displaying the currently selected color"}
// @input AssignableType snapshotButton {"hint":"Button to trigger snapshot capture"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/CropAreaSelector");
Object.setPrototypeOf(script, Module.CropAreaSelector.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("gridScale", []);
    checkUndefined("screenCropTexture", []);
    checkUndefined("cropAreaMesh", []);
    checkUndefined("selectedPixelMesh", []);
    checkUndefined("snapshotButton", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
