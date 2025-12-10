// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Image, decode } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
// ============================================================================
// SPECTRAL PIGMENTS
// ============================================================================
const SPECTRAL_PIGMENTS = [
  {
    name: "Titanium White",
    rgb: [
      255,
      250,
      244
    ]
  },
  {
    name: "Ivory Black",
    rgb: [
      35,
      31,
      32
    ]
  },
  {
    name: "Cadmium Yellow",
    rgb: [
      254,
      236,
      0
    ]
  },
  {
    name: "Cadmium Orange",
    rgb: [
      237,
      135,
      45
    ]
  },
  {
    name: "Cadmium Red",
    rgb: [
      227,
      38,
      54
    ]
  },
  {
    name: "Alizarin Crimson",
    rgb: [
      180,
      23,
      60
    ]
  },
  {
    name: "Ultramarine Blue",
    rgb: [
      25,
      55,
      153
    ]
  },
  {
    name: "Phthalo Blue",
    rgb: [
      15,
      43,
      91
    ]
  },
  {
    name: "Phthalo Green",
    rgb: [
      18,
      53,
      36
    ]
  },
  {
    name: "Viridian",
    rgb: [
      64,
      130,
      109
    ]
  },
  {
    name: "Yellow Ochre",
    rgb: [
      204,
      154,
      84
    ]
  },
  {
    name: "Burnt Sienna",
    rgb: [
      138,
      75,
      57
    ]
  },
  {
    name: "Burnt Umber",
    rgb: [
      115,
      74,
      56
    ]
  },
  {
    name: "Raw Umber",
    rgb: [
      130,
      102,
      68
    ]
  }
];
// ============================================================================
// SPECTRAL MIXING ENGINE (Subtractive approximation)
// ============================================================================
class SpectralMixingEngine {
  pigments;
  constructor(pigments){
    this.pigments = pigments;
  }
  mixTwo(rgb1, rgb2, t) {
    // Subtractive mixing via geometric interpolation in linear RGB
    const lin1 = rgb1.map((c)=>Math.pow(c / 255, 2.2));
    const lin2 = rgb2.map((c)=>Math.pow(c / 255, 2.2));
    const mixed = lin1.map((c1, i)=>{
      const c2 = lin2[i];
      const v1 = Math.max(0.001, c1);
      const v2 = Math.max(0.001, c2);
      return Math.pow(v1, 1 - t) * Math.pow(v2, t);
    });
    return mixed.map((c)=>Math.round(Math.max(0, Math.min(255, Math.pow(c, 1 / 2.2) * 255))));
  }
  mixMultiple(colors, weights) {
    if (colors.length === 0) return [
      128,
      128,
      128
    ];
    if (colors.length === 1) return colors[0];
    const total = weights.reduce((a, b)=>a + b, 0);
    if (total === 0) return colors[0];
    const norm = weights.map((w)=>w / total);
    const pairs = colors.map((c, i)=>({
        color: c,
        weight: norm[i]
      }));
    pairs.sort((a, b)=>b.weight - a.weight);
    let result = pairs[0].color;
    let accumulated = pairs[0].weight;
    for(let i = 1; i < pairs.length; i++){
      const { color, weight } = pairs[i];
      if (weight < 0.001) continue;
      const ratio = weight / (accumulated + weight);
      result = this.mixTwo(result, color, ratio);
      accumulated += weight;
    }
    return result;
  }
  buildGamut() {
    const gamut = [];
    const n = this.pigments.length;
    // Pure pigments
    for (const p of this.pigments){
      gamut.push({
        rgb: [
          ...p.rgb
        ],
        lab: rgbToLab(p.rgb[0], p.rgb[1], p.rgb[2])
      });
    }
    // Two-pigment mixtures
    const steps2 = 11;
    for(let i = 0; i < n; i++){
      for(let j = i + 1; j < n; j++){
        for(let s = 1; s < steps2; s++){
          const mixed = this.mixTwo(this.pigments[i].rgb, this.pigments[j].rgb, s / steps2);
          gamut.push({
            rgb: [
              ...mixed
            ],
            lab: rgbToLab(mixed[0], mixed[1], mixed[2])
          });
        }
      }
    }
    // Three-pigment mixtures
    const steps3 = 5;
    for(let i = 0; i < n; i++){
      for(let j = i + 1; j < n; j++){
        for(let k = j + 1; k < n; k++){
          for(let si = 1; si < steps3; si++){
            for(let sj = 1; sj < steps3 - si; sj++){
              const sk = steps3 - si - sj;
              if (sk <= 0) continue;
              const mixed = this.mixMultiple([
                this.pigments[i].rgb,
                this.pigments[j].rgb,
                this.pigments[k].rgb
              ], [
                si / steps3,
                sj / steps3,
                sk / steps3
              ]);
              gamut.push({
                rgb: [
                  ...mixed
                ],
                lab: rgbToLab(mixed[0], mixed[1], mixed[2])
              });
            }
          }
        }
      }
    }
    return gamut;
  }
}
// ============================================================================
// COLOR CONVERSION
// ============================================================================
function rgbToLab(r, g, b) {
  let rn = r / 255, gn = g / 255, bn = b / 255;
  rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92;
  gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92;
  bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92;
  let x = (rn * 0.4124564 + gn * 0.3575761 + bn * 0.1804375) / 0.95047;
  let y = rn * 0.2126729 + gn * 0.7151522 + bn * 0.0721750;
  let z = (rn * 0.0193339 + gn * 0.1191920 + bn * 0.9503041) / 1.08883;
  x = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;
  return {
    l: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  };
}
function rgbToHex(r, g, b) {
  return '#' + [
    r,
    g,
    b
  ].map((c)=>Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('');
}
function deltaE2000(lab1, lab2) {
  const L1 = lab1.l, a1 = lab1.a, b1 = lab1.b;
  const L2 = lab2.l, a2 = lab2.a, b2 = lab2.b;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cab = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cab, 7) / (Math.pow(Cab, 7) + Math.pow(25, 7))));
  const ap1 = (1 + G) * a1, ap2 = (1 + G) * a2;
  const Cp1 = Math.sqrt(ap1 * ap1 + b1 * b1);
  const Cp2 = Math.sqrt(ap2 * ap2 + b2 * b2);
  let hp1 = Math.atan2(b1, ap1) * 180 / Math.PI;
  if (hp1 < 0) hp1 += 360;
  let hp2 = Math.atan2(b2, ap2) * 180 / Math.PI;
  if (hp2 < 0) hp2 += 360;
  const dL = L2 - L1, dCp = Cp2 - Cp1;
  let dhp = 0;
  if (Cp1 * Cp2 !== 0) {
    dhp = hp2 - hp1;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(dhp * Math.PI / 360);
  const Lp = (L1 + L2) / 2, Cp = (Cp1 + Cp2) / 2;
  let hp = (hp1 + hp2) / 2;
  if (Math.abs(hp1 - hp2) > 180) hp += hp1 + hp2 < 360 ? 180 : -180;
  if (Cp1 * Cp2 === 0) hp = hp1 + hp2;
  const T = 1 - 0.17 * Math.cos((hp - 30) * Math.PI / 180) + 0.24 * Math.cos(2 * hp * Math.PI / 180) + 0.32 * Math.cos((3 * hp + 6) * Math.PI / 180) - 0.20 * Math.cos((4 * hp - 63) * Math.PI / 180);
  const dTheta = 30 * Math.exp(-Math.pow((hp - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(Cp, 7) / (Math.pow(Cp, 7) + Math.pow(25, 7)));
  const SL = 1 + 0.015 * Math.pow(Lp - 50, 2) / Math.sqrt(20 + Math.pow(Lp - 50, 2));
  const SC = 1 + 0.045 * Cp;
  const SH = 1 + 0.015 * Cp * T;
  const RT = -Math.sin(2 * dTheta * Math.PI / 180) * RC;
  return Math.sqrt(Math.pow(dL / SL, 2) + Math.pow(dCp / SC, 2) + Math.pow(dHp / SH, 2) + RT * (dCp / SC) * (dHp / SH));
}
function deltaESimple(lab1, lab2) {
  return Math.sqrt(Math.pow(lab1.l - lab2.l, 2) + Math.pow(lab1.a - lab2.a, 2) + Math.pow(lab1.b - lab2.b, 2));
}
// ============================================================================
// GAMUT PROJECTOR
// ============================================================================
class GamutProjector {
  gamut;
  buckets = new Map();
  bucketSize = 8;
  constructor(gamut){
    this.gamut = gamut;
    for(let i = 0; i < gamut.length; i++){
      const { l, a, b } = gamut[i].lab;
      const key = `${Math.floor(l / this.bucketSize)},${Math.floor((a + 128) / this.bucketSize)},${Math.floor((b + 128) / this.bucketSize)}`;
      if (!this.buckets.has(key)) this.buckets.set(key, []);
      this.buckets.get(key).push(i);
    }
  }
  project(lab) {
    const bl = Math.floor(lab.l / this.bucketSize);
    const ba = Math.floor((lab.a + 128) / this.bucketSize);
    const bb = Math.floor((lab.b + 128) / this.bucketSize);
    let minDe = Infinity, bestIdx = 0;
    for(let radius = 0; radius <= 4 && minDe > 1; radius++){
      for(let dl = -radius; dl <= radius; dl++){
        for(let da = -radius; da <= radius; da++){
          for(let db = -radius; db <= radius; db++){
            if (radius > 0 && Math.abs(dl) < radius && Math.abs(da) < radius && Math.abs(db) < radius) continue;
            const bucket = this.buckets.get(`${bl + dl},${ba + da},${bb + db}`);
            if (!bucket) continue;
            for (const idx of bucket){
              const de = deltaE2000(lab, this.gamut[idx].lab);
              if (de < minDe) {
                minDe = de;
                bestIdx = idx;
              }
            }
          }
        }
      }
    }
    if (minDe === Infinity) {
      for(let i = 0; i < this.gamut.length; i++){
        const de = deltaE2000(lab, this.gamut[i].lab);
        if (de < minDe) {
          minDe = de;
          bestIdx = i;
        }
      }
    }
    return {
      rgb: [
        ...this.gamut[bestIdx].rgb
      ],
      lab: {
        ...this.gamut[bestIdx].lab
      },
      de: minDe
    };
  }
}
// ============================================================================
// K-MEANS
// ============================================================================
function kmeansLab(pixels, k, maxIter = 30) {
  if (pixels.length === 0) return [];
  k = Math.min(k, pixels.length);
  const labPixels = pixels.map((p)=>({
      rgb: p,
      lab: rgbToLab(p[0], p[1], p[2])
    }));
  const centroids = [
    {
      ...labPixels[Math.floor(Math.random() * labPixels.length)].lab
    }
  ];
  for(let c = 1; c < k; c++){
    let maxDist = -1, bestIdx = 0;
    for(let i = 0; i < labPixels.length; i++){
      let minD = Infinity;
      for (const cent of centroids){
        const d = deltaESimple(labPixels[i].lab, cent);
        if (d < minD) minD = d;
      }
      if (minD > maxDist) {
        maxDist = minD;
        bestIdx = i;
      }
    }
    centroids.push({
      ...labPixels[bestIdx].lab
    });
  }
  const assignments = new Array(labPixels.length).fill(0);
  for(let iter = 0; iter < maxIter; iter++){
    let changed = false;
    for(let i = 0; i < labPixels.length; i++){
      let minD = Infinity, nearest = 0;
      for(let c = 0; c < centroids.length; c++){
        const d = deltaESimple(labPixels[i].lab, centroids[c]);
        if (d < minD) {
          minD = d;
          nearest = c;
        }
      }
      if (assignments[i] !== nearest) {
        changed = true;
        assignments[i] = nearest;
      }
    }
    if (!changed) break;
    const sums = centroids.map(()=>({
        l: 0,
        a: 0,
        b: 0,
        count: 0
      }));
    for(let i = 0; i < labPixels.length; i++){
      const s = sums[assignments[i]];
      s.l += labPixels[i].lab.l;
      s.a += labPixels[i].lab.a;
      s.b += labPixels[i].lab.b;
      s.count++;
    }
    for(let c = 0; c < centroids.length; c++){
      if (sums[c].count > 0) {
        centroids[c] = {
          l: sums[c].l / sums[c].count,
          a: sums[c].a / sums[c].count,
          b: sums[c].b / sums[c].count
        };
      }
    }
  }
  const clusters = centroids.map(()=>({
      rgbSum: [
        0,
        0,
        0
      ],
      count: 0
    }));
  for(let i = 0; i < labPixels.length; i++){
    const c = clusters[assignments[i]];
    c.rgbSum[0] += labPixels[i].rgb[0];
    c.rgbSum[1] += labPixels[i].rgb[1];
    c.rgbSum[2] += labPixels[i].rgb[2];
    c.count++;
  }
  return clusters.filter((c)=>c.count > 0).map((c)=>{
    const rgb = [
      Math.round(c.rgbSum[0] / c.count),
      Math.round(c.rgbSum[1] / c.count),
      Math.round(c.rgbSum[2] / c.count)
    ];
    return {
      rgb,
      lab: rgbToLab(rgb[0], rgb[1], rgb[2]),
      population: c.count / labPixels.length
    };
  }).sort((a, b)=>b.population - a.population);
}
// ============================================================================
// LAB DITHERING
// ============================================================================
function applyLabDithering(img, palette, method, strength) {
  const w = img.width, h = img.height;
  const labBuffer = new Float32Array(w * h * 3);
  for(let y = 1; y <= h; y++){
    for(let x = 1; x <= w; x++){
      const px = img.getPixelAt(x, y);
      const lab = rgbToLab(px >> 24 & 0xff, px >> 16 & 0xff, px >> 8 & 0xff);
      const idx = ((y - 1) * w + (x - 1)) * 3;
      labBuffer[idx] = lab.l;
      labBuffer[idx + 1] = lab.a;
      labBuffer[idx + 2] = lab.b;
    }
  }
  const result = new Image(w, h);
  const matrices = {
    floyd: [
      [
        1,
        0,
        7 / 16
      ],
      [
        -1,
        1,
        3 / 16
      ],
      [
        0,
        1,
        5 / 16
      ],
      [
        1,
        1,
        1 / 16
      ]
    ],
    atkinson: [
      [
        1,
        0,
        1 / 8
      ],
      [
        2,
        0,
        1 / 8
      ],
      [
        -1,
        1,
        1 / 8
      ],
      [
        0,
        1,
        1 / 8
      ],
      [
        1,
        1,
        1 / 8
      ],
      [
        0,
        2,
        1 / 8
      ]
    ]
  };
  const matrix = method !== "none" ? matrices[method] : null;
  for(let y = 0; y < h; y++){
    for(let x = 0; x < w; x++){
      const idx = (y * w + x) * 3;
      const current = {
        l: labBuffer[idx],
        a: labBuffer[idx + 1],
        b: labBuffer[idx + 2]
      };
      let minDe = Infinity, closest = palette[0];
      for (const p of palette){
        const de = deltaESimple(current, p.lab);
        if (de < minDe) {
          minDe = de;
          closest = p;
        }
      }
      const alpha = img.getPixelAt(x + 1, y + 1) & 0xff;
      result.setPixelAt(x + 1, y + 1, closest.rgb[0] << 24 | closest.rgb[1] << 16 | closest.rgb[2] << 8 | alpha);
      if (matrix) {
        const errL = (current.l - closest.lab.l) * strength;
        const errA = (current.a - closest.lab.a) * strength;
        const errB = (current.b - closest.lab.b) * strength;
        for (const [dx, dy, wt] of matrix){
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nIdx = (ny * w + nx) * 3;
            labBuffer[nIdx] += errL * wt;
            labBuffer[nIdx + 1] += errA * wt;
            labBuffer[nIdx + 2] += errB * wt;
          }
        }
      }
    }
  }
  return result;
}
// ============================================================================
// IMAGE HELPERS
// ============================================================================
async function extractPixels(imageData, maxSize = 200) {
  const img = await decode(imageData);
  if (!(img instanceof Image)) throw new Error("Failed to decode");
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const proc = scale < 1 ? img.resize(Math.round(img.width * scale), Math.round(img.height * scale)) : img;
  const pixels = [];
  for(let y = 1; y <= proc.height; y++){
    for(let x = 1; x <= proc.width; x++){
      const px = proc.getPixelAt(x, y);
      if ((px & 0xff) > 0) pixels.push([
        px >> 24 & 0xff,
        px >> 16 & 0xff,
        px >> 8 & 0xff
      ]);
    }
  }
  return {
    width: proc.width,
    height: proc.height,
    pixels
  };
}
async function loadImageForRemapping(imageData, maxSize = 500) {
  const img = await decode(imageData);
  if (!(img instanceof Image)) throw new Error("Failed to decode");
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  return scale < 1 ? img.resize(Math.round(img.width * scale), Math.round(img.height * scale)) : img;
}
// ============================================================================
// BASE64 ENCODING
// ============================================================================
function uint8ArrayToBase64(bytes) {
  let binary = '';
  for(let i = 0; i < bytes.length; i++){
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
// ============================================================================
// CORS & HANDLER
// ============================================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info"
};
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") return new Response(null, {
    headers: corsHeaders
  });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  try {
    const contentType = req.headers.get("content-type") || "";
    let imageData;
    let options = {};
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { imageUrl, imageBase64, ...opts } = body;
      options = opts;
      if (imageBase64) {
        // Decode base64 input
        const binary = atob(imageBase64);
        imageData = new Uint8Array(binary.length);
        for(let i = 0; i < binary.length; i++){
          imageData[i] = binary.charCodeAt(i);
        }
      } else if (imageUrl) {
        const resp = await fetch(imageUrl);
        if (!resp.ok) throw new Error("Failed to download");
        imageData = new Uint8Array(await resp.arrayBuffer());
      } else {
        throw new Error("No imageUrl or imageBase64");
      }
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file) throw new Error("No file");
      imageData = new Uint8Array(await file.arrayBuffer());
      options = {
        numColors: parseInt(formData.get("numColors")?.toString() || "24"),
        ditherMethod: formData.get("ditherMethod")?.toString() || "floyd",
        ditherStrength: parseFloat(formData.get("ditherStrength")?.toString() || "0.85"),
        outputRemappedImage: formData.get("outputRemappedImage") === "true",
        maxOutputSize: parseInt(formData.get("maxOutputSize")?.toString() || "512")
      };
    } else {
      throw new Error("Invalid content type");
    }
    const numColors = Math.max(2, Math.min(options.numColors || 24, 48));
    const ditherMethod = options.ditherMethod || "floyd";
    const ditherStrength = Math.max(0, Math.min(options.ditherStrength ?? 0.85, 1));
    const outputRemappedImage = options.outputRemappedImage ?? true;
    const maxOutputSize = options.maxOutputSize || 512;
    console.log("Extracting pixels...");
    const { width, height, pixels } = await extractPixels(imageData, 200);
    if (pixels.length === 0) throw new Error("No pixels");
    let sampled = pixels;
    if (sampled.length > 10000) {
      sampled = Array.from({
        length: 10000
      }, ()=>pixels[Math.floor(Math.random() * pixels.length)]);
    }
    console.log("K-means clustering...");
    const extracted = kmeansLab(sampled, numColors);
    console.log("Building gamut...");
    const mixer = new SpectralMixingEngine(SPECTRAL_PIGMENTS);
    const gamut = mixer.buildGamut();
    console.log("Projecting...");
    const projector = new GamutProjector(gamut);
    const projected = extracted.map((c)=>{
      const p = projector.project(c.lab);
      return {
        rgb: p.rgb,
        hex: rgbToHex(p.rgb[0], p.rgb[1], p.rgb[2]),
        lab: p.lab,
        population: c.population,
        originalRgb: c.rgb,
        originalLab: c.lab,
        de: p.de
      };
    });
    const des = projected.map((c)=>c.de);
    const stats = {
      averageDeltaE: Math.round(des.reduce((a, b)=>a + b, 0) / des.length * 100) / 100,
      maxDeltaE: Math.round(Math.max(...des) * 100) / 100,
      minDeltaE: Math.round(Math.min(...des) * 100) / 100,
      method: "subtractive"
    };
    // Generate remapped image as base64
    let remappedImageBase64;
    let remappedWidth;
    let remappedHeight;
    if (outputRemappedImage) {
      console.log("Remapping image...");
      const fullImg = await loadImageForRemapping(imageData, maxOutputSize);
      const remapped = applyLabDithering(fullImg, projected.map((c)=>({
          rgb: c.rgb,
          lab: c.lab
        })), ditherMethod, ditherStrength);
      console.log("Encoding PNG to base64...");
      const pngData = await remapped.encode();
      remappedImageBase64 = uint8ArrayToBase64(pngData);
      remappedWidth = remapped.width;
      remappedHeight = remapped.height;
      console.log(`Output: ${remapped.width}x${remapped.height}, ${pngData.length} bytes, ${remappedImageBase64.length} base64 chars`);
    }
    return new Response(JSON.stringify({
      success: true,
      imageSize: {
        width,
        height
      },
      extractedPalette: extracted.map((c)=>({
          rgb: c.rgb,
          hex: rgbToHex(c.rgb[0], c.rgb[1], c.rgb[2]),
          lab: {
            l: Math.round(c.lab.l * 100) / 100,
            a: Math.round(c.lab.a * 100) / 100,
            b: Math.round(c.lab.b * 100) / 100
          },
          population: Math.round(c.population * 10000) / 100
        })),
      projectedPalette: projected.map((c)=>({
          rgb: c.rgb,
          hex: c.hex,
          lab: {
            l: Math.round(c.lab.l * 100) / 100,
            a: Math.round(c.lab.a * 100) / 100,
            b: Math.round(c.lab.b * 100) / 100
          },
          population: Math.round(c.population * 10000) / 100,
          originalRgb: c.originalRgb,
          originalHex: rgbToHex(c.originalRgb[0], c.originalRgb[1], c.originalRgb[2]),
          de: Math.round(c.de * 100) / 100
        })),
      gamutSize: gamut.length,
      pigments: SPECTRAL_PIGMENTS.map((p)=>({
          name: p.name,
          rgb: [
            ...p.rgb
          ]
        })),
      statistics: stats,
      // Base64 encoded PNG
      remappedImageBase64,
      remappedWidth,
      remappedHeight
    }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Processing failed",
      details: error instanceof Error ? error.message : "Unknown"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
});
