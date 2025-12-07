# Pigment Palette Projection - Architecture & Workflow

## Overview

This system enables artists to preview how a scene would look when painted using only their available pigments. It bridges the gap between the colors in a reference image and the physical constraints of a limited paint palette.

## Core Concept

```
REAL WORLD                          DIGITAL PROCESSING                    OUTPUT
───────────                         ──────────────────                    ──────
Physical paint palette  ──────►    Pigment Gamut (achievable colors)  ──┐
                                                                         ├──►  Remapped Preview
Reference scene/painting ──────►   Extracted colors ─► Projection    ──┘
```

---

## Three Picture Types

### 1. Pigment Sampler (Multiple Instances)

**Purpose:** Capture the colors the artist has available on their physical palette.

**Components:**
- `PictureController` - Manages scanner instance lifecycle
- `PictureBehavior` - Handles two-hand pinch gesture to define crop region
- `CropRegion` - Captures camera feed within the pinched boundary
- `ColorSamplerController` - Eyedropper tool for manual color picking

**User Interaction:**
1. User positions hands to frame their physical paint palette
2. Two-hand pinch creates a Pigment Sampler scanner
3. User hovers over the scanned image and pinches to sample individual pigment colors
4. Sampled colors populate `PaletteController` (up to 6 slots)

**Data Flow:**
```
Pigment Sampler ─► ColorSamplerController (manual pick)
                          │
                          ▼
                   PaletteController (6 color slots)
                          │
                          ▼
                   Encoder_PigmentMix (Kubelka-Munk model)
                          │
                          ▼
                   Pigment Gamut Texture (achievable color mixtures)
```

---

### 2. Source Image (Single Instance)

**Purpose:** Capture the reference scene or painting the artist wants to recreate.

**Components:**
- `SourceImageController` - Singleton managing the source image capture
- `PictureBehavior` - Handles crop region definition
- `CropRegion` - Captures camera feed within the boundary

**User Interaction:**
1. User frames the scene/painting they want to recreate
2. Gesture creates the Source Image (distinct from Pigment Sampler)
3. **No manual sampling** - colors are extracted automatically

**Data Flow:**
```
Source Image ─► SourceImageController.getTexture()
                          │
                          ▼
                   ImagePipeline.inputTexture
                          │
                          ▼
                   PaletteExtractor (K-means clustering)
                          │
                          ▼
                   Extracted Palette (N dominant colors)
                          │
                          ▼
                   Projector_Gamut (find nearest achievable colors)
                          │
                          ▼
                   Projected Palette (gamut-constrained colors)
```

---

### 3. Output Preview (Single Instance)

**Purpose:** Display the source image with colors remapped to the pigment gamut.

**Components:**
- `OutputPreviewController` - Singleton managing the preview display
- Render surface displaying the regenerated image

**User Interaction:**
- Appears automatically when Source Image is captured
- Updates live when:
  - Pigment palette changes (user samples new colors)
  - Source image is re-captured
  - User adjusts dithering or other parameters

**Data Flow:**
```
Extracted Palette + Projected Palette
                │
                ▼
        ImageRegenerator
                │
                ▼
        Remapped Output Texture
                │
                ▼
        OutputPreviewController (display surface)
```

---

## Complete Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PIGMENT GAMUT GENERATION                          │
│                                                                             │
│   Pigment Sampler(s)                                                        │
│         │                                                                   │
│         ▼                                                                   │
│   ColorSamplerController ──► PaletteController (6 slots)                    │
│                                      │                                      │
│                                      ▼                                      │
│                              Encoder_PigmentMix                             │
│                                      │                                      │
│                                      ▼                                      │
│                              Pigment Gamut Texture ─────────────────┐       │
│                              (64x64, up to 1296 achievable colors)  │       │
└─────────────────────────────────────────────────────────────────────│───────┘
                                                                      │
