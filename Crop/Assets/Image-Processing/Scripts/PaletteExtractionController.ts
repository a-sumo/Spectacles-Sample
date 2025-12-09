import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";

/**
 * PaletteExtractionController
 *
 * Manages a single palette extraction scanner (enforces only 1 instance).
 * Uses the existing PictureBehavior prefab.
 *
 * When user creates a scanner via two-hand pinch:
 * 1. Destroys any existing scanner
 * 2. Creates new scanner from prefab
 * 3. When scanner is finalized (pinches released), captures the crop texture
 * 4. Sets that texture on the PipelineTester and runs the full pipeline
 *
 * Works with PipelineTester as the orchestrator.
 */
@component
export class PaletteExtractionController extends BaseScriptComponent {
    @input
    @hint("Scanner prefab with PictureBehavior")
    scannerPrefab: ObjectPrefab;

    @input
    @hint("Reference to ImagePipeline (the orchestrator)")
    imagePipeline: ScriptComponent;

    @input
    @hint("Auto-run pipeline when texture is ready")
    autoRun: boolean = true;

    @input
    @hint("Auto-create scanner in editor for testing")
    editorTest: boolean = false;

    private isEditor = global.deviceInfoSystem.isEditor();
    private rightHand: any = null;
    private leftHand: any = null;
    private leftDown = false;
    private rightDown = false;

    // Current scanner (only 1 allowed)
    private activeScanner: SceneObject | null = null;
    private activeBehavior: any = null;
    private capturedTexture: Texture | null = null;
    private isCapturing = false;

    // Events
    private _onScannerCreatedEvent = new Event<SceneObject>();
    public readonly onScannerCreated: PublicApi<SceneObject> = this._onScannerCreatedEvent.publicApi();

    private _onTextureReadyEvent = new Event<Texture>();
    public readonly onTextureReady: PublicApi<Texture> = this._onTextureReadyEvent.publicApi();

    private static instance: PaletteExtractionController | null = null;

    onAwake() {
        PaletteExtractionController.instance = this;
        this.createEvent("OnStartEvent").bind(() => this.initialize());
    }

    public static getInstance(): PaletteExtractionController | null {
        return PaletteExtractionController.instance;
    }

    private initialize(): void {
        this.rightHand = SIK.HandInputData.getHand("right");
        this.leftHand = SIK.HandInputData.getHand("left");

        this.rightHand.onPinchUp.add(this.rightPinchUp);
        this.rightHand.onPinchDown.add(this.rightPinchDown);
        this.leftHand.onPinchUp.add(this.leftPinchUp);
        this.leftHand.onPinchDown.add(this.leftPinchDown);

        // In editor, auto-create scanner for testing if editorTest is enabled
        if (this.isEditor && this.editorTest) {
            const delay = this.createEvent("DelayedCallbackEvent");
            delay.bind(() => this.startScanning());
            delay.reset(0.2);
        }

        print("PaletteExtractionController: Initialized");
    }

    /**
     * Public API: Start the scanning process
     * Creates a scanner and waits for user to define the crop region
     */
    public startScanning(): SceneObject | null {
        print("PaletteExtractionController: Starting scan...");
        return this.createScanner();
    }

    private leftPinchDown = () => {
        this.leftDown = true;
        this.checkAndCreate();
    };

    private leftPinchUp = () => {
        this.leftDown = false;
    };

    private rightPinchDown = () => {
        this.rightDown = true;
        this.checkAndCreate();
    };

    private rightPinchUp = () => {
        this.rightDown = false;
    };

    private checkAndCreate(): void {
        if (this.leftDown && this.rightDown && this.isPinchClose()) {
            this.createScanner();
        }
    }

    private isPinchClose(): boolean {
        try {
            const leftThumb = this.leftHand?.thumbTip?.position;
            const rightThumb = this.rightHand?.thumbTip?.position;
            if (!leftThumb || !rightThumb) return false;
            return leftThumb.distance(rightThumb) < 10;
        } catch (e) {
            return false;
        }
    }

    /**
     * Create a new scanner, destroying any existing one
     */
    public createScanner(): SceneObject | null {
        if (!this.scannerPrefab) {
            print("PaletteExtractionController: No scanner prefab");
            return null;
        }

        // Destroy existing
        this.destroyScanner();

        // Create new
        const parent = this.getSceneObject();
        this.activeScanner = this.scannerPrefab.instantiate(parent);

        if (!this.activeScanner) {
            print("PaletteExtractionController: Failed to instantiate");
            return null;
        }

        this.activeScanner.name = "PaletteScanner_Active";

        // Find the behavior
        this.activeBehavior = this.findBehavior(this.activeScanner);
        this.isCapturing = true;

        // Monitor for capture completion
        this.monitorCapture();

        this._onScannerCreatedEvent.invoke(this.activeScanner);
        print("PaletteExtractionController: Scanner created");

        return this.activeScanner;
    }

