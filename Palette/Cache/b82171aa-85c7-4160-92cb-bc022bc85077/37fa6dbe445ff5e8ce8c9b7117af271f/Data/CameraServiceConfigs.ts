@component
export class CameraServiceConfig extends BaseScriptComponent {
  @input cameraObject: SceneObject;
  @input leftSpecsCamera: Camera;
  @input rightSpecsCamera: Camera;
  @input screenCropTexture: Texture;
  @input deviceCamTexture: Texture;

  getEditorCamera(): Camera {
    return this.cameraObject.getComponent("Component.Camera") as Camera;
  }
}