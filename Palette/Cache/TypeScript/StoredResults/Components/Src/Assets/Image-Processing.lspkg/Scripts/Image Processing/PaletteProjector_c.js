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
// @input Asset.Texture inputTexture {"hint":"Input image to process"}
// @input SceneObject outputMesh {"hint":"Mesh to display output"}
// @input Asset.Material outputMaterial {"hint":"Material for output (needs baseTex property)"}
// @input float paletteSize = 12 {"hint":"Number of colors to extract"}
// @input vec3 pig0 = {1,1,1} {"hint":"Pigment 1: Titanium White", "widget":"color"}
// @input vec3 pig1 = {0.08,0.08,0.08} {"hint":"Pigment 2: Ivory Black", "widget":"color"}
// @input vec3 pig2 = {1,0.92,0} {"hint":"Pigment 3: Cadmium Yellow", "widget":"color"}
// @input vec3 pig3 = {0.89,0,0.13} {"hint":"Pigment 4: Cadmium Red", "widget":"color"}
// @input vec3 pig4 = {0.1,0.1,0.7} {"hint":"Pigment 5: Ultramarine Blue", "widget":"color"}
// @input vec3 pig5 = {0,0.47,0.44} {"hint":"Pigment 6: Viridian Green", "widget":"color"}
// @input float mixSteps = 12 {"hint":"Mix resolution (higher = more gamut colors)"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/Image Processing/PaletteProjector");
Object.setPrototypeOf(script, Module.PaletteProjector.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("inputTexture", []);
    checkUndefined("outputMesh", []);
    checkUndefined("outputMaterial", []);
    checkUndefined("paletteSize", []);
    checkUndefined("pig0", []);
    checkUndefined("pig1", []);
    checkUndefined("pig2", []);
    checkUndefined("pig3", []);
    checkUndefined("pig4", []);
    checkUndefined("pig5", []);
    checkUndefined("mixSteps", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
