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

  @input
  @hint("Input image path in storage (e.g., 'photos/image.jpg') - relative to bucket")
  inputImagePath: string = "";

  @input
  @hint("OR full URL to input image (overrides path if set)")
  inputImageUrl: string = "";

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
  @hint("Max output image size in pixels")
  maxOutputSize: number = 512;

  // -------------------------------------------------------------------------
  // DISPLAYS
  // -------------------------------------------------------------------------

  @input
  @hint("Image component for ORIGINAL/INPUT image")
  originalImageDisplay: Image;

  @input
  @hint("Image component for REMAPPED/OUTPUT image")
  remappedImageDisplay: Image;

  @input
  @hint("Extracted palette swatches (array of Image)")
  extractedPaletteSwatches: Image[];

  @input
  @hint("Projected palette swatches (array of Image)")
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
  @allowUndefined
  @hint("Process button - triggers processing on press")
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
    this.log("Initializing PaintGamutProcessor...");
    this.initialize();
    this.setupButton();
  }

  private initialize(): void {
    if (!this.snapCloudRequirements) {
      this.log("ERROR: SnapCloudRequirements not assigned");
      this.updateStatus("No config");
      return;
    }

    if (!this.snapCloudRequirements.isConfigured()) {
      this.log("ERROR: SnapCloudRequirements not configured");
      this.updateStatus("Not configured");
      return;
    }

    this.isInitialized = true;
    this.log("Initialized successfully");
    this.log("Storage URL: " + this.snapCloudRequirements.getStorageApiUrl());
    this.log("Functions URL: " + this.snapCloudRequirements.getFunctionsApiUrl());
    this.updateStatus("Ready");
  }

  private setupButton(): void {
    if (this.processButton) {
      this.processButton.onTriggerUp.add(() => {
        this.log("=== PROCESS BUTTON PRESSED ===");
        this.processImage();
      });
      this.log("Process button connected");
    } else {
      this.log("No process button assigned - call processImage() manually");
    }
  }

  // =========================================================================
  // URL BUILDING
  // =========================================================================

  /**
   * Build full image URL from either:
   * 1. inputImageUrl (if set) - used as-is
   * 2. inputImagePath - combined with storage bucket URL
   * 
   * Storage URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
   */
  private buildImageUrl(overrideUrl?: string): string | null {
    // Priority 1: Override URL passed to processImage()
    if (overrideUrl && overrideUrl.length > 0) {
      this.log("Using override URL: " + overrideUrl);
      return overrideUrl;
    }

    // Priority 2: Full URL in inputImageUrl
    if (this.inputImageUrl && this.inputImageUrl.length > 0) {
      this.log("Using inputImageUrl: " + this.inputImageUrl);
      return this.inputImageUrl;
    }

    // Priority 3: Build from storage path
    if (this.inputImagePath && this.inputImagePath.length > 0) {
      const storageBase = this.snapCloudRequirements.getStorageApiUrl();
      // Storage URL format: baseUrl + bucket + "/" + path
      const fullUrl = storageBase + this.inputBucket + "/" + this.inputImagePath;
      this.log("Built storage URL: " + fullUrl);
      return fullUrl;
    }

    return null;
  }

  // =========================================================================
  // MAIN PROCESS
  // =========================================================================

  /**
   * Process an image through the paint gamut pipeline.
   * @param imageUrl Optional - full URL to image. If not provided, uses inputImageUrl or inputImagePath
   */
  processImage(imageUrl?: string): void {
    this.log("processImage() called");

    // Validation
    if (!this.isInitialized) {
      this.notifyError("Not initialized - check SnapCloudRequirements");
      return;
    }

    if (this.isProcessing) {
      this.log("Already processing - ignoring");
      return;
    }

    if (!global.deviceInfoSystem.isInternetAvailable()) {
      this.notifyError("No internet connection");
      return;
    }

    // Build URL
    const url = this.buildImageUrl(imageUrl);
    if (!url) {
      this.notifyError("No image specified. Set inputImageUrl or inputImagePath");
      return;
    }

    // Start processing
    this.isProcessing = true;
    this.updateStatus("Starting...");
    this.log("Processing image: " + url);

    // Load and display original, then process
    this.loadOriginalImage(url);
  }

  private loadOriginalImage(url: string): void {
    this.updateStatus("Loading original...");

    // If no original display, skip straight to processing
    if (!this.originalImageDisplay) {
      this.log("No originalImageDisplay - skipping preview");
      this.callEdgeFunction(url);
      return;
    }

    try {
      const resource = (this.internetModule as any).makeResourceFromUrl(url);

      if (!resource) {
        this.log("Failed to create resource for original - continuing anyway");
        this.callEdgeFunction(url);
        return;
      }

      this.remoteMediaModule.loadResourceAsImageTexture(
        resource,
        (texture: Texture) => {
          this.log("Original image loaded successfully");
          this.originalTexture = texture;
          
          // Apply to original display
          this.originalImageDisplay.enabled = true;
          this.originalImageDisplay.mainPass.baseTex = texture;
          
          // Continue to edge function
          this.callEdgeFunction(url);
        },
        (error: string) => {
          this.log("Original image load failed: " + error + " - continuing anyway");
          this.callEdgeFunction(url);
        }
      );
    } catch (e) {
      this.log("Error loading original: " + e + " - continuing anyway");
      this.callEdgeFunction(url);
    }
  }

  private callEdgeFunction(imageUrl: string): void {
    this.updateStatus("Processing colors...");

    const endpoint = this.snapCloudRequirements.getFunctionsApiUrl() + this.functionName;

    const payload = {
      imageUrl: imageUrl,
      numColors: this.numColors,
      ditherMethod: this.ditherMethod,
      ditherStrength: this.ditherStrength,
      outputRemappedImage: true,
      maxOutputSize: this.maxOutputSize
    };

    this.log("Endpoint: " + endpoint);
    this.log("Payload: " + JSON.stringify(payload));

    const request = RemoteServiceHttpRequest.create();
    request.url = endpoint;
    request.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;

    // Build headers
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
        if (body.details) errorMsg = errorMsg + ": " + body.details;
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

      // Decode base64 image if present
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
    this.log("Decoding base64 image, length: " + base64.length);

    try {
      Base64.decodeTextureAsync(
        base64,
        (texture: Texture) => {
          this.isProcessing = false;
          this.remappedTexture = texture;
          this.log("Remapped image decoded successfully");

          // Apply to remapped/output display
          if (this.remappedImageDisplay) {
            this.remappedImageDisplay.enabled = true;
            this.remappedImageDisplay.mainPass.baseTex = texture;
            this.log("Applied texture to remappedImageDisplay");
          } else {
            this.log("No remappedImageDisplay to show result");
          }

          this.updateStatus("Complete!");
          this.notifySuccess(this.lastResult!);
        },
        () => {
          this.isProcessing = false;
          this.updateStatus("Decode failed");
          this.notifyError("Failed to decode base64 image");
        }
      );
    } catch (e) {
      this.isProcessing = false;
      this.updateStatus("Error");
      this.notifyError("Decode error: " + e);
    }
  }

  // =========================================================================
  // UI UPDATES
  // =========================================================================

  private updatePalettes(result: PaintGamutResult): void {
    // Extracted palette (original colors from image)
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

    // Projected palette (paint-mixable colors)
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
      "Avg dE: " + s.averageDeltaE.toFixed(2) + "\n" +
      "Max dE: " + s.maxDeltaE.toFixed(2) + "\n" +
      "Min dE: " + s.minDeltaE.toFixed(2) + "\n" +
      "Colors: " + result.projectedPalette.length + "\n" +
      "Gamut: " + result.gamutSize;
  }

  private logResults(result: PaintGamutResult): void {
    this.log("=== RESULTS ===");
    this.log("Input size: " + result.imageSize.width + "x" + result.imageSize.height);
    this.log("Gamut size: " + result.gamutSize + " colors");
    this.log("Extracted: " + result.extractedPalette.length + " colors");
    this.log("Projected: " + result.projectedPalette.length + " colors");
    this.log("Avg dE: " + result.statistics.averageDeltaE);
    this.log("Max dE: " + result.statistics.maxDeltaE);

    // Log first few color mappings
    const maxLog = Math.min(result.projectedPalette.length, 6);
    for (let i = 0; i < maxLog; i++) {
      const c = result.projectedPalette[i];
      this.log("  " + c.originalHex + " -> " + c.hex + " (dE=" + c.de.toFixed(1) + ", " + c.population.toFixed(1) + "%)");
    }

    if (result.remappedImageBase64) {
      this.log("Remapped image: " + result.remappedWidth + "x" + result.remappedHeight);
    }
  }

  // =========================================================================
  // CALLBACKS
  // =========================================================================

  private notifySuccess(result: PaintGamutResult): void {
    for (let i = 0; i < this.onCompleteCallbacks.length; i++) {
      try { this.onCompleteCallbacks[i](result); } catch (e) { this.log("Callback error: " + e); }
    }
  }

  private notifyError(error: string): void {
    this.log("ERROR: " + error);
    this.updateStatus("Error: " + error);
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

  isProcessingNow(): boolean {
    return this.isProcessing;
  }

  setOptions(opts: {
    numColors?: number;
    ditherMethod?: string;
    ditherStrength?: number;
    maxOutputSize?: number;
  }): void {
    if (opts.numColors !== undefined) this.numColors = opts.numColors;
    if (opts.ditherMethod !== undefined) this.ditherMethod = opts.ditherMethod;
    if (opts.ditherStrength !== undefined) this.ditherStrength = opts.ditherStrength;
    if (opts.maxOutputSize !== undefined) this.maxOutputSize = opts.maxOutputSize;
  }

  /**
   * Set the input image by storage path
   * @param path Path relative to inputBucket (e.g., "photos/image.jpg")
   */
  setInputPath(path: string): void {
    this.inputImagePath = path;
    this.inputImageUrl = ""; // Clear URL so path is used
  }

  /**
   * Set the input image by full URL
   * @param url Full URL to the image
   */
  setInputUrl(url: string): void {
    this.inputImageUrl = url;
  }

  clearAll(): void {
    this.originalTexture = null;
    this.remappedTexture = null;
    this.lastResult = null;

    if (this.originalImageDisplay) {
      this.originalImageDisplay.enabled = false;
    }
    if (this.remappedImageDisplay) {
      this.remappedImageDisplay.enabled = false;
    }

    if (this.extractedPaletteSwatches) {
      for (let i = 0; i < this.extractedPaletteSwatches.length; i++) {
        if (this.extractedPaletteSwatches[i]) {
          this.extractedPaletteSwatches[i].enabled = false;
        }
      }
    }

    if (this.projectedPaletteSwatches) {
      for (let i = 0; i < this.projectedPaletteSwatches.length; i++) {
        if (this.projectedPaletteSwatches[i]) {
          this.projectedPaletteSwatches[i].enabled = false;
        }
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