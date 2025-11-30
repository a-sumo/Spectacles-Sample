//@input Component.VFXComponent vfx {"label": "VFX Component"}

var pause = false;

validateInputs();

function onTap() {
    pause = !pause;
    script.vfx.paused = (pause ? 1 : 0);
}

function validateInputs() {
    if (!script.vfx) {
        print("ERROR: Please set the VFX component to the script.");
        return;
    }
    if (!script.vfx.asset) {
        print("ERROR: Please make sure VFX component contains VFX asset.");
        return;
    }
}

var tapEvent = script.createEvent("TapEvent");
tapEvent.bind(onTap);