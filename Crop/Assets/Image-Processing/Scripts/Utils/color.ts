
/*
 * this file contains some color utilities that make working with lens studio's vec3/vec4 a bit nicer
 */

/**
 * Helper class to define a gradient in [LinearGradientBackground]
 */
export type ColorStop = {
  percent?: number
  color: vec4
}

// Parse the std color format "#RRGGBB" into a lensCore vec3
export function parseColor(str: string, alpha: number = 1.0): vec4 {
  if (str[0] === "#") {
    str = str.substr(1)
  }

  if (str.length !== 6) {
    throw new Error(`parseColor: can't parse string of length ${str.length} "${str}"`)
  }

  return new vec4(
    parseInt(str.substr(0, 2), 16) / 255,
    parseInt(str.substr(2, 2), 16) / 255,
    parseInt(str.substr(4, 2), 16) / 255,
    alpha
  )
}

// withAlpha is a simple utility for constructing a color value
// that is the same as the given color value, but with a new
// alpha value.
export function withAlpha(color: vec4 | vec3, alpha: number): vec4 {
  return new vec4(color.r, color.g, color.b, alpha)
}

// withAlpha is a simple utility for constructing a color value
// that is the same as the given color value, but without any
// alpha value.
export function withoutAlpha(color: vec4): vec3 {
  return new vec3(color.r, color.g, color.b)
}

// Known Colors
export const YELLOW = (alpha = 1) => parseColor("#FFFC00", alpha)
export const WHITE = (alpha = 1) => parseColor("#FFFFFF", alpha)
export const RED = (alpha = 1) => parseColor("#FF0000", alpha)
export const BLACK = (alpha = 1) => parseColor("#000000", alpha)
export const GRAY = (alpha = 1) => parseColor("#3A383A", alpha)
export const DARKGRAY = (alpha = 1) => parseColor("#202020", alpha)

/**
 * Defines all [ColorStop] for the default color theme in [LinearGradientBackground]
 */
export const DEFAULT_COLOR_STOPS: [ColorStop, ColorStop, ColorStop] = [
  {
    color: parseColor("#E92754"),
    percent: 4.42
  },
  {
    color: parseColor("#2B7391"),
    percent: 52.2
  },
  {
    color: parseColor("#FFFC00"),
    percent: 98.98
  }
]

/**
 * Defines all [ColorStop] for the critical color theme in [LinearGradientBackground]
 */
export const CRITICAL_COLOR_STOPS: [ColorStop, ColorStop, ColorStop] = [
  {
    color: parseColor("#541858"),
    percent: 25.98
  },
  {
    color: parseColor("#921633"),
    percent: 47.28
  },
  {
    color: parseColor("#FFFC0C"),
    percent: 106.17
  }
]

/**
 * This function converts a color from HSL to RGB. Reference: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
 * @param HSL {vec3} A color expressed as Hue (x [0, 360]), Saturation (y [0, 1]), and Lightness (z [0,1])
 * @returns {vec3} The same color expressed as Red (x [0, 1]), Green (y [0, 1]), and Blue (z [0, 1])
 */
export function HSLToRGB(HSL: vec3): vec3 {
  const vector = new vec3(HSL.x, HSL.y, HSL.z)
  HSLToRGBInPlace(vector)
  return vector
}

const ONE_OVER_60 = 0.01666666666
/**
 * This function converts a color from HSL to RGB. Reference: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
 * @param vector {vec3} A color expressed as Hue (x [0, 360]), Saturation (y [0, 1]), and Lightness (z [0,1])
 * This vector will be modified to express the same color as Red (x [0, 1]), Green (y [0, 1]), and Blue (z [0, 1])
 */
export function HSLToRGBInPlace(vector: vec3): void {
  const h = vector.x
  const s = vector.y
  const l = vector.z

  const c = (1 - Math.abs(2 * l - 1)) * s
  const ho = h * ONE_OVER_60
  const x = c * (1 - Math.abs((ho % 2) - 1))

  const matchLightness = l - c * 0.5

  if (ho < 1) {
    vector.x = c + matchLightness
    vector.y = x + matchLightness
    vector.z = matchLightness
  } else if (ho < 2) {
    vector.x = x + matchLightness
    vector.y = c + matchLightness
    vector.z = matchLightness
  } else if (ho < 3) {
    vector.x = matchLightness
    vector.y = c + matchLightness
    vector.z = x + matchLightness
  } else if (ho < 4) {
    vector.x = matchLightness
    vector.y = x + matchLightness
    vector.z = c + matchLightness
  } else if (ho < 5) {
    vector.x = x + matchLightness
    vector.y = matchLightness
    vector.z = c + matchLightness
  } else if (ho <= 6) {
    vector.x = c + matchLightness
    vector.y = matchLightness
    vector.z = x + matchLightness
  } else {
    throw "Could not determine HSL conversion"
  }
}

/**
 * This function converts a color from RGB to HSL. Reference: https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
 * @param RGB {vec3} A color expressed as Red (x [0, 1]), Green (y [0, 1]), and Blue (z [0, 1])
 * @returns {vec3} The same color expressed as Hue (x [0, 360]), Saturation (y [0, 1]), and Lightness (z [0,1])
 */
export function RGBToHSL(RGB: vec3): vec3 {
  const vector = new vec3(RGB.x, RGB.y, RGB.z)
  RGBToHSLInPlace(vector)
  return vector
}

/**
 * This function converts a color from RGB to HSL. Reference: https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
 * @param vector {vec3} A color expressed as Red (x [0, 1]), Green (y [0, 1]), and Blue (z [0, 1]).
 * This vector will be modified to express the same color as Hue (x [0, 360]), Saturation (y [0, 1]), and Lightness (z [0,1])
 */
export function RGBToHSLInPlace(vector: vec3): void {
  const rScaled = vector.x
  const gScaled = vector.y
  const bScaled = vector.z

  const xMax = Math.max(rScaled, gScaled, bScaled)
  const xMin = Math.min(rScaled, gScaled, bScaled)

  const c = xMax - xMin

  const l = (xMax + xMin) / 2

  let h = 0
  if (xMax === rScaled) {
    h = 60 * (((gScaled - bScaled) / c) % 6)
  } else if (xMax === gScaled) {
    h = 60 * ((bScaled - rScaled) / c + 2)
  } else if (xMax === bScaled) {
    h = 60 * ((rScaled - gScaled) / c + 4)
  }

  let s = 0
  if (l > 0 && l < 1) {
    s = (2 * (xMax - l)) / (1 - Math.abs(2 * l - 1))
  }

  vector.x = h
  vector.y = s
  vector.z = l
}