┌─────────────────────────────────────────────────────────────────────│───────┐
│                           IMAGE PROCESSING                          │       │
│                                                                     │       │
│   Source Image                                                      │       │
│         │                                                           │       │
│         ▼                                                           │       │
│   SourceImageController.getTexture()                                │       │
│         │                                                           │       │
│         ▼                                                           │       │
│   ImagePipeline                                                     │       │
│         │                                                           │       │
│         ├──► PaletteExtractor ──► Extracted Palette ────────┐       │       │
│         │                                                   │       │       │
│         │                                                   ▼       ▼       │
│         │                                           Projector_Gamut         │
│         │                                                   │               │
│         │                                                   ▼               │
│         │                                           Projected Palette       │
│         │                                                   │               │
│         └──► ImageRegenerator ◄─────────────────────────────┘               │
│                     │                                                       │
│                     ▼                                                       │
│              Output Texture                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              OUTPUT DISPLAY                                 │
│                                                                             │
│   OutputPreviewController                                                   │
│         │                                                                   │
│         ▼                                                                   │
│   Preview Window (shows remapped image)                                     │
│                                                                             │
│   "This is what the scene looks like using only your available pigments"    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Summary

| Component | Type | Purpose |
|-----------|------|---------|
| `PictureController` | Singleton | Manages Pigment Sampler instances |
| `PictureBehavior` | Per-instance | Handles pinch gesture for crop region |
| `CropRegion` | Per-instance | Crops camera feed to tracked points |
| `ColorSamplerController` | Singleton | Eyedropper for manual pigment sampling |
| `PaletteController` | Singleton | Stores 6 pigment color slots |
| `Encoder_PigmentMix` | Singleton | Generates pigment gamut texture |
| `SourceImageController` | Singleton | Manages single Source Image capture |
| `PaletteExtractor` | Component | K-means color extraction from source |
| `Projector_Gamut` | Singleton | Maps colors to pigment gamut |
| `ImageRegenerator` | Component | Remaps source image to projected palette |
| `OutputPreviewController` | Singleton | Displays final remapped result |
| `ImagePipeline` | Orchestrator | Coordinates extraction → projection → regeneration |

---

## User Experience Flow

### Phase 1: Sample Pigments
```
User frames physical paint palette
         │
         ▼
Two-hand pinch creates Pigment Sampler
         │
         ▼
User hovers over paint colors
         │
         ▼
Pinch to sample (up to 6 colors)
         │
         ▼
Palette slots fill, gamut updates in real-time
```

### Phase 2: Capture Source
```
User frames reference scene/painting
         │
         ▼
Gesture creates Source Image
         │
         ▼
Pipeline runs automatically:
  - Extract dominant colors
  - Project to pigment gamut
  - Generate remapped output
```

### Phase 3: Preview & Iterate
```
Output Preview appears with remapped image
         │
         ├──► User can sample more pigments ──► Preview updates
         │
         ├──► User can re-capture source ──► Preview updates
         │
         └──► User can adjust parameters ──► Preview updates
```

---

## File Locations

```
Crop/Assets/Image-Processing/
├── Scripts/
│   ├── PictureController.ts          # Pigment Sampler manager
│   ├── PictureBehavior.ts            # Pinch gesture handling
│   ├── CropRegion.ts                 # Camera crop logic
│   ├── ColorSamplerController.ts     # Eyedropper tool
│   ├── PaletteController.ts          # 6-slot palette state
│   ├── SourceImageController.ts      # Source Image manager (NEW)
│   ├── OutputPreviewController.ts    # Output display manager (NEW)
│   ├── CameraService.ts              # World-to-camera coordinate conversion
│   └── Image Processing/
│       ├── Image Pipeline.ts         # Pipeline orchestrator
│       ├── PaletteExtractor.ts       # K-means extraction
│       ├── Image Regenerator.ts      # Palette remapping
│       └── ...
├── Prefabs/
│   ├── Reference Image.prefab        # Scanner prefab template
│   ├── Pigment Sampler.prefab        # Pigment sampler variant
│   ├── Preview Window.prefab         # Output display surface
│   └── ...
└── ARCHITECTURE.md                   # This file
```

---

## Key Distinctions

| Aspect | Pigment Sampler | Source Image |
|--------|-----------------|--------------|
| **Quantity** | Multiple allowed | Single instance |
| **User interaction** | Manual eyedropper sampling | Automatic extraction |
| **Purpose** | Define available pigments | Define target colors |
| **Feeds into** | Encoder_PigmentMix (gamut) | PaletteExtractor (pipeline) |
| **Updates** | On each manual sample | On capture/re-capture |
