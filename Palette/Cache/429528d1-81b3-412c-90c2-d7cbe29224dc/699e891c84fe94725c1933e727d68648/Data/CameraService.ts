import { CameraServiceConfig } from './CameraServiceConfigs';

@component
export class CameraService extends BaseScriptComponent {
  @input config: CameraServiceConfig;

  private isEditor = global.deviceInfoSystem.isEditor();
  private camTexture = null;
  private cropProvider = null;
  private camModule: CameraModule = require("LensStudio:CameraModule") as CameraModule;

  // Cached references
  private editorCamera: Camera;
  private specsLeftCamera: Camera;
  private specsRightCamera: Camera;
  private screenCropTexture: Texture;
  private deviceCamTexture: Texture;

  onAwake() {
    this.resolveConfig();
    this.createEvent("OnStartEvent").bind(this.start.bind(this));
  }

  private resolveConfig() {
    this.editorCamera = this.config.getEditorCamera();
    this.specsLeftCamera = this.config.leftSpecsCamera;
    this.specsRightCamera = this.config.rightSpecsCamera;
    this.screenCropTexture = this.config.screenCropTexture;
    this.deviceCamTexture = this.config.deviceCamTexture;
  }

  start() {
    const camID = this.isEditor
      ? CameraModule.CameraId.Default_Color
      : CameraModule.CameraId.Right_Color;

    const camRequest = CameraModule.createCameraRequest();
    camRequest.cameraId = camID;
    camRequest.imageSmallerDimension = this.isEditor ? 352 : 756;

    this.camTexture = this.camModule.requestCamera(camRequest);
    const camTexControl = this.camTexture.control as CameraTextureProvider;
    camTexControl.onNewFrame.add(() => {});

    this.cropProvider = this.screenCropTexture.control as CameraTextureProvider;
    this.cropProvider.inputTexture = this.camTexture;

    if (this.isEditor) return;

    const leftTrackingCamera = global.deviceInfoSystem.getTrackingCameraForId(camID);
    const rightTrackingCamera = global.deviceInfoSystem.getTrackingCameraForId(
      CameraModule.CameraId.Right_Color
    );

    this.setupVirtualCamera(this.specsLeftCamera, leftTrackingCamera);
    this.setupVirtualCamera(this.specsRightCamera, rightTrackingCamera);
  }

  private setupVirtualCamera(camComp: Camera, trackingCam: any) {
    const camTrans = camComp.getSceneObject().getTransform();
    camTrans.setLocalTransform(trackingCam.pose);

    const aspect = trackingCam.resolution.x / trackingCam.resolution.y;
    camComp.aspect = aspect;

    const avgFocalLengthPixels = (trackingCam.focalLength.x + trackingCam.focalLength.y) / 2;
    const fovRadians = 2 * Math.atan(trackingCam.resolution.y / 2 / avgFocalLengthPixels);
    camComp.fov = fovRadians;
  }

  worldToEditorCameraSpace(worldPos: vec3): vec2 {
    return this.cameraToScreenSpace(this.editorCamera, worldPos);
  }

  worldToTrackingLeftCameraSpace(worldPos: vec3): vec2 {
    return this.cameraToScreenSpace(this.specsLeftCamera, worldPos);
  }

  worldToTrackingRightCameraSpace(worldPos: vec3): vec2 {
    return this.cameraToScreenSpace(this.specsRightCamera, worldPos);
  }

  private cameraToScreenSpace(camComp: Camera, worldPos: vec3): vec2 {
    const screenPoint = camComp.worldSpaceToScreenSpace(worldPos);
    const localX = this.remap(screenPoint.x, 0, 1, -1, 1);
    const localY = this.remap(screenPoint.y, 1, 0, -1, 1);
    return new vec2(localX, localY);
  }

  private remap(value: number, low1: number, high1: number, low2: number, high2: number): number {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
  }
}