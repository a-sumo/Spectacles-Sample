import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { LensConfig } from "SpectaclesInteractionKit.lspkg/Utils/LensConfig";

export class ActiveScannerEvent {
	scanner: SceneObject | null;
	interactableObject: SceneObject | null;
	scannerId: string | null;

	constructor(
		scanner: SceneObject | null,
		interactableObject: SceneObject | null,
		scannerId: string | null
	) {
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
	@hint(
		"Path to the interactable object within scanner hierarchy (e.g., 'ImageAnchor/CameraCrop')"
	)
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
			// this.createEvent("TouchStartEvent").bind(this.editorTest.bind(this));
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
		return (
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)
		);
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
				let interactable = interactableObj.getComponent(
					Interactable.getTypeName()
				) as any;

				if (
					interactable &&
					(interactable.hoveringInteractor || interactable.triggeringInteractor)
				) {
					this.activeScanner = scanner;
					this.activeInteractable = interactableObj;
					this.activeScannerId = scannerId;
					break;
				}
			}
		}

		if (previousActiveScanner !== this.activeScanner) {
			this.onActiveScannerChanged.invoke(
				new ActiveScannerEvent(
					this.activeScanner,
					this.activeInteractable,
					this.activeScannerId
				)
			);
		}
	}

	private findInteractableInScanner(scanner: SceneObject): SceneObject | null {
		if (!this.interactablePath) return scanner;

		const pathParts = this.interactablePath.split("/");
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
			interactableObject: interactableObj,
		});

		this.scannerInstances.push(scanner);

		print(
			"Scanner created with ID: " +
				scannerId +
				" (Total: " +
				this.scannerInstances.length +
				")"
		);
	}

	public removeScanner(scannerId: string): void {
		const data = this.scannerData.get(scannerId);
		if (!data) return;

		this.scannerInstances = this.scannerInstances.filter((scanner) => {
			const match = scanner.name.match(/Scanner_(\w+)/);
			return !match || match[1] !== scannerId;
		});

		this.scannerData.delete(scannerId);

		print("Scanner removed: " + scannerId);
	}

	public arrangeScannersInGrid(
		centerPosition: vec3 = new vec3(0, 0, 0),
		spacing: number = 10
	): void {
		const nodeCount = this.scannerInstances.length;
		if (nodeCount === 0) return;

		// Calculate grid dimensions (roughly square)
		const cols = Math.ceil(Math.sqrt(nodeCount));
		const rows = Math.ceil(nodeCount / cols);

		// Calculate starting position to center the grid
		const startX = centerPosition.x - ((cols - 1) * spacing) / 2;
		const startY = centerPosition.z - ((rows - 1) * spacing) / 2;

		for (let i = 0; i < nodeCount; i++) {
			const row = Math.floor(i / cols);
			const col = i % cols;

			const x = startX + col * spacing;
			const y = startY + row * spacing;
			const z = centerPosition.x;

			const scanner = this.scannerInstances[i];
			const transform = scanner.getTransform();
			transform.setWorldPosition(new vec3(x, y, z));
            const TWEEN_DURATION = 100;
            const cancelFunction = makeTween((t) => {
                }, TWEEN_DURATION)    

		}

		print(
			"Arranged " + nodeCount + " scanners in " + rows + "x" + cols + " grid"
		);
	}
}

// |Time| Will call a callback function every frame for a set duration with a number increasing from 0 to 1.
export function makeTween(
	callback: (time: number) => void,
	duration: number
): CancelFunction {
	const updateDispatcher = LensConfig.getInstance().updateDispatcher;
	const lateUpdateEvent = updateDispatcher.createLateUpdateEvent("Tween");
	const startTime = getTime();
	let hasRemovedEvent = false;
	lateUpdateEvent.bind(() => {
		if (getTime() > startTime + duration) {
			hasRemovedEvent = true;
			updateDispatcher.removeEvent(lateUpdateEvent);
			callback(1);
		} else {
			callback((getTime() - startTime) / duration);
		}
	});

	// Create a Cancelation function to stop this animation at any time
	function cancel() {
		if (!hasRemovedEvent) {
			hasRemovedEvent = true;
			updateDispatcher.removeEvent(lateUpdateEvent);
		}
	}

	return cancel;
}
