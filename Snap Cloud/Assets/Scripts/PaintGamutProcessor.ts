import { SnapCloudRequirements } from '../Examples/SnapCloudRequirements';
import { RectangleButton } from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';
import { Gemini } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAI";
import { GeminiTypes } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAITypes";

// ============================================================================
// TYPES
// ============================================================================

interface LabColor {
  l: number;
  a: number;
  b: number;
}

interface PaletteColor {
  rgb: number[];
  hex: string;
  lab: LabColor;
  population: number;
}

interface ProjectedColor extends PaletteColor {
  originalRgb: number[];
  originalHex: string;
  de: number;
}

interface ExtractedPigment {
  name: string;
  rgb: number[];
}

interface Statistics {
  averageDeltaE: number;
  maxDeltaE: number;
  minDeltaE: number;
  method: string;
}

interface PaintGamutResult {
  success: boolean;
  imageSize: { width: number; height: number };
  extractedPalette: PaletteColor[];
  projectedPalette: ProjectedColor[];
  gamutSize: number;
  pigments: { name: string; rgb: number[] }[];
  statistics: Statistics;
  remappedImageBase64?: string;
  remappedWidth?: number;
  remappedHeight?: number;
  error?: string;
  details?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

@component
export class PaintGamutProcessor extends BaseScriptComponent {

  private internetModule: InternetModule = require('LensStudio:InternetModule');
  private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');

  // -------------------------------------------------------------------------
  // CONFIGURATION
  // -------------------------------------------------------------------------

  @input
  @hint("Reference to SnapCloudRequirements")
  snapCloudRequirements: SnapCloudRequirements;

  @input
  @hint("Edge Function name")
  functionName: string = "paint-gamut";

  @input
  @hint("Storage bucket for input images")
  inputBucket: string = "uploads";

  // -------------------------------------------------------------------------
  // INPUT IMAGES
  // -------------------------------------------------------------------------

  @input
  @hint("URL or path to the PAINTING image to process")
  paintingImageUrl: string = "";

  @input
  @hint("URL or path to your PALETTE photo (paint tubes, swatches, etc.)")
  paletteImageUrl: string = "";

  @input
  @hint("Texture of palette image (for Gemini)")
  @allowUndefined
  paletteTexture: Texture;

  // -------------------------------------------------------------------------
  // PROCESSING OPTIONS
  // -------------------------------------------------------------------------

  @input
  @hint("Number of colors (2-48)")
  numColors: number = 24;

  @input
  @hint("Dither: 'none', 'floyd', 'atkinson'")
  ditherMethod: string = "floyd";

  @input
  @hint("Dither strength (0-1)")
  ditherStrength: number = 0.85;

  @input
  @hint("Max output image size")
  maxOutputSize: number = 512;

  @input
  @hint("Use default pigments if Gemini extraction fails")
  useDefaultPigmentsOnFail: boolean = true;

  @input
  @hint("Automatically extract palette before processing (uses paletteTexture or paletteImageUrl)")
  autoExtractPalette: boolean = true;

  // -------------------------------------------------------------------------
  // DISPLAYS
  // -------------------------------------------------------------------------

  @input
  @hint("Image for ORIGINAL painting")
  originalImageDisplay: Image;

  @input
  @hint("Image for REMAPPED output")
  remappedImageDisplay: Image;

  @input
  @hint("Image for PALETTE photo preview")
  @allowUndefined
  palettePhotoDisplay: Image;

  @input
  @hint("Extracted palette swatches")
  extractedPaletteSwatches: Image[];

  @input
  @hint("Projected palette swatches")
  projectedPaletteSwatches: Image[];

  @input
  @hint("Pigment swatches (from Gemini extraction)")
  @allowUndefined
  pigmentSwatches: Image[];

  @input
  @allowUndefined
  statusText: Text;

  @input
  @allowUndefined
  statisticsText: Text;

  @input
  @allowUndefined
  pigmentListText: Text;

  @input
  @allowUndefined
  @hint("Main process button - extracts palette (if needed) then processes")
  processButton: RectangleButton;

  @input
  @allowUndefined
  @hint("Button to ONLY extract palette from photo")
  extractPaletteButton: RectangleButton;

