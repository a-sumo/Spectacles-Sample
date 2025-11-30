
// @input Component.VFXComponent vfxComp { "label" : "VFX Component" }
// @input int timeMode { "label" : "Time Mode" ,  "widget" : "combobox", "values" : [ { "label" : "Studio Elapsed Time" , "value" : "0" } , { "label" : "VFX Component Time", "value" : "1" } ], "hint": "Time in seconds. Studio Elapsed Time returns the time since the lens was started; VFX Component Time returns the time since the object was enabled."}
// @input float timeSpeed = 1.0 { "label" : "Time Multiplier" }
// @input Asset.AnimationCurveTrack animationCurve { "hint": "Animation Curve Track input. Only the first curve will be used for the control." }
// @input int wrapMode { "label" : "Wrap Mode" ,  "widget" : "combobox", "values" : [ { "label" : "Clamp" , "value" : "0" } , { "label" : "Mirrored Repeat", "value" : "1" } , { "label" : "Repeat", "value" : "2" } ], "hint": "Wrap mode determines how the curve behaves when the sample point falls outside the range of the curve."}
// @input float curveValueMult { "label" : "Curve Value Multiplier" }
// @input Component.Text text


if (!script.vfxComp) {
    print("ERROR: Please set the VFX component to the script.");
    return;
}
if (!script.vfxComp.asset) {
    print("ERROR: Please make sure VFX component contains VFX asset.");
    return;
}

if (!script.animationCurve) {
    print("ERROR: Please set the Animation Curve Track to the script.");
    return;
}

if (!script.animationCurve.getPropertyKeys()[0]) {
    print("ERROR: Please create a track under the Animation Curve Track.");
    return;
}

var elapsedTime;
var curve = script.animationCurve;
var curveName = curve.getPropertyKeys()[0];
var vfxComp = script.vfxComp;

function onUpdate() {
    
    if (script.timeMode == 0){
        elapsedTime = getTime();
    }
    else{
        // VFX pre component accumulated time
        elapsedTime = vfxComp.time();
    }
    
    var value = curve.getProperty(curveName).evaluate(wrapMode(script.wrapMode, elapsedTime * script.timeSpeed));
    vfxComp.asset.playRate = value * script.curveValueMult;
    
    if(script.text) {
        script.text.text = "EDIT CURVE TO CONTROL THE SPEED. \n CURRENT SPEED IS: " + (value * script.curveValueMult).toFixed(2);
    }

}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

////////////////////////////////////////////////  
/// Other Fonctions
//////////////////////////////////////////////// 

function wrapMode( mode, time){
    var samplePoint;
    // Clamp
    if ( mode == 0 ) {
		samplePoint = clamp( time, 0.0, 1.0 );
	}
	// Mirrored Repeat
	if ( mode == 1 ) {
		samplePoint = fract( time * 0.5 ) * 2.0;
		samplePoint = 1.0 - Math.abs( samplePoint - 1.0 );
	}	
    // Repeat
	if ( mode == 2 ) {
		samplePoint = fract( time );
	}
    return samplePoint;
}

function fract(x) {
    return x - Math.floor(x);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function validateInputs() {
    
}
