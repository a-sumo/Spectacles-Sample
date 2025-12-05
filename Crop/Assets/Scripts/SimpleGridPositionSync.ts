// SimpleGridPositionSync.ts

import { LSTween } from "LSTween.lspkg/LSTween";
import Easing from "LSTween.lspkg/TweenJS/Easing";

interface GridObjectState {
    sceneObject: SceneObject;
    restPosition: vec3;
    targetPosition: vec3;
    isAtTarget: boolean;
    tweenActive: boolean;
}

@component
export class SimpleGridPositionSync extends BaseScriptComponent {
    
    @input
    @hint("Prefab to instantiate for each grid position")
    objectPrefab: ObjectPrefab;
    
    @input
    @hint("Number of columns in grid")
    gridWidth: number = 4;
    
    @input
    @hint("Number of rows in grid")
    gridHeight: number = 4;
    
    @input
    @hint("Shader position offset (matches 'pos' in shader)")
    pos: vec3 = new vec3(0, 0, 0);
    
    @input
    @hint("Shader scale multiplier (matches 'scale' in shader)")
    scale: vec3 = new vec3(100, 100, 100);
    
    @input
    @hint("Shader rotation in degrees (matches 'rot' in shader)")
    rot: vec3 = new vec3(0, 0, 0);
    
    @input
    @hint("VFX component - REQUIRED for world transform")
    vfxComponent: VFXComponent;
    
    // ============ CIRCULAR REST CONFIGURATION ============
    
    @input
    @hint("Center point for circular rest layout")
    circleCenter: vec3 = new vec3(0, 0, 0);
    
    @input
    @hint("Radius of the circle")
    circleRadius: number = 50;
    
    @input
    @hint("Rotation offset for circle (degrees)")
    circleRotationOffset: number = 0;
    
    @input
    @hint("Plane for circle: 0=XZ (horizontal), 1=XY (vertical), 2=YZ")
    circlePlane: number = 0;
    
    // ============ TOGGLE CONTROL ============
    
    @input
    @hint("TRUE = at VFX particle positions, FALSE = at circular rest positions")
    atParticlePositions: boolean = false;
    
    // ============ TWEEN SETTINGS ============
    
    @input
    @hint("Tween duration in milliseconds")
    tweenDuration: number = 500;
    
    @input
    @hint("Stagger delay between objects (ms)")
    staggerDelay: number = 30;
    
    // ============ UPDATE SETTINGS ============
    
    @input
    @hint("Update positions every frame (for moving VFX)")
    continuousUpdate: boolean = true;
    
    @input
    @hint("Log debug info")
    debugMode: boolean = true;
    