  @input
  enableDebugLogs: boolean = true;

  // -------------------------------------------------------------------------
  // STATE
  // -------------------------------------------------------------------------

  private isInitialized: boolean = false;
  private isProcessing: boolean = false;
  private isExtractingPalette: boolean = false;
  private lastResult: PaintGamutResult | null = null;
  private originalTexture: Texture | null = null;
  private remappedTexture: Texture | null = null;

  // Custom pigments extracted from palette photo
  private customPigments: ExtractedPigment[] = [];
  private useCustomPigments: boolean = false;
  private paletteReady: boolean = false;

  // Pending painting URL (when waiting for palette extraction)
  private pendingPaintingUrl: string | null = null;

  private onCompleteCallbacks: ((result: PaintGamutResult) => void)[] = [];
  private onErrorCallbacks: ((error: string) => void)[] = [];
  private onPigmentsExtractedCallbacks: ((pigments: ExtractedPigment[]) => void)[] = [];

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  onAwake() {
    this.log("Initializing PaintGamutProcessor with Gemini support...");
    this.initialize();
    this.setupButtons();
  }

  private initialize(): void {
    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.log("ERROR: SnapCloudRequirements not configured");
      this.updateStatus("Not configured");
      return;
    }

    this.isInitialized = true;
    this.log("Initialized successfully");
    this.updateStatus("Ready");
  }

  private setupButtons(): void {
    // Main process button - does full workflow
    if (this.processButton) {
      this.processButton.onTriggerUp.add(() => {
        this.log("=== PROCESS BUTTON PRESSED ===");
        this.startFullWorkflow();
      });
    }

    // Palette-only button
    if (this.extractPaletteButton) {
      this.extractPaletteButton.onTriggerUp.add(() => {
        this.log("=== EXTRACT PALETTE BUTTON PRESSED ===");
        this.extractPaletteFromPhoto();
      });
    }
  }

  // =========================================================================
  // FULL WORKFLOW (Main Entry Point)
  // =========================================================================

  /**
   * Main workflow: Extract palette first (if needed), then process painting.
   * This is the recommended entry point.
   */
  startFullWorkflow(paintingUrl?: string, paletteUrl?: string): void {
    if (!this.isInitialized) {
      this.notifyError("Not initialized");
      return;
    }

    if (this.isProcessing || this.isExtractingPalette) {
      this.log("Already busy - ignoring");
      return;
    }

    if (!global.deviceInfoSystem.isInternetAvailable()) {
      this.notifyError("No internet");
      return;
    }

    // Determine painting URL
    const targetPaintingUrl = this.buildImageUrl(paintingUrl || this.paintingImageUrl);
    if (!targetPaintingUrl) {
      this.notifyError("No painting image specified");
      return;
    }

    // Check if we need to extract palette first
    const shouldExtractPalette = this.autoExtractPalette && 
      !this.paletteReady && 
      (this.paletteTexture || this.paletteImageUrl || paletteUrl);

    if (shouldExtractPalette) {
      this.log("Starting palette extraction first, then will process painting");
      // Store the painting URL to process after palette extraction
      this.pendingPaintingUrl = targetPaintingUrl;
      // Start palette extraction - it will call processPaintingInternal when done
      this.extractPaletteFromPhoto(paletteUrl);
    } else {
      // No palette extraction needed, process directly
      this.log("Palette ready or not needed, processing painting directly");
      this.processPaintingInternal(targetPaintingUrl);
    }
  }

  // =========================================================================
  // GEMINI PALETTE EXTRACTION
  // =========================================================================

  /**
   * Extract pigment colors from a photo of your paint palette using Gemini.
   * Can be called standalone or as part of startFullWorkflow.
   */
  extractPaletteFromPhoto(paletteUrl?: string): void {
    if (this.isExtractingPalette) {
      this.log("Already extracting palette");
      return;
    }

    if (this.isProcessing) {
      this.log("Cannot extract palette while processing");
      return;
    }

    this.isExtractingPalette = true;
    this.paletteReady = false;
    this.updateStatus("Loading palette...");

    // If we have a texture, use it directly
    if (this.paletteTexture) {
      this.log("Using paletteTexture input");
      this.encodeAndAnalyzePalette(this.paletteTexture);
      return;
    }

    // Otherwise load from URL
    const url = this.buildImageUrl(paletteUrl || this.paletteImageUrl);
    if (!url) {
      this.isExtractingPalette = false;
      this.handlePaletteExtractionFailed("No palette image specified");
      return;
    }

    this.log("Loading palette from URL: " + url);
    this.loadPaletteFromUrl(url);
  }

