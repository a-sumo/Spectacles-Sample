import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

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
    
    public onActiveScannerChanged = new Event<ActiveScannerEvent>();
    
    private static instance: PictureController | null = null;
    
    onAwake() {
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
        
        this.createEvent("UpdateEvent").bind(this.update.bind(this));
    }
    
    public static getInstance(): PictureController | null {
        return PictureController.instance;
    }
    
    private generateUniqueId(): string {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    update() {
        let previousActiveScanner = this.activeScanner;
        this.activeScanner = null;
        this.activeInteractable = null;
        this.activeScannerId = null;
        
        for (let i = 0; i < this.scannerInstances.length; i++) {
            let scanner = this.scannerInstances[i];
            
            const idMatch = scanner.name.match(/Scanner_(\w+)/);
            if (!idMatch || !idMatch[1]) continue;
            
            const scannerId = idMatch[1];
            const data = this.scannerData.get(scannerId);
            if (!data) continue;
            
            let interactableObj = data.interactableObject;
            if (interactableObj) {
                let interactable = interactableObj.getComponent(Interactable.getTypeName()) as any;
                
                if (interactable && (interactable.hoveringInteractor || interactable.triggeringInteractor)) {
                    this.activeScanner = scanner;
                    this.activeInteractable = interactableObj;
                    this.activeScannerId = scannerId;
                    break;
                }
            }
        }
        
        if (previousActiveScanner !== this.activeScanner) {
            this.onActiveScannerChanged.invoke(
                new ActiveScannerEvent(this.activeScanner, this.activeInteractable, this.activeScannerId)
            );
        }
    }
    
    private findInteractableInScanner(scanner: SceneObject): SceneObject | null {
        if (!this.interactablePath) return scanner;
        
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
                print("PictureController: Could not find path part '" + part + "'");
                return null;
            }
        }
        
        return current;
    }
    
    public getActiveScanner(): SceneObject | null {
        return this.activeScanner;
    }
    
    public getActiveInteractable(): SceneObject | null {
        return this.activeInteractable;
    }
    
    public getActiveScannerId(): string | null {
        return this.activeScannerId;
    }
    
    public getScannerData(scannerId: string): ScannerData | undefined {
        return this.scannerData.get(scannerId);
    }
    
    editorTest() {
        this.createScanner();
    }
    
    private leftPinchDown = () => {
        this.leftDown = true;
        if (this.rightDown && this.isPinchClose()) {
            this.createScanner();
        }
    };
    
    private leftPinchUp = () => {
        this.leftDown = false;
    };
    
    private rightPinchDown = () => {
        this.rightDown = true;
        if (this.leftDown && this.isPinchClose()) {
            this.createScanner();
        }
    };
    
    private rightPinchUp = () => {
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
        const scannerId = this.generateUniqueId();
        var scanner = this.scannerPrefab.instantiate(this.getSceneObject());
        scanner.name = `Scanner_${scannerId}`;
        
        const interactableObj = this.findInteractableInScanner(scanner);
        
        this.scannerData.set(scannerId, {
            id: scannerId,
            creationTime: getTime(),
            interactableObject: interactableObj
        });
        
        this.scannerInstances.push(scanner);
        
        print('Scanner created with ID: ' + scannerId + ' (Total: ' + this.scannerInstances.length + ')');
    }
    
    public removeScanner(scannerId: string): void {
        const data = this.scannerData.get(scannerId);
        if (!data) return;
        
        this.scannerInstances = this.scannerInstances.filter(scanner => {
            const match = scanner.name.match(/Scanner_(\w+)/);
            return !match || match[1] !== scannerId;
        });
        
        this.scannerData.delete(scannerId);
        
        print('Scanner removed: ' + scannerId);
    }
}