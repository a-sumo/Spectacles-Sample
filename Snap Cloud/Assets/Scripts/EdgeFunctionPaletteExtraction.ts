import { SnapCloudRequirements } from '../Examples/SnapCloudRequirements';
import { RectangleButton } from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';

// Color data types
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

interface ImageSize {
  width: number;
  height: number;
}

interface PaletteExtractionResult {
  success: boolean;
  imageSize: ImageSize;
  totalPixels: number;
  sampledPixels: number;
  palette: PaletteColor[];
  error?: string;
  details?: string;
}

@component
export class EdgeFunctionPaletteExtraction extends BaseScriptComponent {

  // Internet Module
  private internetModule: InternetModule = require('LensStudio:InternetModule');

  // Supabase Configuration
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  snapCloudRequirements: SnapCloudRequirements;

  @input
  @hint("Edge Function name for palette extraction")
  functionName: string = "extract-palette";

  // Function Parameters
  @input
  @hint("Image URL from Supabase Storage to extract palette from")
  imageUrl: string = "";

  @input
  @hint("Number of colors to extract (2-32)")
  numColors: number = 8;

  @input
  @hint("Sample size for k-means clustering (1000-50000)")
  sampleSize: number = 10000;

  // Output Configuration
  @input
  @hint("Optional: Image components to display palette colors")
  paletteSwatches: Image[];

  @input
  @hint("Optional: Text components to display color hex values")
  paletteLabels: Text[];

  // Button Configuration
  @input
  @hint("RectangleButton to trigger palette extraction")
  extractButton: RectangleButton;

  @input
  @hint("Enable debug logging")
  enableDebugLogs: boolean = true;

  // State
  private isProcessing: boolean = false;
  private lastResult: PaletteExtractionResult | null = null;

  // Callbacks for external scripts
  private successCallbacks: ((result: PaletteExtractionResult) => void)[] = [];
  private errorCallbacks: ((error: string) => void)[] = [];

  onAwake() {
    this.log("EdgeFunctionPaletteExtraction initializing...");
    this.validateConfiguration();
    this.setupExtractButton();
  }

  /**
   * Validate configuration
   */
  private validateConfiguration(): boolean {
    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.log("ERROR: SnapCloudRequirements not configured");
      return false;
    }

    if (!this.functionName || this.functionName.length === 0) {
      this.log("ERROR: Function name not configured");
      return false;
    }

