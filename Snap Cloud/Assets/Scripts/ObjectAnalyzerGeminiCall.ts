import { Gemini } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAI";
import { GeminiTypes } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAITypes";
import { RectangleButton } from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';

@component
export class ObjectAnalyzer extends BaseScriptComponent {
  
  @input
  @hint("Image texture to analyze")
  imageTexture: Texture;

  @input
  @allowUndefined
  @hint("Optional: RectangleButton to trigger analysis (from Spectacles UI Kit)")
  analyzeButton: RectangleButton;

  @input
  @allowUndefined
  @hint("Optional: Text component to display results")
  resultText: Text;

  onAwake() {
    this.setupButton();
  }

  private setupButton() {
    if (this.analyzeButton) {
      this.analyzeButton.onTriggerUp.add(() => {
        this.log("Button pressed - analyzing image...");
        this.analyzeImage();
      });
      this.log("Button configured");
    } else {
      this.log("No button assigned - call analyzeImage() manually");
    }
  }

  public analyzeImage() {
    this.log("Encoding image...");
    
    Base64.encodeTextureAsync(
      this.imageTexture,
      (base64Image) => {
        this.sendToGemini(base64Image);
      },
      () => {
        this.log("Failed to encode image");
      },
      CompressionQuality.LowQuality,
      EncodingType.Jpg
    );
  }

  private sendToGemini(base64Image: string) {
    this.log("Analyzing...");

    const request: GeminiTypes.Models.GenerateContentRequest = {
      model: "gemini-2.0-flash",
      type: "generateContent",
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image
                }
              },
              {
                text: `Identify the main object in this image.
Respond with ONLY valid JSON object (not an array), no other text:

{
  "category": "string",
  "object": "string",
  "color": {
    "hex": "#RRGGBB",
    "pigment_name": "string",
    "color_family": "string"
  }
}

Rules:
- category: broad type (fruit, furniture, clothing, electronics, etc)
- object: specific name, lowercase singular (apple, chair, shoe)
- hex: exact dominant color as hex code
- pigment_name: artistic name (Cadmium Red, Ultramarine, Burnt Sienna, Viridian, etc)
- color_family: basic color (red, blue, green, yellow, brown, etc)`
              }
            ]
          }
        ]
      }
    };

    Gemini.models(request)
      .then((response) => {
        const textResponse = response.candidates[0]?.content?.parts?.[0]?.text;
        
        if (textResponse) {
          const cleaned = textResponse.trim().replace(/```json\n?|\n?```/g, '');
          
          try {
            let data = JSON.parse(cleaned);
            
            // Handle array response - take first element
            if (Array.isArray(data)) {
              data = data[0];
            }
            
            const objectName = data.object || "unknown";
            const hex = data.color?.hex || "";
            const pigment = data.color?.pigment_name || "";
            const family = data.color?.color_family || "";
            
            this.log(`${objectName}\n${pigment}\n${hex}`);
            
            print("Result: " + JSON.stringify(data));
            
          } catch (e) {
            print("Parse error: " + e);
            this.log("Parse error");
          }
        } else {
          this.log("No response");
        }
      })
      .catch((error) => {
        print("Gemini error: " + error);
        this.log("Error: " + error);
      });
  }

  private log(message: string) {
    print("[ObjectAnalyzer] " + message);
    if (this.resultText) {
      this.resultText.text = message;
    }
  }
}