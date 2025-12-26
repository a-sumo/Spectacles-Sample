// PigmentGamutEncoder - Spectral Color Mixing
// Based on spectral.js by Ronald van Wijnen (MIT License)
// Uses 38-band spectral reflectance for physically accurate paint mixing

input_texture_2d pigmentTex;
input_float numPigments;
input_float texWidth;
input_float texSize;
input_float mixSteps;

output_vec4 labPos;
output_vec4 rgbCol;

// ============ SPECTRAL CONSTANTS ============

const int SPECTRAL_SIZE = 38;
const float SPECTRAL_GAMMA = 2.4;
const float SPECTRAL_EPSILON = 0.0000000000000001;

// ============ HELPER FUNCTIONS ============

vec3 getPigment(int i) {
    float u = (float(i) + 0.5) / texWidth;
    return pigmentTex.sample(vec2(u, 0.5)).rgb;
}

float spectral_uncompand(float x) {
    return (x < 0.04045) ? x / 12.92 : pow((x + 0.055) / 1.055, SPECTRAL_GAMMA);
}

float spectral_compand(float x) {
    return (x < 0.0031308) ? x * 12.92 : 1.055 * pow(x, 1.0 / SPECTRAL_GAMMA) - 0.055;
}

vec3 spectral_srgb_to_linear(vec3 srgb) {
    return vec3(spectral_uncompand(srgb.r), spectral_uncompand(srgb.g), spectral_uncompand(srgb.b));
}

vec3 spectral_linear_to_srgb(vec3 lrgb) {
    return clamp(vec3(spectral_compand(lrgb.r), spectral_compand(lrgb.g), spectral_compand(lrgb.b)), 0.0, 1.0);
}

float KS(float R) {
    return pow(1.0 - R, 2.0) / (2.0 * max(R, SPECTRAL_EPSILON));
}

float KM(float ks) {
    return 1.0 + ks - sqrt(pow(ks, 2.0) + 2.0 * ks);
}

// ============ SPECTRAL COEFFICIENTS ============
// Pre-computed coefficients for RGB to spectral conversion

struct SpectralCoeffs {
    float w;
    float c;
    float m;
    float y;
    float r;
    float g;
    float b;
};