    const endpointUrl = this.snapCloudRequirements.getFunctionsApiUrl() + this.functionName;
    this.log("Configuration valid");
    this.log("Endpoint: " + endpointUrl);
    return true;
  }

  /**
   * Setup extract button interaction
   */
  private setupExtractButton(): void {
    if (!this.extractButton) {
      this.log("No extract button assigned - call extractPalette() manually");
      return;
    }

    this.log("Extract button assigned: " + this.extractButton.name);

    this.extractButton.onTriggerUp.add(() => {
      this.log("EXTRACT BUTTON PRESSED!");
      this.extractPalette();
    });

    this.log("Extract button setup complete");
  }

  /**
   * Extract color palette from the configured image URL
   */
  extractPalette(imageUrl?: string): void {
    const targetUrl = imageUrl || this.imageUrl;

    if (!targetUrl || targetUrl.length === 0) {
      this.log("ERROR: No image URL provided");
      this.notifyError("No image URL provided");
      return;
    }

    if (this.isProcessing) {
      this.log("WARNING: Already processing an image");
      return;
    }

    this.isProcessing = true;
    this.callEdgeFunction(targetUrl);
  }

  /**
   * Call the Supabase Edge Function
   */
  private callEdgeFunction(imageUrl: string): void {
    try {
      const endpointUrl = this.snapCloudRequirements.getFunctionsApiUrl() + this.functionName;
      this.log("Extracting palette from: " + imageUrl);
      this.log("Endpoint: " + endpointUrl);
      this.log("Colors: " + this.numColors + ", Sample size: " + this.sampleSize);

      // Build request payload
      const payload = {
        imageUrl: imageUrl,
        colors: this.numColors,
        sampleSize: this.sampleSize
      };

      // Create request
      const request = RemoteServiceHttpRequest.create();
      request.url = endpointUrl;
      request.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;

      // Set headers - include Content-Type for JSON
      const baseHeaders = this.snapCloudRequirements.getSupabaseHeaders();
      const headers: { [key: string]: string } = {};
      
      // Copy base headers
      for (const key in baseHeaders) {
        headers[key] = baseHeaders[key];
      }
      headers["Content-Type"] = "application/json";
      
      request.headers = headers;
      request.body = JSON.stringify(payload);

      this.log("Sending request...");

      // Perform request
      this.internetModule.performHttpRequest(request, (response: RemoteServiceHttpResponse) => {
        this.handleResponse(response);
      });

    } catch (error) {
      this.isProcessing = false;
      const errorMsg = "Error calling Edge Function: " + error;
      this.log(errorMsg);
      this.notifyError(errorMsg);
    }
  }

  /**
   * Handle the HTTP response
   */
  private handleResponse(response: RemoteServiceHttpResponse): void {
    this.isProcessing = false;
    this.log("Response Status: " + response.statusCode);

    if (response.statusCode === 200) {
      try {
        const result = JSON.parse(response.body) as PaletteExtractionResult;

        if (result.success && result.palette) {
          this.log("Palette extraction successful!");
          this.log("Image size: " + result.imageSize.width + "x" + result.imageSize.height);
          this.log("Colors extracted: " + result.palette.length);

          // Log palette colors
          for (let i = 0; i < result.palette.length; i++) {
            const color = result.palette[i];
            this.log("  [" + i + "] " + color.hex + " - RGB(" + color.rgb.join(",") + ") - " + color.population.toFixed(1) + "%");
          }

          // Store result
          this.lastResult = result;

          // Update UI
          this.updatePaletteDisplay(result.palette);

          // Notify callbacks
          this.notifySuccess(result);

        } else {
          const errorMsg = result.error || "Unknown error in response";
          this.log("ERROR: " + errorMsg);
          if (result.details) {
            this.log("Details: " + result.details);
          }
          this.notifyError(errorMsg);
        }

      } catch (parseError) {
        const errorMsg = "Error parsing response: " + parseError;
        this.log(errorMsg);
        this.log("Raw response: " + response.body);
        this.notifyError(errorMsg);
      }

    } else {
      let errorMsg = "HTTP Error " + response.statusCode;
      try {
        const errorBody = JSON.parse(response.body);
        if (errorBody.error) {
          errorMsg = errorMsg + ": " + errorBody.error;
        }
        if (errorBody.details) {
          errorMsg = errorMsg + " - " + errorBody.details;
        }
      } catch (e) {
        errorMsg = errorMsg + ": " + response.body;
      }
      this.log(errorMsg);
      this.notifyError(errorMsg);
    }
  }

  /**
   * Update palette swatch displays
   */
  private updatePaletteDisplay(palette: PaletteColor[]): void {
    // Update swatch images
    if (this.paletteSwatches) {
      for (let i = 0; i < this.paletteSwatches.length; i++) {
        const swatch = this.paletteSwatches[i];
        if (!swatch) continue;

        if (i < palette.length) {
          const color = palette[i];
          swatch.enabled = true;

          // Convert RGB to normalized color (0-1 range)
          const r = color.rgb[0] / 255;
          const g = color.rgb[1] / 255;
          const b = color.rgb[2] / 255;

          // Apply color to the image's material
          if (swatch.mainPass) {
            swatch.mainPass.baseColor = new vec4(r, g, b, 1.0);
          }

          this.log("Swatch " + i + ": Set to " + color.hex);
        } else {
          // Hide unused swatches
          swatch.enabled = false;
        }
      }
    }

    // Update labels
    if (this.paletteLabels) {
      for (let i = 0; i < this.paletteLabels.length; i++) {
        const label = this.paletteLabels[i];
        if (!label) continue;

        if (i < palette.length) {
          const color = palette[i];
          label.enabled = true;
          label.text = color.hex + "\n" + color.population.toFixed(1) + "%";
        } else {
          label.enabled = false;
        }
      }
    }
  }

  /**
   * Notify success callbacks
   */
  private notifySuccess(result: PaletteExtractionResult): void {
    for (let i = 0; i < this.successCallbacks.length; i++) {
      try {
        this.successCallbacks[i](result);
      } catch (error) {
        this.log("Error in success callback: " + error);
      }
    }
  }

  /**
   * Notify error callbacks
   */
  private notifyError(error: string): void {
    for (let i = 0; i < this.errorCallbacks.length; i++) {
      try {
        this.errorCallbacks[i](error);
      } catch (callbackError) {
        this.log("Error in error callback: " + callbackError);
      }
    }
  }

  // === Public API ===

  /**
   * Get the last extraction result
   */
  getLastResult(): PaletteExtractionResult | null {
    return this.lastResult;
  }

  /**
   * Get palette colors as vec4 array (for use in shaders/materials)
   */
  getPaletteAsVec4(): vec4[] {
    if (!this.lastResult || !this.lastResult.palette) {
      return [];
    }

    const result: vec4[] = [];
    for (let i = 0; i < this.lastResult.palette.length; i++) {
      const color = this.lastResult.palette[i];
      result.push(new vec4(
        color.rgb[0] / 255,
        color.rgb[1] / 255,
        color.rgb[2] / 255,
        1.0
      ));
    }
    return result;
  }

  /**
   * Get palette colors as hex strings
   */
  getPaletteHex(): string[] {
    if (!this.lastResult || !this.lastResult.palette) {
      return [];
    }
    
    const result: string[] = [];
    for (let i = 0; i < this.lastResult.palette.length; i++) {
      result.push(this.lastResult.palette[i].hex);
    }
    return result;
  }

  /**
   * Get the dominant color (first in palette)
   */
  getDominantColor(): PaletteColor | null {
    if (!this.lastResult || !this.lastResult.palette || this.lastResult.palette.length === 0) {
      return null;
    }
    return this.lastResult.palette[0];
  }

  /**
   * Get a specific color by index
   */
  getColor(index: number): PaletteColor | null {
    if (!this.lastResult || !this.lastResult.palette) {
      return null;
    }
    if (index < 0 || index >= this.lastResult.palette.length) {
      return null;
    }
    return this.lastResult.palette[index];
  }

  /**
   * Check if currently processing
   */
  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }

  /**
   * Add callback for successful extraction
   */
  addOnPaletteExtracted(callback: (result: PaletteExtractionResult) => void): void {
    this.successCallbacks.push(callback);
  }

  /**
   * Add callback for extraction errors
   */
  addOnExtractionError(callback: (error: string) => void): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Logging helper
   */
  private log(message: string): void {
    if (this.enableDebugLogs) {
      print("[PaletteExtraction] " + message);
    }
  }
}