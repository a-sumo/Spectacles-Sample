// PaletteProjection - Final image color remapping
// Uses CIE76 LAB distance for color matching

input_texture_2d inputTex;
input_texture_2d paletteTex;
input_float paletteSize;
input_float ditherStrength;
input_float enableDither;
input_float projectionMode;

output_vec4 outputColor;

vec3 srgbToLinear(vec3 srgb) {
    vec3 lo = srgb / 12.92;
    vec3 hi = pow((srgb + 0.055) / 1.055, vec3(2.4));
    vec3 s = step(vec3(0.04045), srgb);
    return mix(lo, hi, s);
}

vec3 rgbToLab(vec3 rgb) {
    vec3 linear = srgbToLinear(rgb);

    float x = linear.r * 0.4124564 + linear.g * 0.3575761 + linear.b * 0.1804375;
    float y = linear.r * 0.2126729 + linear.g * 0.7151522 + linear.b * 0.0721750;
    float z = linear.r * 0.0193339 + linear.g * 0.1191920 + linear.b * 0.9503041;

    x = x / 0.95047;
    z = z / 1.08883;

    float delta = 0.20689655172;
    float delta3 = 0.00885645167;

    float fx = x > delta3 ? pow(x, 0.33333333) : (x / (3.0 * delta * delta)) + 0.13793103448;
    float fy = y > delta3 ? pow(y, 0.33333333) : (y / (3.0 * delta * delta)) + 0.13793103448;
    float fz = z > delta3 ? pow(z, 0.33333333) : (z / (3.0 * delta * delta)) + 0.13793103448;

    return vec3(116.0 * fy - 16.0, 500.0 * (fx - fy), 200.0 * (fy - fz));
}

float deltaE76(vec3 lab1, vec3 lab2) {
    float dL = lab1.x - lab2.x;
    float dA = lab1.y - lab2.y;
    float dB = lab1.z - lab2.z;
    return sqrt(dL * dL + dA * dA + dB * dB);
}

float hueDistance(vec3 lab1, vec3 lab2) {
    float C1 = sqrt(lab1.y * lab1.y + lab1.z * lab1.z);
    float C2 = sqrt(lab2.y * lab2.y + lab2.z * lab2.z);
    float h1 = atan(lab1.z, lab1.y + 0.0001);
    float h2 = atan(lab2.z, lab2.y + 0.0001);
    float hDiff = abs(h1 - h2);
    hDiff = min(hDiff, 6.28318 - hDiff);
    return hDiff * 50.0 + abs(lab1.x - lab2.x) * 0.3 + abs(C1 - C2) * 0.5;
}

float lightnessDistance(vec3 lab1, vec3 lab2) {
    float dL = abs(lab1.x - lab2.x);
    float dA = lab1.y - lab2.y;
    float dB = lab1.z - lab2.z;
    return dL * 5.0 + sqrt(dA * dA + dB * dB) * 0.5;
}

float getBayerValue(int idx) {
    float v = 0.0;
    v = (idx == 0) ? 0.0 : v;
    v = (idx == 1) ? 8.0 : v;
    v = (idx == 2) ? 2.0 : v;
    v = (idx == 3) ? 10.0 : v;
    v = (idx == 4) ? 12.0 : v;
    v = (idx == 5) ? 4.0 : v;
    v = (idx == 6) ? 14.0 : v;
    v = (idx == 7) ? 6.0 : v;
    v = (idx == 8) ? 3.0 : v;
    v = (idx == 9) ? 11.0 : v;
    v = (idx == 10) ? 1.0 : v;
    v = (idx == 11) ? 9.0 : v;
    v = (idx == 12) ? 15.0 : v;
    v = (idx == 13) ? 7.0 : v;
    v = (idx == 14) ? 13.0 : v;
    v = (idx == 15) ? 5.0 : v;
    return v / 16.0;
}

void main() {
    vec2 uv = system.getSurfaceUVCoord0();
    vec4 inputColor = inputTex.sample(uv);
    vec3 color = inputColor.rgb;

    vec2 texSize = inputTex.textureSize();
    vec2 pixelPos = uv * texSize;
    int px = int(mod(pixelPos.x, 4.0));
    int py = int(mod(pixelPos.y, 4.0));
    int bayerIndex = py * 4 + px;

    float bayerValue = getBayerValue(bayerIndex);
    float dither = (bayerValue - 0.5) * ditherStrength * 0.1 * enableDither;
    color = clamp(color + vec3(dither), vec3(0.0), vec3(1.0));

    vec3 inputLab = rgbToLab(color);

    float minDist = 999999.0;
    vec3 projectedColor = color;
    int count = int(min(paletteSize, 32.0));

    for (int i = 0; i < 32; i++) {
        float fi = float(i);
        float doCompare = step(fi, float(count) - 0.5);

        float col = mod(fi, 8.0);
        float row = floor(fi / 8.0);
        vec2 origUV = vec2((col + 0.5) / 8.0, (row + 0.5) / 8.0);
        vec3 origColor = paletteTex.sample(origUV).rgb;

        vec3 paletteLab = rgbToLab(origColor);

        float dist = deltaE76(inputLab, paletteLab);
        dist = (projectionMode >= 0.5 && projectionMode < 1.5) ? hueDistance(inputLab, paletteLab) : dist;
        dist = projectionMode >= 1.5 ? lightnessDistance(inputLab, paletteLab) : dist;

        float isCloser = step(dist, minDist - 0.0001) * doCompare;

        vec2 projUV = vec2(origUV.x, origUV.y + 0.5);
        vec3 projColor = paletteTex.sample(projUV).rgb;

        minDist = mix(minDist, dist, isCloser);
        projectedColor = mix(projectedColor, projColor, isCloser);
    }

    outputColor = vec4(projectedColor, inputColor.a);
}