SpectralCoeffs getSpectralCoeffs(int band) {
    SpectralCoeffs sc;

    // Coefficients for each of the 38 spectral bands
    if (band == 0) { sc.w=1.0011607; sc.c=0.9705850; sc.m=0.9906736; sc.y=0.0210523; sc.r=0.0315606; sc.g=0.0095561; sc.b=0.9794048; }
    else if (band == 1) { sc.w=1.0011607; sc.c=0.9705925; sc.m=0.9906715; sc.y=0.0210565; sc.r=0.0315521; sc.g=0.0095582; sc.b=0.9794007; }
    else if (band == 2) { sc.w=1.0011603; sc.c=0.9706253; sc.m=0.9906626; sc.y=0.0210746; sc.r=0.0315148; sc.g=0.0095673; sc.b=0.9793829; }
    else if (band == 3) { sc.w=1.0011587; sc.c=0.9707868; sc.m=0.9906181; sc.y=0.0211649; sc.r=0.0313318; sc.g=0.0096129; sc.b=0.9792944; }
    else if (band == 4) { sc.w=1.0011526; sc.c=0.9713687; sc.m=0.9904515; sc.y=0.0215028; sc.r=0.0306730; sc.g=0.0097837; sc.b=0.9789630; }
    else if (band == 5) { sc.w=1.0011325; sc.c=0.9731632; sc.m=0.9898711; sc.y=0.0226739; sc.r=0.0286480; sc.g=0.0103786; sc.b=0.9778145; }
    else if (band == 6) { sc.w=1.0010850; sc.c=0.9767402; sc.m=0.9882866; sc.y=0.0258236; sc.r=0.0246450; sc.g=0.0120026; sc.b=0.9747243; }
    else if (band == 7) { sc.w=1.0009969; sc.c=0.9815876; sc.m=0.9842907; sc.y=0.0334879; sc.r=0.0192961; sc.g=0.0160978; sc.b=0.9671985; }
    else if (band == 8) { sc.w=1.0008653; sc.c=0.9862803; sc.m=0.9739349; sc.y=0.0519070; sc.r=0.0142067; sc.g=0.0267062; sc.b=0.9490797; }
    else if (band == 9) { sc.w=1.0006963; sc.c=0.9899491; sc.m=0.9418178; sc.y=0.1007490; sc.r=0.0102943; sc.g=0.0595555; sc.b=0.9008501; }
    else if (band == 10) { sc.w=1.0005050; sc.c=0.9924927; sc.m=0.8173903; sc.y=0.2391299; sc.r=0.0076191; sc.g=0.1860398; sc.b=0.7631504; }
    else if (band == 11) { sc.w=1.0003081; sc.c=0.9941457; sc.m=0.4324728; sc.y=0.5348043; sc.r=0.0058980; sc.g=0.5705798; sc.b=0.4659222; }
    else if (band == 12) { sc.w=1.0001197; sc.c=0.9951840; sc.m=0.1384540; sc.y=0.7978076; sc.r=0.0048233; sc.g=0.8614678; sc.b=0.2012633; }
    else if (band == 13) { sc.w=0.9999528; sc.c=0.9957568; sc.m=0.0537347; sc.y=0.9114499; sc.r=0.0042299; sc.g=0.9458791; sc.b=0.0877524; }
    else if (band == 14) { sc.w=0.9998218; sc.c=0.9959128; sc.m=0.0292175; sc.y=0.9537980; sc.r=0.0040599; sc.g=0.9704655; sc.b=0.0457177; }
    else if (band == 15) { sc.w=0.9997386; sc.c=0.9956062; sc.m=0.0213137; sc.y=0.9712416; sc.r=0.0043534; sc.g=0.9784136; sc.b=0.0284706; }
    else if (band == 16) { sc.w=0.9997096; sc.c=0.9945976; sc.m=0.0201350; sc.y=0.9793031; sc.r=0.0053434; sc.g=0.9795890; sc.b=0.0205272; }
    else if (band == 17) { sc.w=0.9997319; sc.c=0.9922157; sc.m=0.0241323; sc.y=0.9833801; sc.r=0.0076917; sc.g=0.9755335; sc.b=0.0165303; }
    else if (band == 18) { sc.w=0.9997994; sc.c=0.9862365; sc.m=0.0372236; sc.y=0.9854612; sc.r=0.0135970; sc.g=0.9622888; sc.b=0.0145135; }
    else if (band == 19) { sc.w=0.9999003; sc.c=0.9679433; sc.m=0.0760507; sc.y=0.9864350; sc.r=0.0316975; sc.g=0.9231216; sc.b=0.0136004; }
    else if (band == 20) { sc.w=1.0000204; sc.c=0.8912850; sc.m=0.2053755; sc.y=0.9867383; sc.r=0.1078612; sc.g=0.7934340; sc.b=0.0133604; }
    else if (band == 21) { sc.w=1.0001448; sc.c=0.5362025; sc.m=0.5412689; sc.y=0.9866179; sc.r=0.4638126; sc.g=0.4592701; sc.b=0.0135489; }
    else if (band == 22) { sc.w=1.0002600; sc.c=0.1541081; sc.m=0.8158417; sc.y=0.9862778; sc.r=0.8470554; sc.g=0.1855741; sc.b=0.0139594; }
    else if (band == 23) { sc.w=1.0003558; sc.c=0.0574575; sc.m=0.9128177; sc.y=0.9858606; sc.r=0.9431854; sc.g=0.0881775; sc.b=0.0144434; }
    else if (band == 24) { sc.w=1.0004275; sc.c=0.0315350; sc.m=0.9463398; sc.y=0.9854749; sc.r=0.9688622; sc.g=0.0543630; sc.b=0.0148854; }
    else if (band == 25) { sc.w=1.0004762; sc.c=0.0222634; sc.m=0.9599277; sc.y=0.9851769; sc.r=0.9780307; sc.g=0.0406288; sc.b=0.0152254; }
    else if (band == 26) { sc.w=1.0005072; sc.c=0.0182023; sc.m=0.9662606; sc.y=0.9849716; sc.r=0.9820436; sc.g=0.0342215; sc.b=0.0154593; }
    else if (band == 27) { sc.w=1.0005252; sc.c=0.0162991; sc.m=0.9693260; sc.y=0.9848463; sc.r=0.9839236; sc.g=0.0311186; sc.b=0.0156018; }
    else if (band == 28) { sc.w=1.0005351; sc.c=0.0153656; sc.m=0.9708545; sc.y=0.9847754; sc.r=0.9848455; sc.g=0.0295709; sc.b=0.0156825; }
    else if (band == 29) { sc.w=1.0005402; sc.c=0.0149112; sc.m=0.9716051; sc.y=0.9847381; sc.r=0.9852943; sc.g=0.0288109; sc.b=0.0157249; }
    else if (band == 30) { sc.w=1.0005427; sc.c=0.0146954; sc.m=0.9719628; sc.y=0.9847196; sc.r=0.9855073; sc.g=0.0284486; sc.b=0.0157458; }
    else if (band == 31) { sc.w=1.0005439; sc.c=0.0145964; sc.m=0.9721273; sc.y=0.9847110; sc.r=0.9856051; sc.g=0.0282820; sc.b=0.0157556; }
    else if (band == 32) { sc.w=1.0005445; sc.c=0.0145470; sc.m=0.9722094; sc.y=0.9847067; sc.r=0.9856538; sc.g=0.0281988; sc.b=0.0157605; }
    else if (band == 33) { sc.w=1.0005448; sc.c=0.0145229; sc.m=0.9722496; sc.y=0.9847046; sc.r=0.9856777; sc.g=0.0281582; sc.b=0.0157630; }
    else if (band == 34) { sc.w=1.0005449; sc.c=0.0145120; sc.m=0.9722676; sc.y=0.9847036; sc.r=0.9856884; sc.g=0.0281399; sc.b=0.0157641; }
    else if (band == 35) { sc.w=1.0005450; sc.c=0.0145067; sc.m=0.9722765; sc.y=0.9847031; sc.r=0.9856937; sc.g=0.0281309; sc.b=0.0157646; }
    else if (band == 36) { sc.w=1.0005450; sc.c=0.0145045; sc.m=0.9722802; sc.y=0.9847029; sc.r=0.9856959; sc.g=0.0281271; sc.b=0.0157648; }
    else { sc.w=1.0005450; sc.c=0.0145038; sc.m=0.9722813; sc.y=0.9847029; sc.r=0.9856965; sc.g=0.0281260; sc.b=0.0157649; }

    return sc;
}

