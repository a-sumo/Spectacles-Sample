import { InteractionManager } from "SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"

@component
export class NewScript extends BaseScriptComponent {
    @input 
    prefab: ObjectPrefab;
    
    @input
    spacing: number = 20; // Distance between objects
    
    private objectList: SceneObject[] = [];
    private activeObject: SceneObject = null;
    private interactionManager = InteractionManager.getInstance();
    private primaryInteractor: Interactor | null = null;
    private originalMaterials: Map<SceneObject, Material> = new Map();
    
    onAwake() {
        // Spawn 2x2x2 grid (8 objects total)
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                for (let z = 0; z < 2; z++) {
                    let obj = this.prefab.instantiate(this.getSceneObject());
                    
                    // Position the object in the grid
                    let transform = obj.getTransform();
                    transform.setLocalPosition(new vec3(
                        x * this.spacing - this.spacing / 2,
                        y * this.spacing - this.spacing / 2,
                        z * this.spacing - this.spacing / 2
                    ));
                    
                    // Store original material
                    let renderMesh = obj.getComponent("Component.RenderMeshVisual");
                    if (renderMesh) {
                        this.originalMaterials.set(obj, renderMesh.mainMaterial);
                    }
                    
                    this.objectList.push(obj);
                }
            }
        }
        
        this.createEvent("UpdateEvent").bind(this.update.bind(this));
    }
    
    update() {
        this.primaryInteractor = this.interactionManager.getTargetingInteractors()[0];
        
        // Reset all objects to original color first
        for (let i = 0; i < this.objectList.length; i++) {
            let obj = this.objectList[i];
            let renderMesh = obj.getComponent("Component.RenderMeshVisual");
            if (renderMesh && this.originalMaterials.has(obj)) {
                renderMesh.mainMaterial = this.originalMaterials.get(obj);
            }
        }
        
        // Check for interaction and change color to red
        for (let i = 0; i < this.objectList.length; i++) {
            let obj = this.objectList[i];
            let interactable = obj.getComponent(Interactable.getTypeName()) as any;
            
            if (interactable) {
                // Check if this object is currently being hovered or triggered
                if (interactable.hoveringInteractor || interactable.triggeringInteractor) {
                    this.activeObject = obj;
                    
                    // Change color to red
                    let renderMesh = obj.getComponent("Component.RenderMeshVisual");
                    if (renderMesh) {
                        let redMaterial = renderMesh.mainMaterial.clone();
                        redMaterial.mainPass.baseColor = new vec4(1, 0, 0, 1); // Red
                        renderMesh.mainMaterial = redMaterial;
                    }
                    
                    print("Interacting with: " + obj.name);
                }
            }
        }
    }
}