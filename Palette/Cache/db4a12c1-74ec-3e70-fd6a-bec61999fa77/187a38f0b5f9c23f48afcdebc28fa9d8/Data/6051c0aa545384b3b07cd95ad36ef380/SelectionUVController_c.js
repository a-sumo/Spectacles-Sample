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
// @input SceneObject cameraCrop {"hint":"Camera Crop with the material whose selectionUV will be updated."}
// @input vec2 initialUV = {0.5,0.5} {"hint":"Initial selection UV position"}
// @input SceneObject cursorPlane {"hint":"Cursor plane that follows the selection with normal offset. Will be scaled to match cameraCrop's aspect ratio."}
// @input Component.Text sampledColorText {"hint":"Text component to display the sampled color as HEX code"}
// @input SceneObject sampledColorObject {"hint":"Object whose material mainColor will be set to the sampled color"}
// @input float normalOffset = 0.5 {"hint":"Offset distance along the plane's normal direction (positive = towards viewer)"}
// @input vec2 uvOffset = {0,0} {"hint":"Additional offset in UV space (applied before world conversion)"}
// @input float gridSize = 9 {"hint":"Grid size for cursor plane texture (odd number, e.g., 9 = 9x9 grid)"}
// @input bool useFilter = true {"hint":"Apply filtering to smooth interaction"}
// @input float minCutoff = 2 {"hint":"Filter min cutoff - lower = smoother but more lag", "showIf":"useFilter", "showIfValue":true}
// @input float beta = 0.015 {"hint":"Filter beta - higher = less lag but more jitter", "showIf":"useFilter", "showIfValue":true}
// @input float dcutoff = 1 {"hint":"Filter derivative cutoff", "showIf":"useFilter", "showIfValue":true}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/SelectionUVController");
Object.setPrototypeOf(script, Module.SelectionUVController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("cameraCrop", []);
    checkUndefined("initialUV", []);
    checkUndefined("cursorPlane", []);
    checkUndefined("sampledColorText", []);
    checkUndefined("sampledColorObject", []);
    checkUndefined("normalOffset", []);
    checkUndefined("uvOffset", []);
    checkUndefined("gridSize", []);
    checkUndefined("useFilter", []);
    checkUndefined("minCutoff", [["useFilter",true]]);
    checkUndefined("beta", [["useFilter",true]]);
    checkUndefined("dcutoff", [["useFilter",true]]);
    if (script.onAwake) {
       script.onAwake();
    }
});
