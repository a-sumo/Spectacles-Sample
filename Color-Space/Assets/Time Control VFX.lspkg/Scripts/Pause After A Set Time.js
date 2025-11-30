// @input Component.VFXComponent vfxComp {"label": "VFX Component"}
// @input float threshold = 1.0 {"label": "Time To Pause (secs)", "hint": "When time reaches this value, the simulation will pause."}
// @input float playRate = 1.0 {"label": "Play Rate", "hint": "Simulation speed, a multiplier to the delta time."}
// @input bool useFixedDeltaTime = 1.0 {"label": "Use Fixed Delta Time", "hint": "Delta time helps VFX behave consistently across different devices or when frame rates fluctuate."}
// @input float fixedDeltaTime = 0.0333333 {"label": "Fixed Delta Time", "showIf":"useFixedDeltaTime"}
// @input Component.Text text


var vfxComp = script.vfxComp;
var vfxAsset = vfxComp.asset;

if (!script.vfxComp) {
    print("ERROR: Please set the VFX component to the script.");
    return;
}
if (!script.vfxComp.asset) {
    print("ERROR: Please make sure VFX component contains VFX asset.");
    return;
}

function onUpdate() {
    
    vfxAsset.useFixedDeltaTime = script.useFixedDeltaTime;
    vfxAsset.fixedDeltaTime = script.fixedDeltaTime;
    vfxAsset.playRate = script.playRate;
    
    if (vfxComp.time() >= script.threshold){
        vfxComp.paused = 1;
    }
    
    if(script.text) {
        script.text.text = "SET TIME FROM SCRIPT TO PAUSE \n THE SIMULATION \n CURRENT TIME IS: " + (vfxComp.time()).toFixed(2);
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);