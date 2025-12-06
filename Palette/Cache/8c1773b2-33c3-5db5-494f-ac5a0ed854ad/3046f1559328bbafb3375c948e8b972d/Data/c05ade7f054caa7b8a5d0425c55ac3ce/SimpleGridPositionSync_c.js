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
// @input Asset.ObjectPrefab objectPrefab {"hint":"Prefab to instantiate for each grid position"}
// @input float gridWidth = 4 {"hint":"Number of columns in grid"}
// @input float gridHeight = 4 {"hint":"Number of rows in grid"}
// @input vec3 pos = {0,0,0} {"hint":"Shader position offset (matches 'pos' in shader)"}
// @input vec3 scale = {1,1,1} {"hint":"Shader scale multiplier (matches 'scale' in shader)"}
// @input vec3 rot = {0,0,0} {"hint":"Shader rotation in degrees (matches 'rot' in shader)"}
// @input Component.VFXComponent vfxComponent {"hint":"VFX component - REQUIRED for world transform"}
// @input vec3 circleCenter = {0,0,0} {"hint":"Center point for circular rest layout"}
// @input float circleRadius = 1 {"hint":"Radius of the circle"}
// @input float circleRotationOffset {"hint":"Rotation offset for circle (degrees)"}
// @input float circlePlane {"hint":"Plane for circle: 0=XZ (horizontal), 1=XY (vertical), 2=YZ"}
// @input bool atParticlePositions {"hint":"TRUE = at VFX particle positions, FALSE = at circular rest positions"}
// @input float tweenDuration = 500 {"hint":"Tween duration in milliseconds"}
// @input float staggerDelay = 30 {"hint":"Stagger delay between objects (ms)"}
// @input bool continuousUpdate = true {"hint":"Update positions every frame (for moving VFX)"}
// @input bool debugMode = true {"hint":"Log debug info"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Image-Processing.lspkg/Scripts/SimpleGridPositionSync");
Object.setPrototypeOf(script, Module.SimpleGridPositionSync.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("objectPrefab", []);
    checkUndefined("gridWidth", []);
    checkUndefined("gridHeight", []);
    checkUndefined("pos", []);
    checkUndefined("scale", []);
    checkUndefined("rot", []);
    checkUndefined("vfxComponent", []);
    checkUndefined("circleCenter", []);
    checkUndefined("circleRadius", []);
    checkUndefined("circleRotationOffset", []);
    checkUndefined("circlePlane", []);
    checkUndefined("atParticlePositions", []);
    checkUndefined("tweenDuration", []);
    checkUndefined("staggerDelay", []);
    checkUndefined("continuousUpdate", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
