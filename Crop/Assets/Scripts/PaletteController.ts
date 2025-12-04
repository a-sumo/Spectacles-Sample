import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { BaseButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton";

export interface PaletteItem {
	id: string;
	prefab: ObjectPrefab;
}

export class PaletteSelectionEvent {
	id: string;
	index: number;
	sceneObject: SceneObject;

	constructor(id: string, index: number, sceneObject: SceneObject) {
		this.id = id;
		this.index = index;
		this.sceneObject = sceneObject;
	}
}

@component
export class PaletteController extends BaseScriptComponent {
	@input
	@hint("List of prefabs to instantiate as palette items")
	itemPrefabs: ObjectPrefab[] = [];

	@input
	@hint(
		"Optional IDs for each prefab (comma-separated). If empty, indices will be used."
	)
	itemIds: string = "";

	@input
	@hint(
		"Path to the colored square within item hierarchy (e.g., 'Colored Square')"
	)
	coloredSquarePath: string = "Colored Square";

	@input
	@hint("Path to the slot's text within item hierarchy")
	slotTextPath: string = "Text";

	@input
	@hint("Number of columns in the grid (0 = auto-calculate)")
	columns: number = 0;

	@input
	@hint("Number of rows in the grid (0 = auto-calculate)")
	rows: number = 0;

	@input
	@hint("Padding between items")
	padding: vec2 = new vec2(5, 5);

	@input
	@hint("Offset of the item grid")
	offset: vec2 = new vec2(0, 0);

	@input
	@hint("Index of the default selected item (-1 for none)")
	defaultSelectedIndex: number = 0;

	@input
	@hint("Layout direction: true = row-first, false = column-first")
	layoutByRow: boolean = true;

	@input
	@hint("In editor scanner creation button")
	editorTestButton: SceneObject = null;

	private isEditor = global.deviceInfoSystem.isEditor();

	private items: Map<
		string,
		{
			sceneObject: SceneObject;
			button: BaseButton;
			index: number;
			slotTextObj: SceneObject | null;
			coloredSquare: SceneObject | null;
			coloredSquareMaterial: Material | null;
			color: vec4;
		}
	> = new Map();
	private itemList: {
		id: string;
		sceneObject: SceneObject;
		button: BaseButton;
		slotTextObj: SceneObject | null;
		coloredSquare: SceneObject | null;
		coloredSquareMaterial: Material | null;
		color: vec4;
	}[] = [];
	private activeItemId: string | null = null;
	private isUpdatingSelection: boolean = false;

	private onSelectionChangedEvent: Event<PaletteSelectionEvent> =
		new Event<PaletteSelectionEvent>();
	public readonly onSelectionChanged: PublicApi<PaletteSelectionEvent> =
		this.onSelectionChangedEvent.publicApi();

	private initialized: boolean = false;

	onAwake() {
		this.createEvent("OnStartEvent").bind(this.initialize.bind(this));
		// if(!this.isEditor){
		this.editorTestButton.enabled = false;
		// }
	}

	initialize(): void {
		if (this.initialized) return;

		this.instantiateItems();
		this.layoutItems();
		this.setupButtonListeners();

		// Set default selection
		if (
			this.defaultSelectedIndex >= 0 &&
			this.defaultSelectedIndex < this.itemList.length
		) {
			const defaultItem = this.itemList[this.defaultSelectedIndex];
			this.setActiveItem(defaultItem.id, false);
		}

		this.initialized = true;
	}

	private instantiateItems(): void {
		const ids = this.itemIds
			.split(",")
			.map((id) => id.trim())
			.filter((id) => id.length > 0);

		for (let i = 0; i < this.itemPrefabs.length; i++) {
			const prefab = this.itemPrefabs[i];
			if (!prefab) continue;

			const sceneObject = prefab.instantiate(this.getSceneObject());
			const id = ids[i] || `item_${i}`;
			sceneObject.name = `PaletteItem_${id}`;

			// Find the BaseButton component
			const button = this.findButtonComponent(sceneObject);
			if (!button) {
				print(
					`PaletteController: No BaseButton found on prefab ${i}, skipping`
				);
				sceneObject.destroy();
				continue;
			}

			// Find the colored square child and clone its material
			const coloredSquare = this.findChildByPath(
				sceneObject,
				this.coloredSquarePath
			);
			let coloredSquareMaterial: Material | null = null;

			if (coloredSquare) {
				const renderMesh = coloredSquare.getComponent(
					"Component.RenderMeshVisual"
				) as RenderMeshVisual;
				if (renderMesh && renderMesh.mainMaterial) {
					// Clone material so each instance has its own
					renderMesh.mainMaterial = renderMesh.mainMaterial.clone();
					coloredSquareMaterial = renderMesh.mainMaterial;
				}
			} else {
				print(
					`PaletteController: No colored square found at path '${this.coloredSquarePath}' for prefab ${i}`
				);
			}

			// Find the text child and set its value
			const slotTextObj = this.findChildByPath(sceneObject, this.slotTextPath);
			slotTextObj.getComponent("Text").text = `${i + 1}`;

			// Ensure button is in toggle mode
			button.setIsToggleable(true);

			// Default color (white)
			const defaultColor = new vec4(1, 1, 1, 1);

			const itemData = {
				sceneObject,
				button,
				index: this.itemList.length,
				slotTextObj,
				coloredSquare,
				coloredSquareMaterial,
				color: defaultColor,
			};
			this.items.set(id, itemData);
			this.itemList.push({
				id,
				sceneObject,
				button,
				slotTextObj,
				coloredSquare,
				coloredSquareMaterial,
				color: defaultColor,
			});
		}

		print(`PaletteController: Instantiated ${this.itemList.length} items`);
	}

	private findChildByPath(
		sceneObject: SceneObject,
		path: string
	): SceneObject | null {
		if (!path) return sceneObject;

		const pathParts = path.split("/");
		let current = sceneObject;

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
				return null;
			}
		}

		return current;
	}

	private findButtonComponent(sceneObject: SceneObject): BaseButton | null {
		// Try to get BaseButton on the object itself
		let button = sceneObject.getComponent(
			"Component.ScriptComponent"
		) as BaseButton;
		if (button && typeof (button as any).setIsToggleable === "function") {
			return button as BaseButton;
		}

		// Search children recursively
		for (let i = 0; i < sceneObject.getChildrenCount(); i++) {
			const child = sceneObject.getChild(i);
			const childButton = this.findButtonComponent(child);
			if (childButton) return childButton;
		}

		return null;
	}

	private layoutItems(): void {
		if (this.itemList.length === 0) return;

		// Calculate grid dimensions
		const itemCount = this.itemList.length;
		let cols = this.columns;
		let rows = this.rows;

		if (cols <= 0 && rows <= 0) {
			// Auto-calculate: prefer square-ish grid
			cols = Math.ceil(Math.sqrt(itemCount));
			rows = Math.ceil(itemCount / cols);
		} else if (cols <= 0) {
			cols = Math.ceil(itemCount / rows);
		} else if (rows <= 0) {
			rows = Math.ceil(itemCount / cols);
		}

		// Get bounding boxes of all items to find max cell size
		const boundingBoxes = this.itemList.map((item) =>
			this.calculateBoundingBox(item.sceneObject)
		);

		let maxWidth = 0;
		let maxHeight = 0;
		for (const bbox of boundingBoxes) {
			maxWidth = Math.max(maxWidth, bbox.size.x);
			maxHeight = Math.max(maxHeight, bbox.size.y);
		}

		// If no valid bounding boxes, use default size
		if (maxWidth === 0) maxWidth = 10;
		if (maxHeight === 0) maxHeight = 10;

		const cellWidth = maxWidth + this.padding.x;
		const cellHeight = maxHeight + this.padding.y;

		// Calculate total grid size
		const totalWidth = cols * cellWidth;
		const totalHeight = rows * cellHeight;

		// Calculate starting position (centered)
		const startX = -totalWidth / 2 + cellWidth / 2;
		const startY = totalHeight / 2 - cellHeight / 2;

		// Position each item
		for (let i = 0; i < this.itemList.length; i++) {
			let col: number, row: number;

			if (this.layoutByRow) {
				col = i % cols;
				row = Math.floor(i / cols);
			} else {
				row = i % rows;
				col = Math.floor(i / rows);
			}

			const x = startX + col * cellWidth;
			const y = startY - row * cellHeight;
			const z = 0;

			const item = this.itemList[i];
			const transform = item.sceneObject.getTransform();
			transform.setLocalPosition(
				new vec3(x + this.offset.x, y + this.offset.y, z)
			);
		}

		print(
			`PaletteController: Laid out ${itemCount} items in ${rows}x${cols} grid (cell: ${cellWidth.toFixed(
				1
			)}x${cellHeight.toFixed(1)})`
		);
	}

	private calculateBoundingBox(sceneObject: SceneObject): {
		min: vec3;
		max: vec3;
		size: vec3;
		center: vec3;
	} {
		const defaultBox = {
			min: vec3.zero(),
			max: vec3.zero(),
			size: vec3.zero(),
			center: vec3.zero(),
		};

		// Try to get RenderMeshVisual for bounding box
		const meshVisuals = this.findMeshVisuals(sceneObject);

		if (meshVisuals.length === 0) {
			return defaultBox;
		}

		let minX = Infinity,
			minY = Infinity,
			minZ = Infinity;
		let maxX = -Infinity,
			maxY = -Infinity,
			maxZ = -Infinity;

		for (const meshVisual of meshVisuals) {
			const aabbMin = meshVisual.localAabbMin();
			const aabbMax = meshVisual.localAabbMax();

			minX = Math.min(minX, aabbMin.x);
			minY = Math.min(minY, aabbMin.y);
			minZ = Math.min(minZ, aabbMin.z);
			maxX = Math.max(maxX, aabbMax.x);
			maxY = Math.max(maxY, aabbMax.y);
			maxZ = Math.max(maxZ, aabbMax.z);
		}

		if (!isFinite(minX)) return defaultBox;

		const min = new vec3(minX, minY, minZ);
		const max = new vec3(maxX, maxY, maxZ);
		const size = max.sub(min);
		const center = min.add(max).uniformScale(0.5);

		return { min, max, size, center };
	}

	private findMeshVisuals(sceneObject: SceneObject): RenderMeshVisual[] {
		const results: RenderMeshVisual[] = [];

		const meshVisual = sceneObject.getComponent(
			"Component.RenderMeshVisual"
		) as RenderMeshVisual;
		if (meshVisual) {
			results.push(meshVisual);
		}

		for (let i = 0; i < sceneObject.getChildrenCount(); i++) {
			const childResults = this.findMeshVisuals(sceneObject.getChild(i));
			results.push(...childResults);
		}

		return results;
	}

	private setupButtonListeners(): void {
		for (const item of this.itemList) {
			const itemId = item.id;

			// Listen to value changes
			item.button.onValueChange.add((value: number) => {
				// Prevent re-entrant calls during programmatic updates
				if (this.isUpdatingSelection) return;

				if (value === 1) {
					// Button was toggled ON by user interaction
					this.setActiveItem(itemId, true);
				} else if (this.activeItemId === itemId) {
					// Active button was toggled OFF by user - re-toggle it ON (radio behavior)
					// Radio buttons require one item to always be selected
					this.isUpdatingSelection = true;
					item.button.toggle(true);
					item.slotTextObj.getComponent("Text").textFill.color = new vec4(
						1,
						1,
						1,
						1
					);
					this.isUpdatingSelection = false;
				}
			});
		}
	}

	public setActiveItem(id: string, notify: boolean = true): void {
		if (this.activeItemId === id) return;
		if (this.isUpdatingSelection) return;

		const newItem = this.items.get(id);
		if (!newItem) {
			print(`PaletteController: Item '${id}' not found`);
			return;
		}

		this.isUpdatingSelection = true;

		// Untoggle previous active item
		if (this.activeItemId !== null) {
			const prevItem = this.items.get(this.activeItemId);
			if (prevItem) {
				prevItem.button.toggle(false);
				// Set text to grey when untoggled
				if (prevItem.slotTextObj) {
					prevItem.slotTextObj.getComponent("Text").textFill.color = new vec4(
						0.9,
						0.9,
						0.9,
						1
					);
				}
			}
		}

        // Toggle new active item
        this.activeItemId = id;
        newItem.button.toggle(true);
        // Set text to yellow/orange when toggled
        if (newItem.slotTextObj) {
            newItem.slotTextObj.getComponent("Text").textFill.color = new vec4(255,216,0,1);
        }
		this.isUpdatingSelection = false;

		if (notify) {
			this.onSelectionChangedEvent.invoke(
				new PaletteSelectionEvent(id, newItem.index, newItem.sceneObject)
			);
		}

		print(`PaletteController: Selected item '${id}'`);
	}

	public setActiveItemByIndex(index: number, notify: boolean = true): void {
		if (index < 0 || index >= this.itemList.length) {
			print(`PaletteController: Index ${index} out of range`);
			return;
		}

		this.setActiveItem(this.itemList[index].id, notify);
	}

	public getActiveItemId(): string | null {
		return this.activeItemId;
	}

	public getActiveItemIndex(): number {
		if (this.activeItemId === null) return -1;
		const item = this.items.get(this.activeItemId);
		return item ? item.index : -1;
	}

	public getActiveSceneObject(): SceneObject | null {
		if (this.activeItemId === null) return null;
		const item = this.items.get(this.activeItemId);
		return item ? item.sceneObject : null;
	}

	public getItemById(id: string): SceneObject | null {
		const item = this.items.get(id);
		return item ? item.sceneObject : null;
	}

	public getItemByIndex(index: number): SceneObject | null {
		if (index < 0 || index >= this.itemList.length) return null;
		return this.itemList[index].sceneObject;
	}

	public getItemCount(): number {
		return this.itemList.length;
	}

	public getAllItemIds(): string[] {
		return this.itemList.map((item) => item.id);
	}

	public relayout(): void {
		this.layoutItems();
	}

	/**
	 * Set the color of the active item's colored square
	 */
	public setActiveItemColor(color: vec4): void {
		if (this.activeItemId === null) {
			print("PaletteController: No active item to set color");
			return;
		}
		this.setItemColor(this.activeItemId, color);
	}

	/**
	 * Set the color of a specific item's colored square by ID
	 */
	public setItemColor(id: string, color: vec4): void {
		const item = this.items.get(id);
		if (!item) {
			print(`PaletteController: Item '${id}' not found`);
			return;
		}

		// Store the color
		item.color = color;

		// Apply to the cloned material
		if (item.coloredSquareMaterial) {
			item.coloredSquareMaterial.mainPass.mainColor = color;
		}

		print(`PaletteController: Set color ${color.toString()} for item '${id}'`);
	}

	/**
	 * Set the color of a specific item's colored square by index
	 */
	public setItemColorByIndex(index: number, color: vec4): void {
		if (index < 0 || index >= this.itemList.length) {
			print(`PaletteController: Index ${index} out of range`);
			return;
		}
		this.setItemColor(this.itemList[index].id, color);
	}

	/**
	 * Get the color of a specific item by ID
	 */
	public getItemColor(id: string): vec4 | null {
		const item = this.items.get(id);
		return item ? item.color : null;
	}

	/**
	 * Get the color of the active item
	 */
	public getActiveItemColor(): vec4 | null {
		if (this.activeItemId === null) return null;
		return this.getItemColor(this.activeItemId);
	}
}
