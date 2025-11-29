import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import { CursorPlaneController } from "./CursorPlaneController";

export class ActiveScannerEvent {
    scanner: SceneObject | null;
    interactableObject: SceneObject | null;
    scannerId: string | null;
    
    constructor(scanner: SceneObject | null, interactableObject: SceneObject | null, scannerId: string | null) {
        this.scanner = scanner;
        this.interactableObject = interactableObject;
        this.scannerId = scannerId;
    }
}

interface ScannerData {
    id: string;
    creationTime: number;
    interactableObject: SceneObject | null;
}

@component
export class PictureController extends BaseScriptComponent {
    @input scannerPrefab: ObjectPrefab;
    
    @input
    @hint("Cursor plane prefab to instantiate on first scanner interaction")
    cursorPlanePrefab: ObjectPrefab;
    
    @input
    @hint("Path to the interactable object within scanner hierarchy (e.g., 'ImageAnchor/CameraCrop')")
    interactablePath: string = "ImageAnchor/CameraCrop";
    
    private isEditor = global.deviceInfoSystem.isEditor();
    private rightHand = SIK.HandInputData.getHand("right");
    private leftHand = SIK.HandInputData.getHand("left");
    private leftDown = false;
    private rightDown = false;
    private scannerInstances: SceneObject[] = [];
    private scannerData: Map<string, ScannerData> = new Map();
    private activeScanner: SceneObject | null = null;
    private activeInteractable: SceneObject | null = null;
    private activeScannerId: string | null = null;
    
    // Cursor plane instance
    private cursorPlaneInstance: SceneObject | null = null;
    private cursorPlaneController: CursorPlaneController | null = null;
    
    // Public event that other components can subscribe to
    public onActiveScannerChanged = new Event<ActiveScannerEvent>();
    
    // Singleton instance
    private static instance: PictureController | null = null;
    
    onAwake() {
        // Set singleton instance
        PictureController.instance = this;
        
        this.rightHand.onPinchUp.add(this.rightPinchUp);
        this.rightHand.onPinchDown.add(this.rightPinchDown);
        this.leftHand.onPinchUp.add(this.leftPinchUp);
        this.leftHand.onPinchDown.add(this.leftPinchDown);
        
        if (this.isEditor) {
            this.createEvent("TouchStartEvent").bind(this.editorTest.bind(this));
        } else {
            var obj = this.getSceneObject();
            if (obj.getChildrenCount() > 0) {
                obj.getChild(0).destroy();    
            }
        }
        
        // Update loop to check for hover state
        this.createEvent("UpdateEvent").bind(this.update.bind(this));
    }
    
    // Singleton getter
    public static getInstance(): PictureController | null {
        return PictureController.instance;
    }
    
