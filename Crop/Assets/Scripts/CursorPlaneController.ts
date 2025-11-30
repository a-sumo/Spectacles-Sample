import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { PictureController, ActiveScannerEvent } from "./PictureController";

/**
 * CursorPlaneController
 * 
 * Manages a single cursor plane in the scene that tracks hover interactions
 * on active scanners. The cursor plane is a regular SceneObject (not prefab)
 * that gets repositioned when users interact with scanner cameraCrops.
 */
@component
export class CursorPlaneController extends BaseScriptComponent {
	@input
	@hint("The cursor plane SceneObject to move around")
	cursorPlane: SceneObject;

	@input
	@hint("The region hover plane SceneObject (positioned at hit with normal offset)")
	regionHoverPlane: SceneObject;

	@input
	@hint("Text component to display the sampled color as HEX code")
	sampledColorText: Text;

	@input
	@hint("Object whose material mainColor will be set to the sampled color")
	sampleColorIndicator: SceneObject;

	@input
	@hint("Object showing the sampled region grid")
	sampleRegionIndicator: SceneObject;

	@input
	@hint("Offset along the plane's normal direction for cursor (towards viewer)")
	cursorNormalOffset: number = 0.5;

	@input
	@hint("Offset along the plane's normal direction for region hover plane")
	regionNormalOffset: number = 0.1;

	@input
	@hint("UV space offset for cursor (e.g., vec2(0.5, 0) pushes cursor right)")
	cursorUVOffset: vec2 = new vec2(0, 0);

	@input
	@hint("Grid size for texture sampling (odd number, e.g., 9 = 9x9 grid)")
	gridSize: number = 9;

	@input
	@hint("Path to cameraCrop within scanner hierarchy")
	cameraCropPath: string = "ImageAnchor/CameraCrop";

	// State
	private pictureController: PictureController | null = null;
	private activeScanner: SceneObject | null = null;
	private activeInteractable: Interactable | null = null;
	private activeCameraCrop: SceneObject | null = null;
	private activeCameraCropTransform: Transform | null = null;
	private activeCameraCropMaterial: any = null;

	// Transform references
	private cursorPlaneTransform: Transform;
	private regionHoverPlaneTransform: Transform | null = null;
	
	// Material references
	private sampleRegionMaterial: any = null;
	private sampledColorMaterial: any = null;

	// Validated grid size
	private validatedGridSize: number = 9;

	// Event cleanup
	private unsubscribeInteractable: (() => void)[] = [];

	onAwake() {
		if (!this.cursorPlane) {
			print("CursorPlaneController: Error - No cursor plane assigned");
			return;
		}

		this.cursorPlaneTransform = this.cursorPlane.getTransform();

		if (this.regionHoverPlane) {
			this.regionHoverPlaneTransform = this.regionHoverPlane.getTransform();
		}

		// Get PictureController via singleton
		this.pictureController = PictureController.getInstance();
		if (!this.pictureController) {
			print("CursorPlaneController: PictureController singleton not found");
			return;
		}

		// Validate grid size
		this.validatedGridSize = this.computeValidGridSize();

		// Setup materials
		this.setupMaterials();

		// Subscribe to active scanner changes
		this.pictureController.onActiveScannerChanged.add(
			this.onActiveScannerChanged.bind(this)
		);

		// Hide planes initially (move far away)
		this.hidePlanes();

		print("CursorPlaneController: Initialized");
	}

	private computeValidGridSize(): number {
		let size = Math.max(1, Math.floor(this.gridSize));
		if (size % 2 === 0) {
			size += 1;
		}
		return size;
	}

	private setupMaterials() {
		if (this.sampleRegionIndicator) {
			const renderMesh = this.sampleRegionIndicator.getComponent("RenderMeshVisual");
			if (renderMesh) {
				this.sampleRegionMaterial = renderMesh.mainPass;
				if (this.sampleRegionMaterial) {
					this.sampleRegionMaterial.gridScale = this.validatedGridSize;
				}
			}
		}

		if (this.sampleColorIndicator) {
			const renderMesh = this.sampleColorIndicator.getComponent("RenderMeshVisual");
			if (renderMesh) {
				this.sampledColorMaterial = renderMesh.mainPass;
			}
		}
	}