// XYZ observer coefficients for each band
vec3 getXYZCoeff(int band) {
    if (band == 0) return vec3(0.0000647, 0.0000018, 0.0003050);
    else if (band == 1) return vec3(0.0002194, 0.0000062, 0.0010368);
    else if (band == 2) return vec3(0.0011206, 0.0000310, 0.0053131);
    else if (band == 3) return vec3(0.0037666, 0.0001047, 0.0179544);
    else if (band == 4) return vec3(0.0118806, 0.0003536, 0.0570776);
    else if (band == 5) return vec3(0.0232864, 0.0009515, 0.1136516);
    else if (band == 6) return vec3(0.0345594, 0.0022823, 0.1733587);
    else if (band == 7) return vec3(0.0372238, 0.0042073, 0.1962066);
    else if (band == 8) return vec3(0.0324184, 0.0066888, 0.1860824);
    else if (band == 9) return vec3(0.0212332, 0.0098884, 0.1399505);
    else if (band == 10) return vec3(0.0104910, 0.0152495, 0.0891745);
    else if (band == 11) return vec3(0.0032958, 0.0214183, 0.0478962);
    else if (band == 12) return vec3(0.0005070, 0.0334229, 0.0281456);
    else if (band == 13) return vec3(0.0009487, 0.0513100, 0.0161377);
    else if (band == 14) return vec3(0.0062737, 0.0704021, 0.0077591);
    else if (band == 15) return vec3(0.0168646, 0.0878387, 0.0042961);
    else if (band == 16) return vec3(0.0286896, 0.0942491, 0.0020055);
    else if (band == 17) return vec3(0.0426748, 0.0979567, 0.0008615);
    else if (band == 18) return vec3(0.0562547, 0.0941522, 0.0003690);
    else if (band == 19) return vec3(0.0694704, 0.0867810, 0.0001914);
    else if (band == 20) return vec3(0.0830532, 0.0788565, 0.0001496);
    else if (band == 21) return vec3(0.0861261, 0.0635267, 0.0000923);
    else if (band == 22) return vec3(0.0904661, 0.0537414, 0.0000681);
    else if (band == 23) return vec3(0.0850039, 0.0426461, 0.0000288);
    else if (band == 24) return vec3(0.0709067, 0.0316173, 0.0000158);
    else if (band == 25) return vec3(0.0506289, 0.0208852, 0.0000039);
    else if (band == 26) return vec3(0.0354740, 0.0138601, 0.0000016);
    else if (band == 27) return vec3(0.0214682, 0.0081026, 0.0000000);
    else if (band == 28) return vec3(0.0125165, 0.0046301, 0.0000000);
    else if (band == 29) return vec3(0.0068046, 0.0024914, 0.0000000);
    else if (band == 30) return vec3(0.0034646, 0.0012593, 0.0000000);
    else if (band == 31) return vec3(0.0014976, 0.0005416, 0.0000000);
    else if (band == 32) return vec3(0.0007697, 0.0002780, 0.0000000);
    else if (band == 33) return vec3(0.0004074, 0.0001471, 0.0000000);
    else if (band == 34) return vec3(0.0001690, 0.0000610, 0.0000000);
    else if (band == 35) return vec3(0.0000952, 0.0000344, 0.0000000);
    else if (band == 36) return vec3(0.0000490, 0.0000177, 0.0000000);
    else return vec3(0.0000200, 0.0000072, 0.0000000);
}

