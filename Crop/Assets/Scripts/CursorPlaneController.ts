import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { PictureController, ActiveScannerEvent } from "./PictureController";

/**
 * CursorPlaneController
 *
 * Manages cursor plane visuals and position based on hover interactions.
 * Subscribes directly to the active scanner's Interactable hover events.
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
	sampleColorIndicator: SceneObject;

	@input
	sampleRegionIndicator: SceneObject;

	@input
	@hint(
		"Offset distance along the plane's normal direction (positive = towards viewer)"
	)
	normalOffset: number = 0.5;

	@input
	@hint("Grid size for cursor plane texture (odd number, e.g., 9 = 9x9 grid)")
	gridSize: number = 9;

	@input
	@hint("Path to cameraCrop within scanner hierarchy (e.g., 'ImageAnchor/CameraCrop')")
	cameraCropPath: string = "ImageAnchor/CameraCrop";

	// State
	private pictureController: PictureController | null = null;
	private activeScanner: SceneObject | null = null;
	private activeInteractable: Interactable | null = null;
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

	// Hover state
	private isHovering: boolean = false;

	// Event cleanup
	private unsubscribeInteractable: (() => void)[] = [];

	private aspectRatio: number = 1;

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

		// Validate grid size
		this.validatedGridSize = this.computeValidGridSize();

		// Setup cursor plane rendering
		this.setupCursorPlane();

		// Setup sampled color object
		this.setupsampleColorIndicator();

		// Subscribe to active scanner changes
		this.pictureController.onActiveScannerChanged.add(
			this.onActiveScannerChanged.bind(this)
		);

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
		this.cursorPlaneRenderMesh =
			this.sampleRegionIndicator.getComponent("RenderMeshVisual");
		if (this.cursorPlaneRenderMesh) {
			this.cursorPlaneMaterial = this.cursorPlaneRenderMesh.mainPass;
			if (this.cursorPlaneMaterial) {
				this.cursorPlaneMaterial.gridScale = this.validatedGridSize;
			}
		}
	}

	private setupsampleColorIndicator() {
		if (!this.sampleColorIndicator) return;

		const colorRenderMesh =
			this.sampleColorIndicator.getComponent("RenderMeshVisual");
		if (colorRenderMesh) {
			this.sampledColorMaterial = colorRenderMesh.mainPass;
		}
	}

	private onActiveScannerChanged(event: ActiveScannerEvent) {
		// Cleanup previous interactable events
		this.cleanupInteractableEvents();

		this.activeScanner = event.scanner;

		if (this.activeScanner && event.interactableObject) {
			// Find cameraCrop in scanner hierarchy
			this.activeCameraCrop = this.findCameraCropInScanner(this.activeScanner);
			this.setCursorPlaneVisible(true);
			if (this.activeCameraCrop) {
				print("found active cam prop")
				this.activeCameraCropTransform = this.activeCameraCrop.getTransform();

				// Get the material from cameraCrop
				const renderMesh = this.activeCameraCrop.getComponent("RenderMeshVisual");
				if (renderMesh) {
					this.activeCameraCropMaterial = renderMesh.mainPass;
				}

				// Get the Interactable component from the interactable object (cameraCrop)
				this.activeInteractable = event.interactableObject.getComponent(
					Interactable.getTypeName()
				) as Interactable;

				if (this.activeInteractable) {
					this.setupHoverEvents();
					print("CursorPlaneController: Tracking scanner " + event.scannerId);
				} else {
					print("CursorPlaneController: No Interactable found on cameraCrop");
				}
			} else {
				print("CursorPlaneController: Could not find cameraCrop in hierarchy");
			}
		} else {
			// No active scanner - hide cursor
			this.setCursorPlaneVisible(false);
			this.activeCameraCropTransform = null;
			this.activeCameraCropMaterial = null;
			this.activeCameraCrop = null;
			this.activeInteractable = null;

			print("CursorPlaneController: No active scanner");
		}
	}

	/**
	 * Find the cameraCrop object within a scanner's hierarchy
	 */
	private findCameraCropInScanner(scanner: SceneObject): SceneObject | null {
		if (!this.cameraCropPath) {
			return scanner;
		}

		const pathParts = this.cameraCropPath.split("/");
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
				print(
					"CursorPlaneController: Could not find path part '" +
						part +
						"' in scanner hierarchy"
				);
				return null;
			}
		}

		return current;
	}

	private setupHoverEvents() {
		if (!this.activeInteractable) return;

		// Hover Enter - Show cursor and update position
		this.unsubscribeInteractable.push(
			this.activeInteractable.onHoverEnter((e: InteractorEvent) => {
				if (!e.interactor || !e.interactor.targetHitInfo) return;
				if (!this.activeCameraCropTransform) return;
				const worldPosition = e.interactor.targetHitInfo.hit?.position ?? vec3.zero();

				this.isHovering = true;
				this.setCursorPlaneVisible(true);

				// Update cursor position and texture
				this.updateCursorAtWorldPosition(worldPosition);

				print("CursorPlaneController: Hover started");
			})
		);

		// Hover Update - Continuously update cursor position
		this.unsubscribeInteractable.push(
			this.activeInteractable.onHoverUpdate((e: InteractorEvent) => {
				// if (!this.isHovering) return;
				if (!e.interactor || !e.interactor.targetHitInfo) return;
				if (!this.activeCameraCropTransform) return;

				const worldPosition = e.interactor.targetHitInfo.hit?.position ?? vec3.zero();

				// Update cursor position and texture
				this.updateCursorAtWorldPosition(worldPosition);
			})
		);

		// Hover Exit - Hide cursor
		this.unsubscribeInteractable.push(
			this.activeInteractable.onHoverExit(() => {
				this.isHovering = false;
				// this.setCursorPlaneVisible(false);

				print("CursorPlaneController: Hover ended");
			})
		);
	}

	private cleanupInteractableEvents() {
		this.unsubscribeInteractable.forEach((unsub) => unsub());
		this.unsubscribeInteractable = [];
	}

	/**
	 * Update cursor plane position and texture based on world position from hit info
	 */
	private updateCursorAtWorldPosition(worldPosition: vec3): void {
		if (!this.activeCameraCropTransform) return;

		// Convert world position to UV for texture sampling and material update
		const uv = this.worldToUV(worldPosition);

		// Update cameraCrop material's selectionUV parameter
		// if (this.activeCameraCropMaterial) {
		// 	this.activeCameraCropMaterial.selectionUV = uv;
		// }

		// Position cursor plane at the hit position (with offset)
		this.positionCursorPlane(worldPosition);

		// Update cursor plane texture
		this.updateCursorPlaneTexture(uv);
	}

	/**
	 * Convert world position to UV coordinates on the cameraCrop plane
	 */
	private worldToUV(worldPosition: vec3): vec2 {
		if (!this.activeCameraCropTransform) {
			return new vec2(0.5, 0.5);
		}

		const invertedWorldTransform = this.activeCameraCropTransform.getInvertedWorldTransform();
		const localPos = invertedWorldTransform.multiplyPoint(worldPosition);

		// Clamp to 0-1 range
		const uv = new vec2(
			Math.max(0.0, Math.min(1.0, localPos.x + 0.5)),
			Math.max(0.0, Math.min(1.0, localPos.y + 0.5))
		);

		return uv;
	}

	/**
	 * Position the cursor plane at the given world position with normal offset
	 */
	private positionCursorPlane(worldPosition: vec3): void {
		if (!this.activeCameraCropTransform) return;

		// Get cameraCrop's rotation and scale
		const worldRotation = this.activeCameraCropTransform.getWorldRotation();
		const cameraCropScale = this.activeCameraCropTransform.getWorldScale();

		// Add normal offset along cameraCrop's forward direction
		const planeNormal = worldRotation.multiplyVec3(vec3.forward());
		const cursorPosition = worldPosition.add(
			planeNormal.uniformScale(this.normalOffset)
		);

		// Set cursor position
		this.cursorPlaneTransform.setWorldPosition(cursorPosition);

		// Match cameraCrop rotation
		this.cursorPlaneTransform.setWorldRotation(worldRotation);

		// Compensate cursor plane scale for cameraCrop's aspect ratio
		const aspectRatioCompensation = cameraCropScale.y / cameraCropScale.x;
		this.cursorPlaneTransform.setLocalScale(
			new vec3(
				this.cursorPlaneOriginalScale.x * aspectRatioCompensation,
				this.cursorPlaneOriginalScale.y,
				this.cursorPlaneOriginalScale.z
			)
		);
	}

	private setCursorPlaneVisible(isVisible: boolean) {
		// Enable/disable the cursor plane SceneObject itself
		this.sceneObject.enabled = isVisible;

		// Handle external sampleColorIndicator and text if not children
		if (
			this.sampleColorIndicator &&
			this.sampleColorIndicator.getParent() !== this.sceneObject
		) {
			this.sampleColorIndicator.enabled = isVisible;
		}

		if (this.sampledColorText) {
			const textSceneObject = this.sampledColorText.getSceneObject();
			if (textSceneObject && textSceneObject.getParent() !== this.sceneObject) {
				textSceneObject.enabled = isVisible;
			}
		}
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
		const startPixelX = Math.max(
			0,
			Math.min(width - gridSize, centerPixelX - halfGrid)
		);
		const startPixelY = Math.max(
			0,
			Math.min(height - gridSize, centerPixelY - halfGrid)
		);

		// Create procedural texture provider for pixel access
		const proceduralTexture =
			ProceduralTextureProvider.createFromTexture(sourceTexture);
		const sourceProvider =
			proceduralTexture.control as ProceduralTextureProvider;

		// Sample pixels from source texture
		const pixelBuffer = new Uint8Array(gridSize * gridSize * 4);
		sourceProvider.getPixels(
			startPixelX,
			startPixelY,
			gridSize,
			gridSize,
			pixelBuffer
		);

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
	private updateSampledColor(
		pixelBuffer: Uint8Array,
		gridSize: number,
		halfGrid: number
	): void {
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
			return hex.length === 1 ? "0" + hex : hex;
		};
		return "#" + toHex(r) + toHex(g) + toHex(b);
	}

	// Public API
	public setNormalOffset(offset: number): void {
		this.normalOffset = offset;
	}

	public setGridSize(size: number): void {
		this.gridSize = size;
		this.validatedGridSize = this.computeValidGridSize();
		if (this.cursorPlaneMaterial) {
			this.cursorPlaneMaterial.gridScale = this.validatedGridSize;
		}
	}
}