  private loadPaletteFromUrl(url: string): void {
    try {
      const resource = (this.internetModule as any).makeResourceFromUrl(url);
      if (!resource) {
        this.handlePaletteExtractionFailed("Failed to create resource for palette URL");
        return;
      }

      this.remoteMediaModule.loadResourceAsImageTexture(
        resource,
        (texture: Texture) => {
          this.log("Palette image loaded from URL");
          
          // Show preview if available
          if (this.palettePhotoDisplay) {
            this.palettePhotoDisplay.enabled = true;
            this.palettePhotoDisplay.mainPass.baseTex = texture;
          }

          // Now encode and analyze
          this.encodeAndAnalyzePalette(texture);
        },
        (error: string) => {
          this.handlePaletteExtractionFailed("Failed to load palette image: " + error);
        }
      );
    } catch (e) {
      this.handlePaletteExtractionFailed("Error loading palette: " + e);
    }
  }

  private encodeAndAnalyzePalette(texture: Texture): void {
    this.updateStatus("Encoding palette...");

    Base64.encodeTextureAsync(
      texture,
      (base64: string) => {
        this.log("Palette texture encoded, length: " + base64.length);
        this.callGeminiForPalette(base64);
      },
      () => {
        this.handlePaletteExtractionFailed("Failed to encode palette texture");
      },
      CompressionQuality.LowQuality,
      EncodingType.Jpg
    );
  }