// Get spectral reflectance for a single band from linear RGB
float getReflectance(vec3 lrgb, int band) {
    float w = min(lrgb.r, min(lrgb.g, lrgb.b));
    vec3 rgb = lrgb - w;

    float c = min(rgb.g, rgb.b);
    float m = min(rgb.r, rgb.b);
    float y = min(rgb.r, rgb.g);

    float r = min(max(0.0, rgb.r - rgb.b), max(0.0, rgb.r - rgb.g));
    float g = min(max(0.0, rgb.g - rgb.b), max(0.0, rgb.g - rgb.r));
    float b = min(max(0.0, rgb.b - rgb.g), max(0.0, rgb.b - rgb.r));

    SpectralCoeffs sc = getSpectralCoeffs(band);

    return max(SPECTRAL_EPSILON, w * sc.w + c * sc.c + m * sc.m + y * sc.y + r * sc.r + g * sc.g + b * sc.b);
}

vec3 spectral_xyz_to_srgb(vec3 xyz) {
    float r = xyz.x * 3.2409699 + xyz.y * -1.5373832 + xyz.z * -0.4986108;
    float g = xyz.x * -0.9692436 + xyz.y * 1.8759675 + xyz.z * 0.0415551;
    float b = xyz.x * 0.0556301 + xyz.y * -0.2039770 + xyz.z * 1.0569715;
    return spectral_linear_to_srgb(vec3(r, g, b));
}

// ============ SPECTRAL MIXING ============

