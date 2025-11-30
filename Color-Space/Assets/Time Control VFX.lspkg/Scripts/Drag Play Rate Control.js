// @input Asset.VFXAsset vfxAsset {"label": "VFX Asset"}
// @input Component.Text text

var pause = false;
var speedControl = 1.0;
var touchPos = new vec2(0.5, 0.4);

if (!script.vfxAsset) {
    print("ERROR: Please set the VFX asset to the script.");
    return;
}

function onTouchMove(eventData) {
    touchPos = eventData.getTouchPosition();
}

function onTap(eventData) {
    touchPos = eventData.getTapPosition();
}

function onUpdate() {
    var speedControl = ((touchPos.y * 2.0) - 1.0) * -5.0;
    
    script.vfxAsset.playRate = speedControl;
    
    if(script.text) {
        script.text.text = "DRAG TO CONTROL THE SPEED. \n CURRENT SPEED IS: " + speedControl.toFixed(2);
    }
}

var touchMoveEvent = script.createEvent("TouchMoveEvent");
touchMoveEvent.bind(onTouchMove);

var tapEvent = script.createEvent("TapEvent");
tapEvent.bind(onTap);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);