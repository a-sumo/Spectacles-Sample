import { Gemini } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAI";
import { GeminiTypes } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAITypes";
import { SnapCloudRequirements } from '../Examples/SnapCloudRequirements';
import { createClient } from 'SupabaseClient.lspkg/supabase-snapcloud';
import { RectangleButton } from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';

@component
export class ObjectCaptureAndStore extends BaseScriptComponent {
  
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  snapCloudRequirements: SnapCloudRequirements;

  @input
  @hint("Image texture to analyze")
  imageTexture: Texture;

  @input
  @allowUndefined
  @hint("Optional: RectangleButton to trigger capture and store")
  captureButton: RectangleButton;

  @input
  @allowUndefined
  @hint("Optional: Text component to display results")
  resultText: Text;

  private client: any;
  private uid: string;
  private readonly tableName: string = "captured_objects";
  private delayedEvent: DelayedCallbackEvent;

  onAwake() {
    this.setupButton();
    
    // Use delayed callback instead of OnStartEvent
    // this.delayedEvent = this.createEvent("DelayedCallbackEvent") as DelayedCallbackEvent;
    // this.delayedEvent.bind(() => {
    this.initSupabase();
    // });
    // this.delayedEvent.reset(0.5); // Wait 0.5 seconds
  }

  private setupButton() {
    if (this.captureButton) {
      this.captureButton.onTriggerUp.add(() => {
        this.captureAndStore();
      });
    }
  }

  async initSupabase() {
    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.log("Not configured");
      return;
    }

    const supabaseProject = this.snapCloudRequirements.getSupabaseProject();
    this.client = createClient(supabaseProject.url, supabaseProject.publicToken);
    
    if (this.client) {
      await this.signInUser();
    }
  }

  async signInUser() {
    const { data, error } = await this.client.auth.signInWithIdToken();
    
    if (error) {
      this.log("Auth error");
    } else {
      const { user } = data;
      this.uid = user.id;
      print("uid"+this.uid)
      this.log("Ready!");
    }
  }

  public captureAndStore() {
    if (!this.uid) {
      this.log("Not authenticated");
      return;
    }

    this.log("Capturing...");

    Base64.encodeTextureAsync(
      this.imageTexture,
      (base64Image) => {
        this.analyzeAndStore(base64Image);
      },
      () => {
        this.log("Encode failed");
      },
      CompressionQuality.LowQuality,
      EncodingType.Jpg
    );
  }

  private async analyzeAndStore(base64Image: string) {
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

    try {
      const response = await Gemini.models(request);
      const textResponse = response.candidates[0]?.content?.parts?.[0]?.text;

      if (!textResponse) {
        this.log("No response");
        return;
      }

      const cleaned = textResponse.trim().replace(/```json\n?|\n?```/g, '');
      let data = JSON.parse(cleaned);

      if (Array.isArray(data)) {
        data = data[0];
      }

      this.log(`${data.object}\n${data.color.pigment_name}`);

      await this.storeToDatabase(data);

    } catch (error) {
      this.log("Error: " + error);
    }
  }

  private async storeToDatabase(objectData: any) {
    this.log("Storing...");

    const record = {
      category: objectData.category,
      object_name: objectData.object,
      color_hex: objectData.color?.hex,
      color_pigment: objectData.color?.pigment_name,
      color_family: objectData.color?.color_family,
      captured_at: new Date().toISOString(),
      user_id: this.uid
    };

    const { data, error } = await this.client
      .from(this.tableName)
      .insert(record)
      .select();

    if (error) {
      this.log("DB error: " + error.message);
    } else {
      this.log("Saved! " + data[0]?.id);
    }
  }

  private log(message: string) {
    print("[ObjectCaptureAndStore] " + message);
    if (this.resultText) {
      this.resultText.text = message;
    }
  }

  onDestroy() {
    if (this.client) {
      this.client.removeAllChannels();
    }
  }
}