    private findBehavior(obj: SceneObject): any {
        const scripts = obj.getComponents("Component.ScriptComponent");
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i] as any;
            // Look for PictureBehavior by checking for its properties
            if (script && script.cropRegion !== undefined && script.screenCropTexture !== undefined) {
                return script;
            }
        }

        // Check children
        for (let i = 0; i < obj.getChildrenCount(); i++) {
            const found = this.findBehavior(obj.getChild(i));
            if (found) return found;
        }

        return null;
    }

    private monitorCapture(): void {
        if (!this.activeBehavior || !this.isCapturing) {
            return;
        }

        const checkCapture = () => {
            if (!this.activeScanner || !this.activeBehavior || !this.isCapturing) return;

            try {
                const cropRegion = this.activeBehavior.cropRegion;
                // CropRegion.enabled becomes false when capture is finalized
                if (cropRegion && cropRegion.enabled === false) {
                    this.isCapturing = false;
                    this.onCaptureFinalized();
                    return;
                }
            } catch (e) {
                // Scanner destroyed
                this.isCapturing = false;
                return;
            }

            // Keep polling
            const delay = this.createEvent("DelayedCallbackEvent");
            delay.bind(checkCapture);
            delay.reset(0.1);
        };

        // Start polling after a short delay
        const delay = this.createEvent("DelayedCallbackEvent");
        delay.bind(checkCapture);
        delay.reset(0.5);
    }

    private onCaptureFinalized(): void {
        print("PaletteExtractionController: Capture finalized");

        if (!this.activeBehavior) return;

        // Try to get the captured texture from captureRendMesh first (already processed)
        // Otherwise fall back to screenCropTexture
        let texture: Texture | null = null;

        // Check if captureRendMesh has the captured image
        const captureRendMesh = this.activeBehavior.captureRendMesh as RenderMeshVisual;
        if (captureRendMesh?.mainPass?.captureImage) {
            texture = captureRendMesh.mainPass.captureImage;
            print("PaletteExtractionController: Using captureImage from mesh");
        } else {
            // Fall back to screenCropTexture
            const screenCropTexture = this.activeBehavior.screenCropTexture;
            if (screenCropTexture) {
                texture = ProceduralTextureProvider.createFromTexture(screenCropTexture);
                print("PaletteExtractionController: Using screenCropTexture");
            }
        }

        if (!texture) {
            print("PaletteExtractionController: No texture found");
            return;
        }

        this.capturedTexture = texture;
        print(`PaletteExtractionController: Captured texture ${this.capturedTexture.getWidth()}x${this.capturedTexture.getHeight()}`);

        this._onTextureReadyEvent.invoke(this.capturedTexture);

        if (this.autoRun) {
            this.runPipelineWithCapturedTexture();
        }
    }

    private runPipelineWithCapturedTexture(): void {
        if (!this.capturedTexture) {
            print("PaletteExtractionController: No captured texture");
            return;
        }

        if (!this.imagePipeline) {
            print("PaletteExtractionController: No imagePipeline assigned");
            return;
        }

        const pipeline = this.imagePipeline as any;

        // Set the captured texture and run the pipeline
        print("PaletteExtractionController: Running pipeline with captured texture");
        pipeline.setInputTexture(this.capturedTexture, true); // true = auto-run
    }

    /**
     * Destroy the current scanner
     */
    public destroyScanner(): void {
        this.isCapturing = false;
        if (this.activeScanner) {
            try {
                this.activeScanner.destroy();
            } catch (e) {}
            this.activeScanner = null;
            this.activeBehavior = null;
            print("PaletteExtractionController: Scanner destroyed");
        }
    }

    /**
     * Re-run the pipeline with the current captured texture
     */
    public refresh(): void {
        if (this.capturedTexture) {
            this.runPipelineWithCapturedTexture();
        } else {
            print("PaletteExtractionController: No captured texture to refresh");
        }
    }

    /**
     * Get the captured texture
     */
    public getCapturedTexture(): Texture | null {
        return this.capturedTexture;
    }

    /**
     * Check if scanner exists
     */
    public hasScanner(): boolean {
        return this.activeScanner !== null;
    }

    /**
     * Get the scanner
     */
    public getScanner(): SceneObject | null {
        return this.activeScanner;
    }
}
