//@input Asset.Material material {"label": "Mix Material"}

//@ui {"widget": "separator"}
//@ui {"widget": "label", "label": "Pigment 0"}
//@input vec3 pig0Color = {1, 1, 1} {"widget": "color"}
//@input float pig0Conc = 0.2 {"widget": "slider", "min": 0, "max": 1, "step": 0.01}

//@ui {"widget": "separator"}
//@ui {"widget": "label", "label": "Pigment 1"}
//@input vec3 pig1Color = {0.08, 0.08, 0.08} {"widget": "color"}
//@input float pig1Conc = 0.2 {"widget": "slider", "min": 0, "max": 1, "step": 0.01}

//@ui {"widget": "separator"}
//@ui {"widget": "label", "label": "Pigment 2"}
//@input vec3 pig2Color = {1, 0.92, 0} {"widget": "color"}
//@input float pig2Conc = 0.2 {"widget": "slider", "min": 0, "max": 1, "step": 0.01}

//@ui {"widget": "separator"}
//@ui {"widget": "label", "label": "Pigment 3"}
//@input vec3 pig3Color = {0.89, 0, 0.13} {"widget": "color"}
//@input float pig3Conc = 0.15 {"widget": "slider", "min": 0, "max": 1, "step": 0.01}

//@ui {"widget": "separator"}
//@ui {"widget": "label", "label": "Pigment 4"}
//@input vec3 pig4Color = {0.1, 0.1, 0.7} {"widget": "color"}
//@input float pig4Conc = 0.15 {"widget": "slider", "min": 0, "max": 1, "step": 0.01}

//@ui {"widget": "separator"}
//@ui {"widget": "label", "label": "Pigment 5"}
//@input vec3 pig5Color = {0, 0.47, 0.44} {"widget": "color"}
//@input float pig5Conc = 0.1 {"widget": "slider", "min": 0, "max": 1, "step": 0.01}

var NUM_PIGMENTS = 6;
var proceduralTexture = null;
var mainPass = null;

function initialize() {
    if (!script.material) {
        print("ColorMixTest: No material assigned!");
        return;
    }
    
    mainPass = script.material.mainPass;
    
    // Create procedural texture with format
    proceduralTexture = ProceduralTextureProvider.createWithFormat(NUM_PIGMENTS, 1, TextureFormat.RGBA8Unorm);
    
    // Assign to material
    mainPass.pigmentTex = proceduralTexture;
    mainPass.numPigments = NUM_PIGMENTS;
    mainPass.texWidth = NUM_PIGMENTS;
    
    // Build initial pixels
    rebuildPixels();
    
    print("ColorMixTest initialized with " + NUM_PIGMENTS + " pigments");
}

function rebuildPixels() {
    // Create Uint8Array for RGBA data (4 bytes per pixel, 0-255)
    var pixels = new Uint8Array(NUM_PIGMENTS * 1 * 4);
    
    // Pigment 0
    pixels[0] = Math.round(script.pig0Color.x * 255);
    pixels[1] = Math.round(script.pig0Color.y * 255);
    pixels[2] = Math.round(script.pig0Color.z * 255);
    pixels[3] = Math.round(script.pig0Conc * 255);
    
    // Pigment 1
    pixels[4] = Math.round(script.pig1Color.x * 255);
    pixels[5] = Math.round(script.pig1Color.y * 255);
    pixels[6] = Math.round(script.pig1Color.z * 255);
    pixels[7] = Math.round(script.pig1Conc * 255);
    
    // Pigment 2
    pixels[8] = Math.round(script.pig2Color.x * 255);
    pixels[9] = Math.round(script.pig2Color.y * 255);
    pixels[10] = Math.round(script.pig2Color.z * 255);
    pixels[11] = Math.round(script.pig2Conc * 255);
    
    // Pigment 3
    pixels[12] = Math.round(script.pig3Color.x * 255);
    pixels[13] = Math.round(script.pig3Color.y * 255);
    pixels[14] = Math.round(script.pig3Color.z * 255);
    pixels[15] = Math.round(script.pig3Conc * 255);
    
    // Pigment 4
    pixels[16] = Math.round(script.pig4Color.x * 255);
    pixels[17] = Math.round(script.pig4Color.y * 255);
    pixels[18] = Math.round(script.pig4Color.z * 255);
    pixels[19] = Math.round(script.pig4Conc * 255);
    
    // Pigment 5
    pixels[20] = Math.round(script.pig5Color.x * 255);
    pixels[21] = Math.round(script.pig5Color.y * 255);
    pixels[22] = Math.round(script.pig5Color.z * 255);
    pixels[23] = Math.round(script.pig5Conc * 255);
    
    // Update the procedural texture
    proceduralTexture.control.setPixels(0, 0, NUM_PIGMENTS, 1, pixels);
}

function update() {
    rebuildPixels();
}

script.createEvent("OnStartEvent").bind(initialize);
script.createEvent("UpdateEvent").bind(update);