    // Helper function to generate a unique ID
    private generateUniqueId(): string {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    update() {
        let previousActiveScanner = this.activeScanner;
        this.activeScanner = null;
        this.activeInteractable = null;
        this.activeScannerId = null;
        
        // Check all scanner instances for hover/interaction
        for (let i = 0; i < this.scannerInstances.length; i++) {
            let scanner = this.scannerInstances[i];
            
            // Extract ID from scanner name
            const idMatch = scanner.name.match(/Scanner_(\w+)/);
            if (!idMatch || !idMatch[1]) {
                print("PictureController: Could not extract ID from scanner name: " + scanner.name);
                continue;
            }
            
            const scannerId = idMatch[1];
            const data = this.scannerData.get(scannerId);
            
            if (!data) {
                print("PictureController: No data found for scanner ID: " + scannerId);
                continue;
            }
            
            let interactableObj = data.interactableObject;
            
            if (interactableObj) {
                let interactable = interactableObj.getComponent(Interactable.getTypeName()) as any;
                
                if (interactable) {
                    if (interactable.hoveringInteractor || interactable.triggeringInteractor) {
                        this.activeScanner = scanner;
                        this.activeInteractable = interactableObj;
                        this.activeScannerId = scannerId;
                        
                        // Instantiate cursor plane on first interaction
                        this.ensureCursorPlaneExists();
                        
                        break; // Only one can be active at a time
                    }
                }
            }
        }
        
        // Fire event if active scanner changed
        if (previousActiveScanner !== this.activeScanner) {
            this.onActiveScannerChanged.invoke(
                new ActiveScannerEvent(this.activeScanner, this.activeInteractable, this.activeScannerId)
            );
            
            if (this.activeScanner) {
                print("Active scanner changed to: " + this.activeScanner.name);
            } else {
                print("No active scanner");
            }
        }
    }
    
    /**
     * Instantiate cursor plane if it doesn't exist yet
     */
    private ensureCursorPlaneExists(): void {
        if (this.cursorPlaneInstance || !this.cursorPlanePrefab) return;
        
        // Instantiate cursor plane as child of this object
        this.cursorPlaneInstance = this.cursorPlanePrefab.instantiate(this.sceneObject);
        this.cursorPlaneInstance.name = "CursorPlane";
        
        // Get the controller component
        this.cursorPlaneController = this.cursorPlaneInstance.getComponent(
            CursorPlaneController.getTypeName()
        ) as CursorPlaneController;
        
        if (this.cursorPlaneController) {
            print("PictureController: Cursor plane instantiated");
        } else {
            print("PictureController: Warning - CursorPlaneController not found on prefab");
        }
    }
    
    /**
     * Find the interactable object within a scanner's hierarchy
     */
    private findInteractableInScanner(scanner: SceneObject): SceneObject | null {
        if (!this.interactablePath) {
            return scanner;
        }
        
        const pathParts = this.interactablePath.split('/');
        let current = scanner;
        
        for (let part of pathParts) {
            let found = false;
            for (let i = 0; i < current.getChildrenCount(); i++) {
                let child = current.getChild(i);
                if (child.name === part) {
                    current = child;
                    found = true;
                    break;
                }
            }
            if (!found) {
                print("PictureController: Could not find path part '" + part + "' in scanner hierarchy");
                return null;
            }
        }
        
        return current;
    }
    
    // Public getter for other components to access current active scanner
    public getActiveScanner(): SceneObject | null {
        return this.activeScanner;
    }
    
    // Public getter for the actual interactable object
    public getActiveInteractable(): SceneObject | null {
        return this.activeInteractable;
    }
    
    // Public getter for active scanner ID
    public getActiveScannerId(): string | null {
        return this.activeScannerId;
    }
    
    // Public getter for scanner data by ID
    public getScannerData(scannerId: string): ScannerData | undefined {
        return this.scannerData.get(scannerId);
    }
    
    // Public getter for cursor plane controller
    public getCursorPlaneController(): CursorPlaneController | null {
        return this.cursorPlaneController;
    }
    
    editorTest() {
        print("Creating Editor Scanner...");
        this.createScanner();
    }
    
    private leftPinchDown = () => {
        print("LEFT Pinch down");
        this.leftDown = true;
        if (this.rightDown && this.isPinchClose()) {
            this.createScanner();
        }
    };
    
    private leftPinchUp = () => {
        print("LEFT Pinch up");
        this.leftDown = false;
    };
    
    private rightPinchDown = () => {
        print("RIGHT Pinch down");
        this.rightDown = true;
        if (this.leftDown && this.isPinchClose()) {
            this.createScanner();
        }
    };
    
    private rightPinchUp = () => {
        print("RIGHT Pinch up");
        this.rightDown = false;
    };
    
    isPinchClose() {
        return (
            this.leftHand.thumbTip.position.distance(
                this.rightHand.thumbTip.position
            ) < 10
        );
    }
    
    createScanner() {
        // Generate unique ID
        const scannerId = this.generateUniqueId();
        
        // Instantiate scanner
        var scanner = this.scannerPrefab.instantiate(this.getSceneObject());
        
        // Set name with ID
        scanner.name = `Scanner_${scannerId}`;
        
        // Find interactable object in hierarchy
        const interactableObj = this.findInteractableInScanner(scanner);
        
        // Store scanner data
        this.scannerData.set(scannerId, {
            id: scannerId,
            creationTime: getTime(),
            interactableObject: interactableObj
        });
        
        // Add to instances list
        this.scannerInstances.push(scanner);
        
        print('Scanner created with ID: ' + scannerId + ' (Total: ' + this.scannerInstances.length + ')');
    }
    
    // Method to remove a scanner by ID
    public removeScanner(scannerId: string): void {
        const data = this.scannerData.get(scannerId);
        if (!data) {
            print("PictureController: Cannot remove scanner - ID not found: " + scannerId);
            return;
        }
        
        // Find and remove from instances array
        this.scannerInstances = this.scannerInstances.filter(scanner => {
            const match = scanner.name.match(/Scanner_(\w+)/);
            return !match || match[1] !== scannerId;
        });
        
        // Remove from data map
        this.scannerData.delete(scannerId);
        
        print('Scanner removed: ' + scannerId);
    }
}