vec3 spectralMix2(vec3 color1, vec3 color2, float factor1, float factor2) {
    vec3 lrgb1 = spectral_srgb_to_linear(color1);
    vec3 lrgb2 = spectral_srgb_to_linear(color2);

    // Calculate luminances for concentration weighting
    float lum1 = 0.0;
    float lum2 = 0.0;
    for (int i = 0; i < SPECTRAL_SIZE; i++) {
        vec3 xyzCoeff = getXYZCoeff(i);
        lum1 += getReflectance(lrgb1, i) * xyzCoeff.y;
        lum2 += getReflectance(lrgb2, i) * xyzCoeff.y;
    }

    float conc1 = factor1 * factor1 * lum1;
    float conc2 = factor2 * factor2 * lum2;
    float totalConc = conc1 + conc2;

    // Mix spectrally
    vec3 xyz = vec3(0.0);
    for (int i = 0; i < SPECTRAL_SIZE; i++) {
        float R1 = getReflectance(lrgb1, i);
        float R2 = getReflectance(lrgb2, i);

        float ksMix = (KS(R1) * conc1 + KS(R2) * conc2) / totalConc;
        float Rmix = KM(ksMix);

        xyz += Rmix * getXYZCoeff(i);
    }

    return spectral_xyz_to_srgb(xyz);
}

vec3 spectralMix3(vec3 color1, vec3 color2, vec3 color3, float f1, float f2, float f3) {
    vec3 lrgb1 = spectral_srgb_to_linear(color1);
    vec3 lrgb2 = spectral_srgb_to_linear(color2);
    vec3 lrgb3 = spectral_srgb_to_linear(color3);

    float lum1 = 0.0, lum2 = 0.0, lum3 = 0.0;
    for (int i = 0; i < SPECTRAL_SIZE; i++) {
        vec3 xyzCoeff = getXYZCoeff(i);
        lum1 += getReflectance(lrgb1, i) * xyzCoeff.y;
        lum2 += getReflectance(lrgb2, i) * xyzCoeff.y;
        lum3 += getReflectance(lrgb3, i) * xyzCoeff.y;
    }

    float conc1 = f1 * f1 * lum1;
    float conc2 = f2 * f2 * lum2;
    float conc3 = f3 * f3 * lum3;
    float totalConc = conc1 + conc2 + conc3;

    vec3 xyz = vec3(0.0);
    for (int i = 0; i < SPECTRAL_SIZE; i++) {
        float R1 = getReflectance(lrgb1, i);
        float R2 = getReflectance(lrgb2, i);
        float R3 = getReflectance(lrgb3, i);

        float ksMix = (KS(R1) * conc1 + KS(R2) * conc2 + KS(R3) * conc3) / totalConc;
        float Rmix = KM(ksMix);

        xyz += Rmix * getXYZCoeff(i);
    }

    return spectral_xyz_to_srgb(xyz);
}

// ============ RGB TO LAB ============

vec3 rgb2lab(vec3 rgb) {
    vec3 lrgb = spectral_srgb_to_linear(rgb);

    float x = lrgb.r * 0.4124564 + lrgb.g * 0.3575761 + lrgb.b * 0.1804375;
    float y = lrgb.r * 0.2126729 + lrgb.g * 0.7151522 + lrgb.b * 0.0721750;
    float z = lrgb.r * 0.0193339 + lrgb.g * 0.1191920 + lrgb.b * 0.9503041;

    x = x / 0.95047;
    z = z / 1.08883;

    float delta = 6.0 / 29.0;
    float delta3 = delta * delta * delta;

    float fx = x > delta3 ? pow(x, 1.0 / 3.0) : (x / (3.0 * delta * delta)) + (4.0 / 29.0);
    float fy = y > delta3 ? pow(y, 1.0 / 3.0) : (y / (3.0 * delta * delta)) + (4.0 / 29.0);
    float fz = z > delta3 ? pow(z, 1.0 / 3.0) : (z / (3.0 * delta * delta)) + (4.0 / 29.0);

    float L = 116.0 * fy - 16.0;
    float a = 500.0 * (fx - fy);
    float b = 200.0 * (fy - fz);

    return vec3(L, a, b);
}

// ============ MAIN ============

