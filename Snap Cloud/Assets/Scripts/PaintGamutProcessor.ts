import { SnapCloudRequirements } from '../Examples/SnapCloudRequirements';
import { RectangleButton } from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';

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

interface PigmentInfo {
  name: string;
  rgb: number[];
}

interface Statistics {
  averageDeltaE: number;
  maxDeltaE: number;
  minDeltaE: number;
  projectionMethod: string;
}

interface PaintGamutResult {
  success: boolean;
  imageSize: { width: number; height: number };
  extractedPalette: PaletteColor[];
  projectedPalette: ProjectedColor[];
  gamutSize: number;
  pigments: PigmentInfo[];
  statistics: Statistics;
  remappedImageUrl?: string;
  remappedImagePath?: string;
  error?: string;
  details?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

@component
export class PaintGamutProcessor extends BaseScriptComponent {

  // Modules
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
  @hint("Input storage bucket")
  inputBucket: string = "uploads";

  @input
  @hint("Output storage bucket")
  outputBucket: string = "processed-images";

  @input
  @hint("Input image path in storage (e.g., 'photos/image.jpg')")
  inputImagePath: string = "";

  @input
  @hint("OR full URL to input image")
  inputImageUrl: string = "";

  // -------------------------------------------------------------------------
  // PROCESSING OPTIONS
  // -------------------------------------------------------------------------

  @input
  @hint("Number of colors to extract (2-48)")
  numColors: number = 24;

  @input
  @hint("Projection method: 'closest' or 'hue'")
  projectionMethod: string = "closest";

  @input
  @hint("Dither method: 'none', 'floyd', or 'atkinson'")
  ditherMethod: string = "floyd";

  @input
  @hint("Dither strength (0-1)")
  ditherStrength: number = 0.85;

  // -------------------------------------------------------------------------
  // DISPLAYS
  // -------------------------------------------------------------------------

  @input
  @hint("Image component for original image")
  originalImageDisplay: Image;

  @input
  @hint("Image component for remapped result")
  remappedImageDisplay: Image;

  @input
  @hint("Extracted palette swatches")
  extractedPaletteSwatches: Image[];

  @input
  @hint("Projected palette swatches")
  projectedPaletteSwatches: Image[];

  @input
  @allowUndefined
  @hint("Status text display")
  statusText: Text;

  @input
  @allowUndefined
  @hint("Statistics text display")
  statisticsText: Text;

  @input
  @hint("Process button")
  processButton: RectangleButton;

  @input
  enableDebugLogs: boolean = true;

  // -------------------------------------------------------------------------
  // STATE
  // -------------------------------------------------------------------------

  private isInitialized: boolean = false;
  private isProcessing: boolean = false;
  private lastResult: PaintGamutResult | null = null;
  private originalTexture: Texture | null = null;
  private remappedTexture: Texture | null = null;

  private onCompleteCallbacks: ((result: PaintGamutResult) => void)[] = [];
  private onErrorCallbacks: ((error: string) => void)[] = [];

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  onAwake() {
    this.log("Initializing...");
    this.initialize();
    this.setupButton();
  }

  private initialize(): void {
    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.log("ERROR: SnapCloudRequirements not configured");
      this.updateStatus("Not configured");
      return;
    }

    this.isInitialized = true;
    this.log("Initialized");
    this.updateStatus("Ready");
  }

  private setupButton(): void {
    if (this.processButton) {
      this.processButton.onTriggerUp.add(() => {
        this.log("BUTTON PRESSED");
        this.processImage();
      });
    }
  }

  // =========================================================================
  // MAIN PROCESS
  // =========================================================================

  processImage(imageUrl?: string): void {
    // Validation
    if (!this.isInitialized) {
      this.notifyError("Not initialized");
      return;
    }

    if (this.isProcessing) {
      this.log("Already processing");
      return;
    }

    if (!global.deviceInfoSystem.isInternetAvailable()) {
      this.updateStatus("No internet");
      this.notifyError("No internet connection");
      return;
    }

    // Determine URL
    let url = imageUrl || this.inputImageUrl;
    if (!url && this.inputImagePath) {
      url = this.snapCloudRequirements.getStorageApiUrl() + this.inputBucket + "/" + this.inputImagePath;
    }

    if (!url) {
      this.updateStatus("No image");
      this.notifyError("No input image specified");
      return;
    }

    // Start processing
    this.isProcessing = true;
    this.updateStatus("Starting...");
    this.log("Processing: " + url);

    // Load original image first, then call edge function
    this.loadOriginalThenProcess(url);
  }

  private loadOriginalThenProcess(url: string): void {
    this.updateStatus("Loading original...");

    // If no display, skip to processing
    if (!this.originalImageDisplay) {
      this.callEdgeFunction(url);
      return;
    }

    try {
      const resource = (this.internetModule as any).makeResourceFromUrl(url);

      if (!resource) {
        this.log("Failed to create resource, continuing to process");
        this.callEdgeFunction(url);
        return;
      }

      this.remoteMediaModule.loadResourceAsImageTexture(
        resource,
        (texture: Texture) => {
          this.log("Original loaded");
          this.originalTexture = texture;
          this.originalImageDisplay.enabled = true;
          this.originalImageDisplay.mainPass.baseTex = texture;
          
          // Continue to edge function
          this.callEdgeFunction(url);
        },
        (error: string) => {
          this.log("Original load failed: " + error + ", continuing");
          this.callEdgeFunction(url);
        }
      );
    } catch (e) {
      this.log("Error: " + e + ", continuing");
      this.callEdgeFunction(url);
    }
  }

