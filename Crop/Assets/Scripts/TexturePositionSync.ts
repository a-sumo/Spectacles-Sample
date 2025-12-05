// TexturePositionSync.ts

import { LSTween } from "LSTween.lspkg/LSTween";
import Easing from "LSTween.lspkg/TweenJS/Easing";

interface ParticleState {
    sceneObject: SceneObject;
    restPosition: vec3;
    targetPosition: vec3;
    color: vec4;
    isAtTarget: boolean;
    tweenActive: boolean;
}

@component
export class TexturePositionSync extends BaseScriptComponent {
    
    @input
    objectPrefab: ObjectPrefab;
    
    @input
    gamutProjector: ScriptComponent;
    
    @input
    vfxComponent: VFXComponent;
    
    @input
    texWidth: number = 8;
    
    @input
    texHeight: number = 8;
    
    @input
    pos: vec3 = new vec3(0, 0, 0);
    
    @input
    scale: vec3 = new vec3(1, 1, 1);
    
    @input
    rot: vec3 = new vec3(0, 0, 0);
    
    @input
    circleCenter: vec3 = new vec3(0, 0, 0);
    
    @input
    circleRadius: number = 5;
    
    @input
    circleRotationOffset: number = 0;
    
    @input
    @hint("0=XZ, 1=XY, 2=YZ")
    circlePlane: number = 0;
    
    @input
    tweenDuration: number = 500;
    
    @input
    staggerDelay: number = 30;
    
    @input
    continuousUpdate: boolean = true;
    
    @input
    debugMode: boolean = true;
    
    private particleStates: ParticleState[] = [];
    private initialized: boolean = false;
    private vfxTransform: Transform | null = null;
    private _isAtTarget: boolean = false;
    
    private posTextureProvider: ProceduralTextureProvider | null = null;
    private colorTextureProvider: ProceduralTextureProvider | null = null;
    
    private frameCount: number = 0;
    
    onAwake(): void {
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }
    
    private tryInitialize(): void {
        if (this.initialized) return;
        
        if (!this.gamutProjector || !this.objectPrefab) return;
        
        const projector = this.gamutProjector as any;
        const posTex = projector.getProjectedPosTexture?.();
        const colorTex = projector.getProjectedColorTexture?.();
        
        if (!posTex || !colorTex) return;
        
        try {
            this.posTextureProvider = ProceduralTextureProvider.createFromTexture(posTex).control as ProceduralTextureProvider;
            this.colorTextureProvider = ProceduralTextureProvider.createFromTexture(colorTex).control as ProceduralTextureProvider;
        } catch (e) {
            return;
        }
        
        if (this.vfxComponent) {
            this.vfxTransform = this.vfxComponent.getSceneObject().getTransform();
        }
        
        this.readTexturesAndSpawn();
        this.initialized = true;
        
        if (this.debugMode) {
            print(`TexturePositionSync: Ready with ${this.particleStates.length} objects`);
        }
    }
    
    private readTexturesAndSpawn(): void {
        if (!this.posTextureProvider || !this.colorTextureProvider) return;
        
        const totalPixels = this.texWidth * this.texHeight;
        
        const posPixels = new Uint8Array(totalPixels * 4);
        this.posTextureProvider.getPixels(0, 0, this.texWidth, this.texHeight, posPixels);
        
        const colorPixels = new Uint8Array(totalPixels * 4);
        this.colorTextureProvider.getPixels(0, 0, this.texWidth, this.texHeight, colorPixels);
        
        this.destroySpawnedObjects();
        
        for (let i = 0; i < totalPixels; i++) {
            const idx = i * 4;
            if (posPixels[idx + 3] < 128) continue;
            
            const normA = posPixels[idx + 0] / 255;
            const normL = posPixels[idx + 1] / 255;
            const normB = posPixels[idx + 2] / 255;
            
            const localPos = new vec3(normA - 0.5, normL - 0.5, normB - 0.5);
            const targetPos = this.transformToWorld(localPos);
            
            const obj = this.objectPrefab.instantiate(this.getSceneObject());
            obj.name = `Particle_${i}`;
            
            const rmv = obj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv && rmv.mainMaterial) {
                rmv.mainMaterial = rmv.mainMaterial.clone();
            }
            this.cloneChildMaterials(obj);
            
            const state: ParticleState = {
                sceneObject: obj,
                restPosition: vec3.zero(),
                targetPosition: targetPos,
                color: new vec4(colorPixels[idx] / 255, colorPixels[idx + 1] / 255, colorPixels[idx + 2] / 255, 1.0),
                isAtTarget: false,
                tweenActive: false
            };
            
            this.particleStates.push(state);
            this.setObjectColor(obj, state.color);
        }
        
        // Set rest positions and initial placement
        for (let i = 0; i < this.particleStates.length; i++) {
            const state = this.particleStates[i];
            state.restPosition = this.getCircularPosition(i, this.particleStates.length);
            state.sceneObject.getTransform().setWorldPosition(state.restPosition);
        }
        