    private objectStates: GridObjectState[] = [];
    private initialized: boolean = false;
    private vfxTransform: Transform | null = null;
    private lastAtParticlePositions: boolean = false;
    
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.initialize());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }
    
    private initialize(): void {
        if (!this.objectPrefab) {
            print("SimpleGridPositionSync ERROR: No objectPrefab assigned!");
            return;
        }
        
        if (!this.vfxComponent) {
            print("SimpleGridPositionSync ERROR: No vfxComponent assigned!");
            return;
        }
        
        this.vfxTransform = this.vfxComponent.getSceneObject().getTransform();
        
        this.syncFromVFX();
        this.spawnObjects();
        this.updateAllPositions();
        
        // Set initial positions
        this.lastAtParticlePositions = this.atParticlePositions;
        for (const state of this.objectStates) {
            const startPos = this.atParticlePositions ? state.targetPosition : state.restPosition;
            state.sceneObject.getTransform().setWorldPosition(startPos);
            state.isAtTarget = this.atParticlePositions;
        }
        
        this.initialized = true;
        
        if (this.debugMode) {
            this.logConfiguration();
        }
    }
    
    private spawnObjects(): void {
        this.destroySpawnedObjects();
        
        const totalCount = this.gridWidth * this.gridHeight;
        
        for (let i = 0; i < totalCount; i++) {
            const obj = this.objectPrefab.instantiate(this.getSceneObject());
            obj.name = `GridObject_${i}`;
            
            const rmv = obj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv && rmv.mainMaterial) {
                rmv.mainMaterial = rmv.mainMaterial.clone();
            }
            
            this.cloneChildMaterials(obj);
            
            const state: GridObjectState = {
                sceneObject: obj,
                restPosition: vec3.zero(),
                targetPosition: vec3.zero(),
                isAtTarget: false,
                tweenActive: false
            };
            
            this.objectStates.push(state);
            this.applyColor(obj, i);
        }
        
        if (this.debugMode) {
            print(`SimpleGridPositionSync: Spawned ${totalCount} objects`);
        }
    }
    
    private cloneChildMaterials(parent: SceneObject): void {
        for (let i = 0; i < parent.getChildrenCount(); i++) {
            const child = parent.getChild(i);
            const rmv = child.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv && rmv.mainMaterial) {
                rmv.mainMaterial = rmv.mainMaterial.clone();
            }
            this.cloneChildMaterials(child);
        }
    }
    
    private destroySpawnedObjects(): void {
        for (const state of this.objectStates) {
            if (state.sceneObject) {
                state.sceneObject.destroy();
            }
        }
        this.objectStates = [];
    }
    
    private onUpdate(): void {
        if (!this.initialized) return;
        
        // Check if toggle changed
        if (this.atParticlePositions !== this.lastAtParticlePositions) {
            this.lastAtParticlePositions = this.atParticlePositions;
            this.tweenAll();
        }
        
        // Update positions
        if (this.continuousUpdate) {
            this.syncFromVFX();
            this.updateAllPositions();
            
            // Keep objects at their current target if not tweening
            for (const state of this.objectStates) {
                if (!state.tweenActive) {
                    const pos = state.isAtTarget ? state.targetPosition : state.restPosition;
                    state.sceneObject.getTransform().setWorldPosition(pos);
                }
            }
        }
    }
    
    private syncFromVFX(): void {
        if (!this.vfxComponent || !this.vfxComponent.asset) return;
        
        try {
            const props = this.vfxComponent.asset.properties as any;
            
            if (props.gridWidth !== undefined) this.gridWidth = props.gridWidth;
            if (props.gridHeight !== undefined) this.gridHeight = props.gridHeight;
            if (props.pos !== undefined) this.pos = props.pos;
            if (props.scale !== undefined) this.scale = props.scale;
            if (props.rot !== undefined) this.rot = props.rot;
        } catch (e) {
            // Properties not available
        }
    }
    
    private updateAllPositions(): void {
        const count = this.objectStates.length;
        
        for (let i = 0; i < count; i++) {
            const state = this.objectStates[i];
            
            // Target = VFX particle position
            state.targetPosition = this.getParticleWorldPosition(i);
            
            // Rest = circular layout
            state.restPosition = this.getCircularPosition(i, count);
        }
    }
    
    /**
     * Calculate circular rest position for object
     */
    private getCircularPosition(index: number, total: number): vec3 {
        const angle = (index / total) * Math.PI * 2 + (this.circleRotationOffset * Math.PI / 180);
        
        let x = 0;
        let y = 0;
        let z = 0;
        
        switch (this.circlePlane) {
            case 0: // XZ plane (horizontal circle)
                x = Math.cos(angle) * this.circleRadius;
                y = 0;
                z = Math.sin(angle) * this.circleRadius;
                break;
            case 1: // XY plane (vertical circle facing Z)
                x = Math.cos(angle) * this.circleRadius;
                y = Math.sin(angle) * this.circleRadius;
                z = 0;
                break;
            case 2: // YZ plane (vertical circle facing X)
                x = 0;
                y = Math.sin(angle) * this.circleRadius;
                z = Math.cos(angle) * this.circleRadius;
                break;
        }
        
        return new vec3(
            this.circleCenter.x + x,
            this.circleCenter.y + y,
            this.circleCenter.z + z
        );
    }
    
    /**
     * Get LOCAL position for particle (shader output)
     */
    private getParticleLocalPosition(particleIndex: number): vec3 {
        const gw = Math.max(this.gridWidth, 1);
        const gh = Math.max(this.gridHeight, 1);
        
        const col = particleIndex % gw;
        const row = Math.floor(particleIndex / gw);
        
        const halfWidth = (gw - 1) * 0.5;
        const halfHeight = (gh - 1) * 0.5;
        
        const localX = (col - halfWidth) / Math.max(gw - 1, 1);
        const localY = 0;
        const localZ = (row - halfHeight) / Math.max(gh - 1, 1);
        
        const scaledX = localX * this.scale.x;
        const scaledY = localY * this.scale.y;
        const scaledZ = localZ * this.scale.z;
        
        const toRad = 0.01745329251;
        const rx = this.rot.x * toRad;
        const ry = this.rot.y * toRad;
        const rz = this.rot.z * toRad;
        
        const cx = Math.cos(rx);
        const sx = Math.sin(rx);
        const cy = Math.cos(ry);
        const sy = Math.sin(ry);
        const cz = Math.cos(rz);
        const sz = Math.sin(rz);
        
        // Y rotation
        const ryX = scaledX * cy + scaledZ * sy;
        const ryY = scaledY;
        const ryZ = -scaledX * sy + scaledZ * cy;
        
        // X rotation
        const rxX = ryX;
        const rxY = ryY * cx - ryZ * sx;
        const rxZ = ryY * sx + ryZ * cx;
        
        // Z rotation
        const rotatedX = rxX * cz - rxY * sz;
        const rotatedY = rxX * sz + rxY * cz;
        const rotatedZ = rxZ;
        
        return new vec3(
            rotatedX + this.pos.x,
            rotatedY + this.pos.y,
            rotatedZ + this.pos.z
        );
    }
    
    /**
     * Get WORLD position for particle
     */
    private getParticleWorldPosition(particleIndex: number): vec3 {
        const localPos = this.getParticleLocalPosition(particleIndex);
        
        if (!this.vfxTransform) {
            return localPos;
        }
        
        return this.vfxTransform.getWorldTransform().multiplyPoint(localPos);
    }
    
    private applyColor(obj: SceneObject, particleIndex: number): void {
        const gw = Math.max(this.gridWidth, 1);
        const gh = Math.max(this.gridHeight, 1);
        
        const col = particleIndex % gw;
        const row = Math.floor(particleIndex / gw);
        
        const u = col / Math.max(gw - 1, 1);
        const v = row / Math.max(gh - 1, 1);
        
        const color = new vec4(u, 0.5, v, 1.0);
        
        this.setObjectColor(obj, color);
        for (let i = 0; i < obj.getChildrenCount(); i++) {
            this.setObjectColor(obj.getChild(i), color);
        }
    }
    
    private setObjectColor(obj: SceneObject, color: vec4): void {
        const rmv = obj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
        if (rmv && rmv.mainMaterial && rmv.mainMaterial.mainPass) {
            try {
                rmv.mainMaterial.mainPass.baseColor = color;
            } catch (e) {
                try {
                    rmv.mainMaterial.mainPass.mainColor = color;
                } catch (e2) {
                    // Neither property exists
                }
            }
        }
    }
    
    // ============ TWEEN CONTROL ============
    
    /**
     * Tween all objects based on current atParticlePositions state
     */
    private tweenAll(): void {
        const toTarget = this.atParticlePositions;
        
        if (this.debugMode) {
            print(`SimpleGridPositionSync: Tweening all to ${toTarget ? "PARTICLE" : "CIRCLE"} positions`);
        }
        
        for (let i = 0; i < this.objectStates.length; i++) {
            const delay = i * this.staggerDelay;
            
            const delayEvent = this.createEvent("DelayedCallbackEvent");
            delayEvent.bind(() => {
                this.tweenObject(i, toTarget);
            });
            delayEvent.reset(delay / 1000);
        }
    }
    
    /**
     * Tween single object
     */
    private tweenObject(index: number, toTarget: boolean): void {
        if (index < 0 || index >= this.objectStates.length) return;
        
        const state = this.objectStates[index];
        if (state.tweenActive) return;
        
        const transform = state.sceneObject.getTransform();
        const startPos = transform.getWorldPosition();
        const endPos = toTarget ? state.targetPosition : state.restPosition;
        
        state.tweenActive = true;
        
        LSTween.moveFromToWorld(transform, startPos, endPos, this.tweenDuration)
            .easing(Easing.Cubic.InOut)
            .onComplete(() => {
                state.isAtTarget = toTarget;
                state.tweenActive = false;
            })
            .start();
    }
    
    // ============ PUBLIC API ============
    
    /**
     * Set position mode (triggers tween if changed)
     */
    public setAtParticlePositions(value: boolean): void {
        this.atParticlePositions = value;
        // onUpdate will detect the change and tween
    }
    
    /**
     * Toggle between particle and circle positions
     */
    public toggle(): void {
        this.atParticlePositions = !this.atParticlePositions;
    }
    
    /**
     * Snap all to current target (no tween)
     */
    public snapAll(): void {
        for (const state of this.objectStates) {
            const pos = this.atParticlePositions ? state.targetPosition : state.restPosition;
            state.sceneObject.getTransform().setWorldPosition(pos);
            state.isAtTarget = this.atParticlePositions;
            state.tweenActive = false;
        }
    }
    
    /**
     * Get object count
     */
    public getObjectCount(): number {
        return this.objectStates.length;
    }
    
    /**
     * Get object at index
     */
    public getObjectAt(index: number): SceneObject | null {
        if (index < 0 || index >= this.objectStates.length) return null;
        return this.objectStates[index].sceneObject;
    }
    
    /**
     * Check if any object is tweening
     */
    public isAnyTweening(): boolean {
        return this.objectStates.some(s => s.tweenActive);
    }
    
    /**
     * Update circle configuration
     */
    public setCircleConfig(center: vec3, radius: number, rotationOffset?: number): void {
        this.circleCenter = center;
        this.circleRadius = radius;
        if (rotationOffset !== undefined) {
            this.circleRotationOffset = rotationOffset;
        }
        this.updateAllPositions();
    }
    
    private logConfiguration(): void {
        print("=== SimpleGridPositionSync ===");
        print(`  Grid: ${this.gridWidth} x ${this.gridHeight} = ${this.objectStates.length} objects`);
        print(`  Circle: center=(${this.circleCenter.x}, ${this.circleCenter.y}, ${this.circleCenter.z}), radius=${this.circleRadius}`);
        print(`  Start at: ${this.atParticlePositions ? "PARTICLE" : "CIRCLE"} positions`);
        print(`  Tween: ${this.tweenDuration}ms, stagger=${this.staggerDelay}ms`);
    }
    
    onDestroy(): void {
        this.destroySpawnedObjects();
    }
}