  private callEdgeFunction(imageUrl: string): void {
    this.updateStatus("Processing colors...");

    const endpoint = this.snapCloudRequirements.getFunctionsApiUrl() + this.functionName;
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const outputPath = "remapped/" + timestamp + "_" + randomId + ".png";

    const payload = {
      imageUrl: imageUrl,
      numColors: this.numColors,
      projectionMethod: this.projectionMethod,
      ditherMethod: this.ditherMethod,
      ditherStrength: this.ditherStrength,
      outputRemappedImage: true,
      storageBucket: this.outputBucket,
      storagePath: outputPath
    };

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
    this.log("Status: " + response.statusCode);

    if (response.statusCode !== 200) {
      this.isProcessing = false;
      let errorMsg = "HTTP " + response.statusCode;
      try {
        const body = JSON.parse(response.body);
        if (body.error) errorMsg = body.error;
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

      if (result.remappedImageUrl) {
        this.loadRemappedImage(result.remappedImageUrl);
      } else {
        this.isProcessing = false;
        this.updateStatus("Done (no image)");
        this.notifySuccess(result);
      }

    } catch (e) {
      this.isProcessing = false;
      this.updateStatus("Parse error");
      this.notifyError("Failed to parse response");
    }
  }

  private loadRemappedImage(url: string): void {
    this.updateStatus("Loading result...");
    this.log("Loading: " + url);

    try {
      const resource = (this.internetModule as any).makeResourceFromUrl(url);

      if (!resource) {
        this.isProcessing = false;
        this.updateStatus("Load failed");
        this.notifyError("Failed to create resource");
        return;
      }

      this.remoteMediaModule.loadResourceAsImageTexture(
        resource,
        (texture: Texture) => {
          this.isProcessing = false;
          this.remappedTexture = texture;

          if (this.remappedImageDisplay) {
            this.remappedImageDisplay.enabled = true;
            this.remappedImageDisplay.mainPass.baseTex = texture;
          }

          this.updateStatus("Complete!");
          this.log("Complete!");
          this.notifySuccess(this.lastResult!);
        },
        (error: string) => {
          this.isProcessing = false;
          this.updateStatus("Load failed");
          this.notifyError("Failed to load result: " + error);
        }
      );

    } catch (e) {
      this.isProcessing = false;
      this.updateStatus("Error");
      this.notifyError("" + e);
    }
  }

  // =========================================================================
  // UI UPDATES
  // =========================================================================

  private updatePalettes(result: PaintGamutResult): void {
    // Extracted
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

    // Projected
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
    this.statisticsText.text = 
      "Avg ΔE: " + s.averageDeltaE.toFixed(2) + "\n" +
      "Max ΔE: " + s.maxDeltaE.toFixed(2) + "\n" +
      "Min ΔE: " + s.minDeltaE.toFixed(2) + "\n" +
      "Method: " + s.projectionMethod + "\n" +
      "Colors: " + result.projectedPalette.length;
  }

  private logResults(result: PaintGamutResult): void {
    this.log("=== RESULTS ===");
    this.log("Size: " + result.imageSize.width + "x" + result.imageSize.height);
    this.log("Gamut: " + result.gamutSize + " colors");
    this.log("Avg ΔE: " + result.statistics.averageDeltaE);
    this.log("Max ΔE: " + result.statistics.maxDeltaE);
    
    for (let i = 0; i < Math.min(result.projectedPalette.length, 8); i++) {
      const c = result.projectedPalette[i];
      this.log(c.originalHex + " -> " + c.hex + " (ΔE=" + c.de.toFixed(1) + ")");
    }
    
    if (result.remappedImageUrl) {
      this.log("URL: " + result.remappedImageUrl);
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
    for (let i = 0; i < this.onErrorCallbacks.length; i++) {
      try { this.onErrorCallbacks[i](error); } catch (e) { }
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

  getExtractedPaletteVec4(): vec4[] {
    if (!this.lastResult) return [];
    const result: vec4[] = [];
    for (let i = 0; i < this.lastResult.extractedPalette.length; i++) {
      const c = this.lastResult.extractedPalette[i];
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

  getRemappedImageUrl(): string | null {
    return this.lastResult?.remappedImageUrl || null;
  }

  isProcessingNow(): boolean {
    return this.isProcessing;
  }

  setOptions(options: {
    numColors?: number;
    projectionMethod?: string;
    ditherMethod?: string;
    ditherStrength?: number;
  }): void {
    if (options.numColors !== undefined) this.numColors = options.numColors;
    if (options.projectionMethod !== undefined) this.projectionMethod = options.projectionMethod;
    if (options.ditherMethod !== undefined) this.ditherMethod = options.ditherMethod;
    if (options.ditherStrength !== undefined) this.ditherStrength = options.ditherStrength;
  }

  clearAll(): void {
    this.originalTexture = null;
    this.remappedTexture = null;
    this.lastResult = null;
    
    if (this.originalImageDisplay) this.originalImageDisplay.enabled = false;
    if (this.remappedImageDisplay) this.remappedImageDisplay.enabled = false;
    
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
    if (this.statusText) this.statusText.text = status;
  }

  private log(msg: string): void {
    if (this.enableDebugLogs) print("[PaintGamut] " + msg);
  }
}