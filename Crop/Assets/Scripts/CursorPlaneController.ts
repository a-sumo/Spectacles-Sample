import { InteractableUVMapper } from "./InteractableUVMapper";
import { PictureController, ActiveScannerEvent } from "./PictureController";

/**
 * CursorPlaneController
 * 
 * Manages cursor plane visuals and position based on UV coordinates.
 * Also updates the active scanner's cameraCrop material with selectionUV.
 * Attached to the cursor plane prefab.
 * Lifecycle (instantiation/destruction) managed by PictureController.
 */
@component
export class CursorPlaneController extends BaseScriptComponent {
    @input
    @hint("Text component to display the sampled color as HEX code")
    sampledColorText: Text;

    @input
    @hint("Object whose material mainColor will be set to the sampled color")
    sampledColorObject: SceneObject;

    @input
    @hint("Offset distance along the plane's normal direction (positive = towards viewer)")
    normalOffset: number = 0.5;

    @input
    @hint("Additional offset in UV space (applied before world conversion)")
    uvOffset: vec2 = new vec2(0, 0);

    @input
    @hint("Grid size for cursor plane texture (odd number, e.g., 9 = 9x9 grid)")
    gridSize: number = 9;

    // State
    private pictureController: PictureController | null = null;
    private uvMapper: InteractableUVMapper | null = null;
    private activeCameraCrop: SceneObject | null = null;
    private activeCameraCropTransform: Transform | null = null;
    private activeCameraCropMaterial: any = null;
    
    // Cursor plane references (this script is attached to the cursor plane itself)
    private cursorPlaneTransform: Transform;
    private cursorPlaneOriginalScale: vec3 = vec3.one();
    private cursorPlaneMaterial: any = null;
    private cursorPlaneRenderMesh: RenderMeshVisual | null = null;
    
    // Sampled color references
    private sampledColorMaterial: any = null;
    
    // Validated grid size
    private validatedGridSize: number = 9;

    onAwake() {
        // This script is attached to the cursor plane itself
        this.cursorPlaneTransform = this.sceneObject.getTransform();
        this.cursorPlaneOriginalScale = this.cursorPlaneTransform.getLocalScale();
        
        // Get controllers via singleton
        this.pictureController = PictureController.getInstance();
        
        if (!this.pictureController) {
            print("CursorPlaneController: PictureController singleton not found");
            return;
        }

        // Find UV mapper - should be on PictureController's object
        const pictureControllerObject = this.pictureController.getSceneObject();
        this.uvMapper = pictureControllerObject.getComponent(
            InteractableUVMapper.getTypeName()
        ) as InteractableUVMapper;

        if (!this.uvMapper) {
            print("CursorPlaneController: InteractableUVMapper not found");
            return;
        }

        // Validate grid size
        this.validatedGridSize = this.computeValidGridSize();

        // Setup cursor plane rendering
        this.setupCursorPlane();

        // Setup sampled color object
        this.setupSampledColorObject();

        // Subscribe to events
        this.pictureController.onActiveScannerChanged.add(this.onActiveScannerChanged.bind(this));
        this.uvMapper.onUVChanged.add(this.onUVChanged.bind(this));

        // Initially hide cursor plane
        this.setCursorPlaneVisible(false);
        
        print("CursorPlaneController: Initialized");
    }

    private computeValidGridSize(): number {
        let size = Math.max(1, Math.floor(this.gridSize));
        if (size % 2 === 0) {
            size += 1; // Ensure odd number for center pixel
        }
        return size;
    }

    private setupCursorPlane() {
        this.cursorPlaneRenderMesh = this.sceneObject.getComponent("RenderMeshVisual");
        if (this.cursorPlaneRenderMesh) {
            this.cursorPlaneMaterial = this.cursorPlaneRenderMesh.mainPass;
            if (this.cursorPlaneMaterial) {
                this.cursorPlaneMaterial.gridScale = this.validatedGridSize;
            }
        }
    }

    private setupSampledColorObject() {
        if (!this.sampledColorObject) return;

        const colorRenderMesh = this.sampledColorObject.getComponent("RenderMeshVisual");
        if (colorRenderMesh) {
            this.sampledColorMaterial = colorRenderMesh.mainPass;
        }
    }