        this._isAtTarget = false;
    }
    
    private transformToWorld(localPos: vec3): vec3 {
        const sx = localPos.x * this.scale.x;
        const sy = localPos.y * this.scale.y;
        const sz = localPos.z * this.scale.z;
        
        const toRad = 0.01745329251;
        const rx = this.rot.x * toRad, ry = this.rot.y * toRad, rz = this.rot.z * toRad;
        const cx = Math.cos(rx), snx = Math.sin(rx);
        const cy = Math.cos(ry), sny = Math.sin(ry);
        const cz = Math.cos(rz), snz = Math.sin(rz);
        
        // Y -> X -> Z rotation
        let x = sx * cy + sz * sny;
        let y = sy;
        let z = -sx * sny + sz * cy;
        
        let y2 = y * cx - z * snx;
        let z2 = y * snx + z * cx;
        y = y2; z = z2;
        
        let x2 = x * cz - y * snz;
        y2 = x * snz + y * cz;
        x = x2; y = y2;
        
        const local = new vec3(x + this.pos.x, y + this.pos.y, z + this.pos.z);
        
        return this.vfxTransform ? this.vfxTransform.getWorldTransform().multiplyPoint(local) : local;
    }
    
    private getCircularPosition(index: number, total: number): vec3 {
        const angle = (index / Math.max(total, 1)) * Math.PI * 2 + (this.circleRotationOffset * Math.PI / 180);
        let x = 0, y = 0, z = 0;
        
        if (this.circlePlane === 0) { x = Math.cos(angle) * this.circleRadius; z = Math.sin(angle) * this.circleRadius; }
        else if (this.circlePlane === 1) { x = Math.cos(angle) * this.circleRadius; y = Math.sin(angle) * this.circleRadius; }
        else { y = Math.sin(angle) * this.circleRadius; z = Math.cos(angle) * this.circleRadius; }
        
        return new vec3(this.circleCenter.x + x, this.circleCenter.y + y, this.circleCenter.z + z);
    }
    
    private cloneChildMaterials(parent: SceneObject): void {
        for (let i = 0; i < parent.getChildrenCount(); i++) {
            const child = parent.getChild(i);
            const rmv = child.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (rmv && rmv.mainMaterial) rmv.mainMaterial = rmv.mainMaterial.clone();
            this.cloneChildMaterials(child);
        }
    }
    
    private destroySpawnedObjects(): void {
        for (const state of this.particleStates) {
            if (state.sceneObject) state.sceneObject.destroy();
        }
        this.particleStates = [];
    }
    
    private onUpdate(): void {
        this.frameCount++;
        
        if (!this.initialized && this.frameCount >= 5) {
            this.tryInitialize();
            return;
        }
        
        if (!this.initialized) return;
        
        if (this.continuousUpdate) {
            this.syncFromVFX();
            this.updatePositions();
            
            for (const state of this.particleStates) {
                if (!state.tweenActive) {
                    const pos = state.isAtTarget ? state.targetPosition : state.restPosition;
                    state.sceneObject.getTransform().setWorldPosition(pos);
                }
            }
        }
    }
    
    private syncFromVFX(): void {
        if (!this.vfxComponent?.asset) return;
        try {
            const props = this.vfxComponent.asset.properties as any;
            if (props.pos) this.pos = props.pos;
            if (props.scale) this.scale = props.scale;
            if (props.rot) this.rot = props.rot;
        } catch (e) {}
    }
    
    private updatePositions(): void {
        if (!this.posTextureProvider) return;
        
        const totalPixels = this.texWidth * this.texHeight;
        const posPixels = new Uint8Array(totalPixels * 4);
        this.posTextureProvider.getPixels(0, 0, this.texWidth, this.texHeight, posPixels);
        
        let validIndex = 0;
        for (let i = 0; i < totalPixels && validIndex < this.particleStates.length; i++) {
            const idx = i * 4;
            if (posPixels[idx + 3] < 128) continue;
            
            const state = this.particleStates[validIndex];
            const localPos = new vec3(posPixels[idx] / 255 - 0.5, posPixels[idx + 1] / 255 - 0.5, posPixels[idx + 2] / 255 - 0.5);
            state.targetPosition = this.transformToWorld(localPos);
            state.restPosition = this.getCircularPosition(validIndex, this.particleStates.length);
            validIndex++;
        }
    }
    
    private setObjectColor(obj: SceneObject, color: vec4): void {
        const rmv = obj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
        if (rmv?.mainMaterial?.mainPass) {
            try { rmv.mainMaterial.mainPass.baseColor = color; } 
            catch { try { rmv.mainMaterial.mainPass.mainColor = color; } catch {} }
        }
        for (let i = 0; i < obj.getChildrenCount(); i++) this.setObjectColor(obj.getChild(i), color);
    }
    
    // ============ PUBLIC API ============
    
    public toggle(): void {
        if (!this.initialized) return;
        this._isAtTarget ? this.tweenToCircle() : this.tweenToParticles();
    }
    
    public tweenToParticles(): void {
        if (!this.initialized || this._isAtTarget) return;
        this._isAtTarget = true;
        this.tweenAll(true);
    }
    
    public tweenToCircle(): void {
        if (!this.initialized || !this._isAtTarget) return;
        this._isAtTarget = false;
        this.tweenAll(false);
    }
    
    private tweenAll(toTarget: boolean): void {
        for (let i = 0; i < this.particleStates.length; i++) {
            const index = i;
            const delayEvent = this.createEvent("DelayedCallbackEvent");
            delayEvent.bind(() => this.tweenOne(index, toTarget));
            delayEvent.reset((i * this.staggerDelay) / 1000);
        }
    }
    
    private tweenOne(index: number, toTarget: boolean): void {
        const state = this.particleStates[index];
        if (!state || state.tweenActive) return;
        
        const transform = state.sceneObject.getTransform();
        const endPos = toTarget ? state.targetPosition : state.restPosition;
        
        state.tweenActive = true;
        
        LSTween.moveFromToWorld(transform, transform.getWorldPosition(), endPos, this.tweenDuration)
            .easing(Easing.Cubic.InOut)
            .onComplete(() => {
                state.isAtTarget = toTarget;
                state.tweenActive = false;
            })
            .start();
    }
    
    public isAtParticlePositions(): boolean { return this._isAtTarget; }
    public isAnyTweening(): boolean { return this.particleStates.some(s => s.tweenActive); }
    public getObjectCount(): number { return this.particleStates.length; }
    
    onDestroy(): void { this.destroySpawnedObjects(); }
}