void main() {
    vec2 uv = system.getScreenUVCoord();

    float col = floor(uv.x * texSize);
    float row = floor(uv.y * texSize);
    float pixelIndex = row * texSize + col;
    int idx = int(pixelIndex);

    int n = int(numPigments);
    int steps = int(mixSteps);

    // Calculate zone sizes
    int purePigments = n;
    int numPairs = n * (n - 1) / 2;
    int twoWayMixes = numPairs * (steps - 1);

    int numTriples = n * (n - 1) * (n - 2) / 6;
    int threeWayStepsPerTriple = 0;
    for (int s1 = 1; s1 < 20; s1++) {
        if (s1 >= steps - 1) break;
        for (int s2 = 1; s2 < 20; s2++) {
            if (s2 >= steps - s1) break;
            threeWayStepsPerTriple++;
        }
    }
    int threeWayMixes = numTriples * threeWayStepsPerTriple;

    int totalMixes = purePigments + twoWayMixes + threeWayMixes;

    vec3 mixedRGB = vec3(0.0);
    float valid = 0.0;

    // ======== PURE PIGMENTS ========
    if (idx < purePigments) {
        mixedRGB = getPigment(idx);
        valid = 1.0;
    }
    // ======== 2-WAY SPECTRAL MIXES ========
    else if (idx < purePigments + twoWayMixes) {
        int twoIdx = idx - purePigments;
        int pairIdx = twoIdx / (steps - 1);
        int stepIdx = twoIdx - pairIdx * (steps - 1);

        int p = 0;
        int pi = 0;
        int pj = 1;
        for (int i = 0; i < 16; i++) {
            if (i >= n) break;
            for (int j = i + 1; j < 16; j++) {
                if (j >= n) break;
                if (p == pairIdx) {
                    pi = i;
                    pj = j;
                }
                p++;
            }
        }

        float ratio = float(stepIdx + 1) / float(steps);
        vec3 c1 = getPigment(pi);
        vec3 c2 = getPigment(pj);
        mixedRGB = spectralMix2(c1, c2, ratio, 1.0 - ratio);
        valid = 1.0;
    }
    // ======== 3-WAY SPECTRAL MIXES ========
    else if (idx < totalMixes) {
        int threeIdx = idx - purePigments - twoWayMixes;
        int tripleIdx = threeIdx / threeWayStepsPerTriple;
        int stepIdx = threeIdx - tripleIdx * threeWayStepsPerTriple;

        int t = 0;
        int ti = 0;
        int tj = 1;
        int tk = 2;
        for (int i = 0; i < 16; i++) {
            if (i >= n) break;
            for (int j = i + 1; j < 16; j++) {
                if (j >= n) break;
                for (int k = j + 1; k < 16; k++) {
                    if (k >= n) break;
                    if (t == tripleIdx) {
                        ti = i;
                        tj = j;
                        tk = k;
                    }
                    t++;
                }
            }
        }

        int s = 0;
        int s1 = 1;
        int s2 = 1;
        for (int a = 1; a < 20; a++) {
            if (a >= steps - 1) break;
            for (int b = 1; b < 20; b++) {
                if (b >= steps - a) break;
                if (s == stepIdx) {
                    s1 = a;
                    s2 = b;
                }
                s++;
            }
        }

        float r1 = float(s1) / float(steps);
        float r2 = float(s2) / float(steps);
        float r3 = 1.0 - r1 - r2;

        vec3 c1 = getPigment(ti);
        vec3 c2 = getPigment(tj);
        vec3 c3 = getPigment(tk);
        mixedRGB = spectralMix3(c1, c2, c3, r1, r2, r3);
        valid = 1.0;
    }

    // Convert to LAB
    vec3 lab = rgb2lab(mixedRGB);

    // Normalize LAB to 0-1
    float normL = lab.x / 100.0;
    float normA = (lab.y + 128.0) / 255.0;
    float normB = (lab.z + 128.0) / 255.0;

    normL = clamp(normL, 0.0, 1.0);
    normA = clamp(normA, 0.0, 1.0);
    normB = clamp(normB, 0.0, 1.0);

    // Output: LAB position (a*→R, L*→G, b*→B)
    labPos = vec4(normA * valid, normL * valid, normB * valid, valid);

    // Output: RGB color
    rgbCol = vec4(mixedRGB * valid, valid);
}