    private onActiveScannerChanged(event: ActiveScannerEvent) {
        // Update reference to active scanner's cameraCrop
        // Get it from the UV mapper which has already found it
        this.activeCameraCrop = this.uvMapper ? this.uvMapper.getActiveCameraCrop() : null;
        
        if (this.activeCameraCrop) {
            this.activeCameraCropTransform = this.activeCameraCrop.getTransform();
            
            // Get the material from cameraCrop
            const renderMesh = this.activeCameraCrop.getComponent("RenderMeshVisual");
            if (renderMesh) {
                this.activeCameraCropMaterial = renderMesh.mainPass;
            }
            
            // Show cursor plane when scanner is active
            this.setCursorPlaneVisible(true);
            
            // Update position immediately to the new scanner
            const currentUV = this.uvMapper.getCurrentUV();
            this.updateCursorPlane(currentUV);
            
            print("CursorPlaneController: Tracking scanner " + event.scannerId);
        } else {
            // Hide cursor plane when no scanner is active
            this.setCursorPlaneVisible(false);
            this.activeCameraCropTransform = null;
            this.activeCameraCropMaterial = null;
            
            print("CursorPlaneController: No active scanner");
        }
    }

    private onUVChanged(uv: vec2) {
        if (!this.activeCameraCropTransform) return;

        // Update cursor plane position, scale, and texture
        this.updateCursorPlane(uv);
    }

    private setCursorPlaneVisible(visible: boolean) {
        if (!this.cursorPlaneRenderMesh) return;
        
        this.cursorPlaneRenderMesh.enabled = visible;
        
        // Also hide/show sampled color display if present
        if (this.sampledColorObject) {
            const renderMesh = this.sampledColorObject.getComponent("RenderMeshVisual");
            if (renderMesh) {
                renderMesh.enabled = visible;
            }
        }
        
        if (this.sampledColorText) {
            this.sampledColorText.enabled = visible;
        }
    }

    /**
     * Update cursor plane position, scale, and texture based on UV
     * Position is relative to the active scanner's cameraCrop
     */
    private updateCursorPlane(uv: vec2): void {
        if (!this.activeCameraCropTransform) return;

        // CRITICAL: Update the cameraCrop material's selectionUV parameter
        // This is what drives the shader to show the selection indicator
        if (this.activeCameraCropMaterial) {
            this.activeCameraCropMaterial.selectionUV = uv;
        }

        // Get the world scale of the cameraCrop (the texture plane)
        const cameraCropScale = this.activeCameraCropTransform.getWorldScale();

        // Apply UV offset before converting to world position
        const offsetUV = new vec2(
            uv.x + this.uvOffset.x,
            uv.y + this.uvOffset.y
        );

        // Convert UV (0-1) to local position on the cameraCrop plane
        // UV (0.5, 0.5) = center = local (0, 0)
        const localX = (offsetUV.x - 0.5) * cameraCropScale.x;
        const localY = (offsetUV.y - 0.5) * cameraCropScale.y;
        const localPos = new vec3(localX, localY, 0);

        // Transform to world position using cameraCrop's rotation and position
        const worldRotation = this.activeCameraCropTransform.getWorldRotation();
        const worldPosition = this.activeCameraCropTransform.getWorldPosition();
        let cursorPosition = worldPosition.add(worldRotation.multiplyVec3(localPos));

        // Add normal offset along cameraCrop's forward direction
        const planeNormal = worldRotation.multiplyVec3(vec3.forward());
        cursorPosition = cursorPosition.add(planeNormal.uniformScale(this.normalOffset));

        // Set the cursor plane's world position
        this.cursorPlaneTransform.setWorldPosition(cursorPosition);

        // Match the rotation of the cameraCrop
        this.cursorPlaneTransform.setWorldRotation(worldRotation);

        // Compensate cursor plane scale for cameraCrop's aspect ratio
        const aspectRatioCompensation = cameraCropScale.y / cameraCropScale.x;
        this.cursorPlaneTransform.setLocalScale(new vec3(
            this.cursorPlaneOriginalScale.x * aspectRatioCompensation,
            this.cursorPlaneOriginalScale.y,
            this.cursorPlaneOriginalScale.z
        ));

        // Update cursor plane texture with sampled grid from source texture
        this.updateCursorPlaneTexture(uv);
    }

