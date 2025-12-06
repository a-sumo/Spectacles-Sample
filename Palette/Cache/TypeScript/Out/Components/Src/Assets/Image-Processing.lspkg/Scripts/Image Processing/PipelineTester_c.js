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
// @input Component.ScriptComponent paletteExtractor {"hint":"PaletteExtractor script"}
// @input Component.ScriptComponent gamutProjector {"hint":"Projector_Gamut script"}
// @input Component.ScriptComponent imageRegenerator {"hint":"ImageRegenerator script"}
// @input Asset.Texture testImage {"hint":"Test image for extraction"}
// @input float extractColors = 12 {"hint":"Number of colors to extract"}
// @input SceneObject previewMesh {"hint":"SceneObject with RenderMeshVisual to display output"}
// @input SceneObject originalMesh {"hint":"Also show original on a second mesh"}
// @input float testMode {"hint":"Which test to run: 0=none, 1=extraction, 2=projection, 3=regeneration, 4=full"}
// @input bool autoRun {"hint":"Auto-run test on start"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/Image Processing/PipelineTester");
Object.setPrototypeOf(script, Module.PipelineTester.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("paletteExtractor", []);
    checkUndefined("gamutProjector", []);
    checkUndefined("imageRegenerator", []);
    checkUndefined("testImage", []);
    checkUndefined("extractColors", []);
    checkUndefined("previewMesh", []);
    checkUndefined("originalMesh", []);
    checkUndefined("testMode", []);
    checkUndefined("autoRun", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