	private onActiveScannerChanged(event: ActiveScannerEvent) {
		this.cleanupInteractableEvents();

		this.activeScanner = event.scanner;

		if (this.activeScanner && event.interactableObject) {
			this.activeCameraCrop = this.findCameraCropInScanner(this.activeScanner);

			if (this.activeCameraCrop) {
				this.activeCameraCropTransform = this.activeCameraCrop.getTransform();

				const renderMesh = this.activeCameraCrop.getComponent("RenderMeshVisual");
				if (renderMesh) {
					this.activeCameraCropMaterial = renderMesh.mainPass;
				}

				this.activeInteractable = event.interactableObject.getComponent(
					Interactable.getTypeName()
				) as Interactable;

				if (this.activeInteractable) {
					this.setupHoverEvents();
					print("CursorPlaneController: Tracking scanner " + event.scannerId);
				}
			}
		} else {
			this.hidePlanes();
			this.activeCameraCropTransform = null;
			this.activeCameraCropMaterial = null;
			this.activeCameraCrop = null;
			this.activeInteractable = null;
		}
	}

	private findCameraCropInScanner(scanner: SceneObject): SceneObject | null {
		if (!this.cameraCropPath) return scanner;

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
				print("CursorPlaneController: Could not find '" + part + "' in hierarchy");
				return null;
			}
		}

		return current;
	}

	private setupHoverEvents() {
		if (!this.activeInteractable) return;

		this.unsubscribeInteractable.push(
			this.activeInteractable.onHoverEnter((e: InteractorEvent) => {
				if (!e.interactor?.targetHitInfo || !this.activeCameraCropTransform) return;
				
				const worldPosition = e.interactor.targetHitInfo.hit?.position ?? vec3.zero();
				this.updatePlanesAtWorldPosition(worldPosition);
			})
		);

		this.unsubscribeInteractable.push(
			this.activeInteractable.onHoverUpdate((e: InteractorEvent) => {
				if (!e.interactor?.targetHitInfo || !this.activeCameraCropTransform) return;
				
				const worldPosition = e.interactor.targetHitInfo.hit?.position ?? vec3.zero();
				this.updatePlanesAtWorldPosition(worldPosition);
			})
		);

		this.unsubscribeInteractable.push(
			this.activeInteractable.onHoverExit(() => {
				this.hidePlanes();
			})
		);
	}

	private cleanupInteractableEvents() {
		this.unsubscribeInteractable.forEach((unsub) => unsub());
		this.unsubscribeInteractable = [];
	}

	private updatePlanesAtWorldPosition(worldPosition: vec3): void {
		if (!this.activeCameraCropTransform) return;

		const uv = this.worldToUV(worldPosition);
		
		// Update cursor plane (with UV offset)
		this.positionCursorPlane(worldPosition, uv);
		
		// Update region hover plane (directly at hit position with normal offset only)
		this.positionRegionHoverPlane(worldPosition);
		
		// Update texture sampling
		this.updateCursorPlaneTexture(uv);
	}

	private worldToUV(worldPosition: vec3): vec2 {
		if (!this.activeCameraCropTransform) return new vec2(0.5, 0.5);

		const invertedWorldTransform = this.activeCameraCropTransform.getInvertedWorldTransform();
		const localPos = invertedWorldTransform.multiplyPoint(worldPosition);

		return new vec2(
			Math.max(0.0, Math.min(1.0, localPos.x + 0.5)),
			Math.max(0.0, Math.min(1.0, localPos.y + 0.5))
		);
	}

	private positionCursorPlane(worldPosition: vec3, uv: vec2): void {
		if (!this.activeCameraCropTransform) return;

		const worldRotation = this.activeCameraCropTransform.getWorldRotation();
		const cameraCropScale = this.activeCameraCropTransform.getWorldScale();

		// Apply UV offset in world space
		const uvOffsetLocal = new vec3(
			this.cursorUVOffset.x * cameraCropScale.x,
			this.cursorUVOffset.y * cameraCropScale.y,
			0
		);
		const uvOffsetWorld = worldRotation.multiplyVec3(uvOffsetLocal);

		// Apply normal offset
		const planeNormal = worldRotation.multiplyVec3(vec3.forward());
		const normalOffsetWorld = planeNormal.uniformScale(this.cursorNormalOffset);

		const finalPosition = worldPosition.add(uvOffsetWorld).add(normalOffsetWorld);

		this.cursorPlaneTransform.setWorldPosition(finalPosition);
		this.cursorPlaneTransform.setWorldRotation(worldRotation);
	}

	private positionRegionHoverPlane(worldPosition: vec3): void {
		if (!this.activeCameraCropTransform || !this.regionHoverPlaneTransform) return;

		const worldRotation = this.activeCameraCropTransform.getWorldRotation();

		// Apply only normal offset (no UV offset)
		const planeNormal = worldRotation.multiplyVec3(vec3.forward());
		const normalOffsetWorld = planeNormal.uniformScale(this.regionNormalOffset);

		const finalPosition = worldPosition.add(normalOffsetWorld);

		this.regionHoverPlaneTransform.setWorldPosition(finalPosition);
		this.regionHoverPlaneTransform.setWorldRotation(worldRotation);
	}

	private hidePlanes(): void {
		const hidePosition = new vec3(0,1000,0);
		this.cursorPlaneTransform.setWorldPosition(hidePosition);
		
		if (this.regionHoverPlaneTransform) {
			this.regionHoverPlaneTransform.setWorldPosition(hidePosition);
		}
	}

	private updateCursorPlaneTexture(uv: vec2): void {
		if (!this.sampleRegionMaterial || !this.activeCameraCropMaterial) return;

		const sourceTexture: Texture = this.activeCameraCropMaterial.captureImage;
		if (!sourceTexture) return;

		const width = sourceTexture.getWidth();
		const height = sourceTexture.getHeight();
		if (width <= 0 || height <= 0) return;

		const gridSize = this.validatedGridSize;
		const halfGrid = Math.floor(gridSize / 2);

		const centerPixelX = Math.round(uv.x * (width - 1));
		const centerPixelY = Math.round(uv.y * (height - 1));

		const startPixelX = Math.max(0, Math.min(width - gridSize, centerPixelX - halfGrid));
		const startPixelY = Math.max(0, Math.min(height - gridSize, centerPixelY - halfGrid));

		const proceduralTexture = ProceduralTextureProvider.createFromTexture(sourceTexture);
		const sourceProvider = proceduralTexture.control as ProceduralTextureProvider;

		const pixelBuffer = new Uint8Array(gridSize * gridSize * 4);
		sourceProvider.getPixels(startPixelX, startPixelY, gridSize, gridSize, pixelBuffer);

		const sampledTexture = ProceduralTextureProvider.createWithFormat(
			gridSize,
			gridSize,
			TextureFormat.RGBA8Unorm
		);
		const outputProvider = sampledTexture.control as ProceduralTextureProvider;
		outputProvider.setPixels(0, 0, gridSize, gridSize, pixelBuffer);

		this.sampleRegionMaterial.mainTexture = sampledTexture;

		this.updateSampledColor(pixelBuffer, gridSize, halfGrid);
	}

	private updateSampledColor(pixelBuffer: Uint8Array, gridSize: number, halfGrid: number): void {
		const ONE_OVER_255 = 0.00392156862;
		const centerPixelIndex = (halfGrid * gridSize + halfGrid) * 4;

		const r = pixelBuffer[centerPixelIndex];
		const g = pixelBuffer[centerPixelIndex + 1];
		const b = pixelBuffer[centerPixelIndex + 2];

		if (this.sampledColorText) {
			this.sampledColorText.text = this.rgbToHex(r, g, b);
		}

		if (this.sampledColorMaterial) {
			this.sampledColorMaterial.mainColor = new vec4(
				r * ONE_OVER_255,
				g * ONE_OVER_255,
				b * ONE_OVER_255,
				1.0
			);
		}
	}

	private rgbToHex(r: number, g: number, b: number): string {
		const toHex = (value: number): string => {
			const hex = Math.round(value).toString(16).toUpperCase();
			return hex.length === 1 ? "0" + hex : hex;
		};
		return "#" + toHex(r) + toHex(g) + toHex(b);
	}
}