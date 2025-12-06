"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllScriptComponentsInScene = findAllScriptComponentsInScene;
const SceneObjectUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/SceneObjectUtils");
const SceneObjectUtils_2 = require("SpectaclesInteractionKit.lspkg/Utils/SceneObjectUtils");
function findAllScriptComponentsInScene(scriptClass, maxDepth = SceneObjectUtils_2.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    const foundComponents = [];
    const rootCount = global.scene.getRootObjectsCount();
    try {
        for (let i = 0; i < rootCount; i++) {
            const so = global.scene.getRootObject(i);
            const components = (0, SceneObjectUtils_1.findAllScriptComponentsInChildren)(so, scriptClass, maxDepth);
            if (components && components.length > 0) {
                foundComponents.push(...components);
            }
        }
        return foundComponents.length > 0 ? foundComponents : null;
    }
    catch (error) {
        print("Error while searching for components in scene: " + error);
        return null;
    }
}
//# sourceMappingURL=SceneUtils.js.map