    /**
     * Samples a gridSize x gridSize region from the source texture centered at UV
     */
    private updateCursorPlaneTexture(uv: vec2): void {
        if (!this.cursorPlaneMaterial || !this.activeCameraCropMaterial) return;

        // Get source texture from cameraCrop's material
        const sourceTexture: Texture = this.activeCameraCropMaterial.captureImage;
        if (!sourceTexture) return;

        const width = sourceTexture.getWidth();
        const height = sourceTexture.getHeight();
        if (width <= 0 || height <= 0) return;

        const gridSize = this.validatedGridSize;
        const halfGrid = Math.floor(gridSize / 2);

        // Convert UV to pixel coordinates
        const centerPixelX = Math.round(uv.x * (width - 1));
        const centerPixelY = Math.round(uv.y * (height - 1));
        
        // Clamp to ensure we don't sample outside texture bounds
        const startPixelX = Math.max(0, Math.min(width - gridSize, centerPixelX - halfGrid));
        const startPixelY = Math.max(0, Math.min(height - gridSize, centerPixelY - halfGrid));

        // Create procedural texture provider for pixel access
        const proceduralTexture = ProceduralTextureProvider.createFromTexture(sourceTexture);
        const sourceProvider = proceduralTexture.control as ProceduralTextureProvider;

        // Sample pixels from source texture
        const pixelBuffer = new Uint8Array(gridSize * gridSize * 4);
        sourceProvider.getPixels(startPixelX, startPixelY, gridSize, gridSize, pixelBuffer);

        // Create output texture and apply sampled pixels
        const sampledTexture = ProceduralTextureProvider.createWithFormat(
            gridSize,
            gridSize,
            TextureFormat.RGBA8Unorm
        );
        const outputProvider = sampledTexture.control as ProceduralTextureProvider;
        outputProvider.setPixels(0, 0, gridSize, gridSize, pixelBuffer);

        // Apply to cursor plane material
        this.cursorPlaneMaterial.mainTexture = sampledTexture;

        // Extract center pixel color and update sampled color display
        this.updateSampledColor(pixelBuffer, gridSize, halfGrid);
    }

    /**
     * Extracts the center pixel color and updates display
     */
    private updateSampledColor(pixelBuffer: Uint8Array, gridSize: number, halfGrid: number): void {
        const ONE_OVER_255 = 0.00392156862;
        
        // Calculate center pixel index in the buffer
        const centerPixelIndex = (halfGrid * gridSize + halfGrid) * 4;

        // Extract RGBA values (0-255)
        const r = pixelBuffer[centerPixelIndex];
        const g = pixelBuffer[centerPixelIndex + 1];
        const b = pixelBuffer[centerPixelIndex + 2];
        const a = pixelBuffer[centerPixelIndex + 3];

        // Update text with hex code
        if (this.sampledColorText) {
            this.sampledColorText.text = this.rgbToHex(r, g, b);
        }

        // Update color object material
        if (this.sampledColorMaterial) {
            const sampledColor = new vec4(
                r * ONE_OVER_255,
                g * ONE_OVER_255,
                b * ONE_OVER_255,
                1.0
            );
            this.sampledColorMaterial.mainColor = sampledColor;
        }
    }

    /**
     * Convert RGB values (0-255) to hex string
     */
    private rgbToHex(r: number, g: number, b: number): string {
        const toHex = (value: number): string => {
            const hex = Math.round(value).toString(16).toUpperCase();
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    // Public API
    public setNormalOffset(offset: number): void {
        this.normalOffset = offset;
    }

    public setUVOffset(offset: vec2): void {
        this.uvOffset = offset;
    }

    public setGridSize(size: number): void {
        this.gridSize = size;
        this.validatedGridSize = this.computeValidGridSize();
        if (this.cursorPlaneMaterial) {
            this.cursorPlaneMaterial.gridScale = this.validatedGridSize;
        }
    }
}