# ObjectAnalyzerGeminiCall

## Setup in Lens Studio

1. Create a new Script component
2. Attach this script
3. Assign:
   - `textDisplay` → a Text component in your scene
   - `cameraTexture` → your camera's render target texture (e.g., `Device Camera Texture`)

## What it does
```
[Pinch / Tap]
     ↓
[Capture camera → base64]
     ↓
[Send to Gemini with image + structured prompt]
     ↓
[Parse JSON response]
     ↓
[Display: "apple / Cadmium Red / #E63946"]