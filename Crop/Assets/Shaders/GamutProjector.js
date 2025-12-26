// GamutProjector - Projects colors to nearest gamut match
// Uses CIE76 LAB distance for color matching
// Supports Min ΔE, Constant Hue, and Constant Lightness modes

input_texture_2d gamutPosTex;
input_texture_2d gamutColorTex;
input_texture_2d inputPosTex;
input_float gamutTexSize;
input_float inputTexWidth;
input_float inputTexHeight;
input_float gamutValidCount;
input_float projectionMode;

output_vec4 projectedPos;
output_vec4 projectedColor;

vec3 decodeLAB(vec4 data) {
    float L = data.g * 100.0;
    float a = data.r * 255.0 - 128.0;
    float b = data.b * 255.0 - 128.0;
    return vec3(L, a, b);
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

void main() {
    vec2 uv = system.getScreenUVCoord();
    vec4 inputData = inputPosTex.sample(uv);
    vec3 inputLAB = decodeLAB(inputData);

    float minDist = 1000000.0;
    vec4 bestPos = vec4(0.5, 0.5, 0.5, 1.0);
    vec4 bestColor = vec4(0.5, 0.5, 0.5, 1.0);

    int size = int(gamutTexSize);
    int maxIter = min(size * size, 4096);

    for (int i = 0; i < 4096; i++) {
        if (i >= maxIter) break;

        int px = i % size;
        int py = i / size;
        vec2 gamutUV = vec2((float(px) + 0.5) / float(size), (float(py) + 0.5) / float(size));

        vec4 gamutData = gamutPosTex.sample(gamutUV);
        float isValid = step(0.5, gamutData.a);

        vec3 gamutLAB = decodeLAB(gamutData);

        float dist = deltaE76(inputLAB, gamutLAB);
        dist = (projectionMode >= 0.5 && projectionMode < 1.5) ? hueDistance(inputLAB, gamutLAB) : dist;
        dist = projectionMode >= 1.5 ? lightnessDistance(inputLAB, gamutLAB) : dist;

        float isCloser = step(dist, minDist - 0.0001) * isValid;
        minDist = mix(minDist, dist, isCloser);
        bestPos = mix(bestPos, gamutData, isCloser);
        bestColor = mix(bestColor, gamutColorTex.sample(gamutUV), isCloser);
    }

    float inputValid = step(0.5, inputData.a);
    projectedPos = vec4(bestPos.rgb, inputValid);
    projectedColor = vec4(bestColor.rgb, inputValid);
}