  private callGeminiForPalette(base64Image: string): void {
    this.updateStatus("Gemini analyzing...");
    this.log("Calling Gemini for palette extraction...");

    const systemPrompt = `You are an expert at identifying paint pigments and colors. 
Analyze the image of paint tubes, swatches, or palette and extract the pigment colors.
Return ONLY a valid JSON array of pigments, no other text.
Each pigment should have: name (string) and rgb (array of 3 numbers 0-255).
Identify the actual pigment names if visible (e.g., "Cadmium Red", "Ultramarine Blue").
If names aren't visible, use descriptive names (e.g., "Deep Red", "Sky Blue").
Extract between 4-16 distinct pigments. Include white and black if present.`;

    const userPrompt = `Extract the paint pigment colors from this image. Return ONLY valid JSON in this exact format:
[{"name": "Pigment Name", "rgb": [R, G, B]}, ...]`;

    const request: GeminiTypes.Models.GenerateContentRequest = {
      model: "gemini-2.0-flash",
      type: "generateContent",
      body: {
        contents: [
          {
            parts: [{ text: systemPrompt }],
            role: "model",
          },
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image
                }
              },
              { text: userPrompt }
            ],
            role: "user",
          },
        ],
      },
    };

    Gemini.models(request)
      .then((response) => {
        this.log("Gemini response received");
        this.parseGeminiPaletteResponse(response);
      })
      .catch((error) => {
        this.log("Gemini error: " + error);
        this.handlePaletteExtractionFailed("Gemini failed: " + error);
      });
  }

  private parseGeminiPaletteResponse(response: any): void {
    try {
      const textResponse = response.candidates[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error("No text in Gemini response");
      }

      this.log("Gemini text: " + textResponse);

      // Extract JSON from response (might have markdown code blocks)
      let jsonStr = textResponse;

      // Remove markdown code blocks if present
      const jsonMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      } else {
        // Try to find array brackets
        const arrayMatch = textResponse.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          jsonStr = arrayMatch[0];
        }
      }

      const pigments = JSON.parse(jsonStr) as ExtractedPigment[];

      if (!Array.isArray(pigments) || pigments.length === 0) {
        throw new Error("Invalid pigments array");
      }

      // Validate pigments
      const validPigments: ExtractedPigment[] = [];
      for (let i = 0; i < pigments.length; i++) {
        const p = pigments[i];
        if (p.name && Array.isArray(p.rgb) && p.rgb.length === 3) {
          validPigments.push({
            name: String(p.name),
            rgb: [
              Math.max(0, Math.min(255, Math.round(Number(p.rgb[0])))),
              Math.max(0, Math.min(255, Math.round(Number(p.rgb[1])))),
              Math.max(0, Math.min(255, Math.round(Number(p.rgb[2]))))
            ]
          });
        }
      }

      if (validPigments.length < 2) {
        throw new Error("Need at least 2 valid pigments, got " + validPigments.length);
      }

      // Success!
      this.customPigments = validPigments;
      this.useCustomPigments = true;
      this.paletteReady = true;
      this.isExtractingPalette = false;

      this.log("Extracted " + validPigments.length + " pigments:");
      for (let i = 0; i < validPigments.length; i++) {
        const p = validPigments[i];
        this.log("  " + p.name + ": RGB(" + p.rgb[0] + "," + p.rgb[1] + "," + p.rgb[2] + ")");
      }

      this.updatePigmentDisplay();
      this.updateStatus("Palette ready!");
      this.notifyPigmentsExtracted(validPigments);

      // If there's a pending painting, process it now
      this.processPendingPainting();

    } catch (e) {
      this.log("Parse error: " + e);
      this.handlePaletteExtractionFailed("Failed to parse Gemini response: " + e);
    }
  }

  private handlePaletteExtractionFailed(error: string): void {
    this.log("Palette extraction failed: " + error);
    this.isExtractingPalette = false;

    if (this.useDefaultPigmentsOnFail) {
      this.log("Using default pigments as fallback");
      this.useCustomPigments = false;
      this.paletteReady = true; // Mark as ready with defaults
      this.updateStatus("Using defaults");
      
      // Still process pending painting with defaults
      this.processPendingPainting();
    } else {
      this.pendingPaintingUrl = null;
      this.notifyError(error);
    }
  }

  private processPendingPainting(): void {
    if (this.pendingPaintingUrl) {
      const url = this.pendingPaintingUrl;
      this.pendingPaintingUrl = null;
      this.log("Processing pending painting: " + url);
      this.processPaintingInternal(url);
    }
  }

  private updatePigmentDisplay(): void {
    // Update pigment list text
    if (this.pigmentListText && this.customPigments.length > 0) {
      let text = "Pigments:\n";
      for (let i = 0; i < this.customPigments.length; i++) {
        const p = this.customPigments[i];
        text += p.name + "\n";
      }
      this.pigmentListText.text = text;
    }

    // Update pigment swatches
    if (this.pigmentSwatches) {
      for (let i = 0; i < this.pigmentSwatches.length; i++) {
        const swatch = this.pigmentSwatches[i];
        if (!swatch) continue;

        if (i < this.customPigments.length) {
          const p = this.customPigments[i];
          swatch.enabled = true;
          if (swatch.mainPass) {
            swatch.mainPass.baseColor = new vec4(p.rgb[0] / 255, p.rgb[1] / 255, p.rgb[2] / 255, 1.0);
          }
        } else {
          swatch.enabled = false;
        }
      }
    }
  }

  // =========================================================================
  // URL BUILDING
  // =========================================================================

  private buildImageUrl(urlOrPath: string): string | null {
    if (!urlOrPath || urlOrPath.length === 0) return null;

    // Check if it's already a full URL
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      return urlOrPath;
    }

    // Build from storage path
    const storageBase = this.snapCloudRequirements.getStorageApiUrl();
    return storageBase + this.inputBucket + "/" + urlOrPath;
  }

  // =========================================================================
  // PAINTING PROCESSING (Internal)
  // =========================================================================

  /**
   * Process painting directly (called internally after palette is ready)
   */
  private processPaintingInternal(imageUrl: string): void {
    if (this.isProcessing) {
      this.log("Already processing painting");
      return;
    }

    if (this.isExtractingPalette) {
      this.log("Cannot process while extracting palette - queuing");
      this.pendingPaintingUrl = imageUrl;
      return;
    }

    this.isProcessing = true;
    this.updateStatus("Loading painting...");
    this.log("Processing painting: " + imageUrl);
    this.loadOriginalImage(imageUrl);
  }

  /**
   * Public method to process painting directly (skips palette extraction)
   */
  processImageDirect(imageUrl?: string): void {
    if (!this.isInitialized) {
      this.notifyError("Not initialized");
      return;
    }

    const url = this.buildImageUrl(imageUrl || this.paintingImageUrl);
    if (!url) {
      this.notifyError("No painting image specified");
      return;
    }

    this.processPaintingInternal(url);
  }

  private loadOriginalImage(url: string): void {
    if (!this.originalImageDisplay) {
      this.callEdgeFunction(url);
      return;
    }

    try {
      const resource = (this.internetModule as any).makeResourceFromUrl(url);
      if (!resource) {
        this.callEdgeFunction(url);
        return;
      }

      this.remoteMediaModule.loadResourceAsImageTexture(
        resource,
        (texture: Texture) => {
          this.originalTexture = texture;
          this.originalImageDisplay.enabled = true;
          this.originalImageDisplay.mainPass.baseTex = texture;
          this.callEdgeFunction(url);
        },
        (error: string) => {
          this.log("Original load failed: " + error + " - continuing");
          this.callEdgeFunction(url);
        }
      );
    } catch (e) {
      this.log("Error: " + e + " - continuing");
      this.callEdgeFunction(url);
    }
  }

  private callEdgeFunction(imageUrl: string): void {
    this.updateStatus("Processing colors...");

    const endpoint = this.snapCloudRequirements.getFunctionsApiUrl() + this.functionName;

    // Build payload
    const payload: any = {
      imageUrl: imageUrl,
      numColors: this.numColors,
      ditherMethod: this.ditherMethod,
      ditherStrength: this.ditherStrength,
      outputRemappedImage: true,
      maxOutputSize: this.maxOutputSize
    };

    // Add custom pigments if available
    if (this.useCustomPigments && this.customPigments.length >= 2) {
      payload.customPigments = this.customPigments;
      this.log("Sending " + this.customPigments.length + " custom pigments to edge function");
    } else {
      this.log("Using default pigments (server-side)");
    }

    this.log("Endpoint: " + endpoint);
    this.log("Payload: " + JSON.stringify(payload));

    const request = RemoteServiceHttpRequest.create();
    request.url = endpoint;
    request.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;

    const headers: { [key: string]: string } = {};
    const baseHeaders = this.snapCloudRequirements.getSupabaseHeaders();
    for (const key in baseHeaders) {
      headers[key] = baseHeaders[key];
    }
    headers["Content-Type"] = "application/json";
    request.headers = headers;
    request.body = JSON.stringify(payload);

    this.internetModule.performHttpRequest(request, (response: RemoteServiceHttpResponse) => {
      this.handleResponse(response);
    });
  }

  private handleResponse(response: RemoteServiceHttpResponse): void {
    this.log("Response status: " + response.statusCode);

    if (response.statusCode !== 200) {
      this.isProcessing = false;
      let errorMsg = "HTTP " + response.statusCode;
      try {
        const body = JSON.parse(response.body);
        if (body.error) errorMsg = body.error;
        if (body.details) errorMsg += ": " + body.details;
      } catch (e) { }
      this.updateStatus("Error");
      this.notifyError(errorMsg);
      return;
    }

    try {
      const result = JSON.parse(response.body) as PaintGamutResult;

      if (!result.success) {
        this.isProcessing = false;
        this.updateStatus("Failed");
        this.notifyError(result.error || "Processing failed");
        return;
      }

      this.lastResult = result;
      this.logResults(result);
      this.updatePalettes(result);
      this.updateStats(result);

      if (result.remappedImageBase64) {
        this.decodeRemappedImage(result.remappedImageBase64);
      } else {
        this.isProcessing = false;
        this.updateStatus("Done (palette only)");
        this.notifySuccess(result);
      }

    } catch (e) {
      this.isProcessing = false;
      this.updateStatus("Parse error");
      this.notifyError("Failed to parse response: " + e);
    }
  }

  private decodeRemappedImage(base64: string): void {
    this.updateStatus("Decoding image...");

    try {
      Base64.decodeTextureAsync(
        base64,
        (texture: Texture) => {
          this.isProcessing = false;
          this.remappedTexture = texture;

          if (this.remappedImageDisplay) {
            this.remappedImageDisplay.enabled = true;
            this.remappedImageDisplay.mainPass.baseTex = texture;
          }

          this.updateStatus("Complete!");
          this.notifySuccess(this.lastResult!);
        },
        () => {
          this.isProcessing = false;
          this.updateStatus("Decode failed");
          this.notifyError("Failed to decode image");
        }
      );
    } catch (e) {
      this.isProcessing = false;
      this.notifyError("Decode error: " + e);
    }
  }

  // =========================================================================
  // UI UPDATES
  // =========================================================================

  private updatePalettes(result: PaintGamutResult): void {
    if (this.extractedPaletteSwatches) {
      for (let i = 0; i < this.extractedPaletteSwatches.length; i++) {
        const swatch = this.extractedPaletteSwatches[i];
        if (!swatch) continue;
        if (i < result.extractedPalette.length) {
          const c = result.extractedPalette[i];
          swatch.enabled = true;
          if (swatch.mainPass) {
            swatch.mainPass.baseColor = new vec4(c.rgb[0] / 255, c.rgb[1] / 255, c.rgb[2] / 255, 1.0);
          }
        } else {
          swatch.enabled = false;
        }
      }
    }

    if (this.projectedPaletteSwatches) {
      for (let i = 0; i < this.projectedPaletteSwatches.length; i++) {
        const swatch = this.projectedPaletteSwatches[i];
        if (!swatch) continue;
        if (i < result.projectedPalette.length) {
          const c = result.projectedPalette[i];
          swatch.enabled = true;
          if (swatch.mainPass) {
            swatch.mainPass.baseColor = new vec4(c.rgb[0] / 255, c.rgb[1] / 255, c.rgb[2] / 255, 1.0);
          }
        } else {
          swatch.enabled = false;
        }
      }
    }
  }

  private updateStats(result: PaintGamutResult): void {
    if (!this.statisticsText) return;
    const s = result.statistics;
    let text = "Avg dE: " + s.averageDeltaE.toFixed(2) + "\n" +
      "Max dE: " + s.maxDeltaE.toFixed(2) + "\n" +
      "Colors: " + result.projectedPalette.length + "\n" +
      "Gamut: " + result.gamutSize + "\n" +
      "Pigments: " + result.pigments.length;

    if (this.useCustomPigments) {
      text += " (custom)";
    }

    this.statisticsText.text = text;
  }

  private logResults(result: PaintGamutResult): void {
    this.log("=== RESULTS ===");
    this.log("Gamut: " + result.gamutSize + " colors from " + result.pigments.length + " pigments");
    this.log("Pigments used: " + result.pigments.map(p => p.name).join(", "));
    this.log("Avg dE: " + result.statistics.averageDeltaE);
    this.log("Max dE: " + result.statistics.maxDeltaE);

    const maxLog = Math.min(result.projectedPalette.length, 5);
    for (let i = 0; i < maxLog; i++) {
      const c = result.projectedPalette[i];
      this.log("  " + c.originalHex + " -> " + c.hex + " (dE=" + c.de.toFixed(1) + ")");
    }
  }

  // =========================================================================
  // CALLBACKS
  // =========================================================================

  private notifySuccess(result: PaintGamutResult): void {
    for (let i = 0; i < this.onCompleteCallbacks.length; i++) {
      try { this.onCompleteCallbacks[i](result); } catch (e) { }
    }
  }

  private notifyError(error: string): void {
    this.log("ERROR: " + error);
    this.updateStatus("Error: " + error);
    for (let i = 0; i < this.onErrorCallbacks.length; i++) {
      try { this.onErrorCallbacks[i](error); } catch (e) { }
    }
  }

  private notifyPigmentsExtracted(pigments: ExtractedPigment[]): void {
    for (let i = 0; i < this.onPigmentsExtractedCallbacks.length; i++) {
      try { this.onPigmentsExtractedCallbacks[i](pigments); } catch (e) { }
    }
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  addOnComplete(callback: (result: PaintGamutResult) => void): void {
    this.onCompleteCallbacks.push(callback);
  }

  addOnError(callback: (error: string) => void): void {
    this.onErrorCallbacks.push(callback);
  }

  addOnPigmentsExtracted(callback: (pigments: ExtractedPigment[]) => void): void {
    this.onPigmentsExtractedCallbacks.push(callback);
  }

  getCustomPigments(): ExtractedPigment[] {
    return this.customPigments;
  }

  setCustomPigments(pigments: ExtractedPigment[]): void {
    this.customPigments = pigments;
    this.useCustomPigments = pigments.length >= 2;
    this.paletteReady = pigments.length >= 2;
    this.updatePigmentDisplay();
  }

  clearCustomPigments(): void {
    this.customPigments = [];
    this.useCustomPigments = false;
    this.paletteReady = false;
    if (this.pigmentListText) this.pigmentListText.text = "";
    if (this.pigmentSwatches) {
      for (let i = 0; i < this.pigmentSwatches.length; i++) {
        if (this.pigmentSwatches[i]) this.pigmentSwatches[i].enabled = false;
      }
    }
  }

  isPaletteReady(): boolean {
    return this.paletteReady;
  }

  getLastResult(): PaintGamutResult | null {
    return this.lastResult;
  }

  getProjectedPaletteVec4(): vec4[] {
    if (!this.lastResult) return [];
    const result: vec4[] = [];
    for (let i = 0; i < this.lastResult.projectedPalette.length; i++) {
      const c = this.lastResult.projectedPalette[i];
      result.push(new vec4(c.rgb[0] / 255, c.rgb[1] / 255, c.rgb[2] / 255, 1.0));
    }
    return result;
  }

  getDominantColor(): vec4 | null {
    if (!this.lastResult || this.lastResult.projectedPalette.length === 0) return null;
    const c = this.lastResult.projectedPalette[0];
    return new vec4(c.rgb[0] / 255, c.rgb[1] / 255, c.rgb[2] / 255, 1.0);
  }

  getRemappedTexture(): Texture | null {
    return this.remappedTexture;
  }

  getOriginalTexture(): Texture | null {
    return this.originalTexture;
  }

  isProcessingNow(): boolean {
    return this.isProcessing;
  }

  isExtractingPaletteNow(): boolean {
    return this.isExtractingPalette;
  }

  isBusy(): boolean {
    return this.isProcessing || this.isExtractingPalette;
  }

  setOptions(opts: {
    numColors?: number;
    ditherMethod?: string;
    ditherStrength?: number;
    maxOutputSize?: number;
    autoExtractPalette?: boolean;
  }): void {
    if (opts.numColors !== undefined) this.numColors = opts.numColors;
    if (opts.ditherMethod !== undefined) this.ditherMethod = opts.ditherMethod;
    if (opts.ditherStrength !== undefined) this.ditherStrength = opts.ditherStrength;
    if (opts.maxOutputSize !== undefined) this.maxOutputSize = opts.maxOutputSize;
    if (opts.autoExtractPalette !== undefined) this.autoExtractPalette = opts.autoExtractPalette;
  }

  clearAll(): void {
    this.originalTexture = null;
    this.remappedTexture = null;
    this.lastResult = null;
    this.pendingPaintingUrl = null;
    this.clearCustomPigments();

    if (this.originalImageDisplay) this.originalImageDisplay.enabled = false;
    if (this.remappedImageDisplay) this.remappedImageDisplay.enabled = false;
    if (this.palettePhotoDisplay) this.palettePhotoDisplay.enabled = false;

    if (this.extractedPaletteSwatches) {
      for (let i = 0; i < this.extractedPaletteSwatches.length; i++) {
        if (this.extractedPaletteSwatches[i]) this.extractedPaletteSwatches[i].enabled = false;
      }
    }
    if (this.projectedPaletteSwatches) {
      for (let i = 0; i < this.projectedPaletteSwatches.length; i++) {
        if (this.projectedPaletteSwatches[i]) this.projectedPaletteSwatches[i].enabled = false;
      }
    }
    if (this.statisticsText) this.statisticsText.text = "";
    this.updateStatus("Cleared");
  }

  // =========================================================================
  // HELPERS
  // =========================================================================

  private updateStatus(status: string): void {
    this.log("Status: " + status);
    if (this.statusText) this.statusText.text = status;
  }

  private log(msg: string): void {
    if (this.enableDebugLogs) print("[PaintGamut] " + msg);
  }
}