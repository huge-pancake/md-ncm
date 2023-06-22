import {
  MaterialDynamicColors,
  argbFromHex,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  DynamicColor,
  DynamicScheme,
  SchemeFidelity,
  SchemeVibrant,
  SchemeExpressive,
  SchemeNeutral,
  SchemeMonochrome,
  SchemeContent,
  Scheme as MatScheme,
  CorePalette,
} from '@material/material-color-utilities';
import type { Scheme } from '../components/theme-picker.js';

const materialColors = {
  background: MaterialDynamicColors.background,
  'on-background': MaterialDynamicColors.onBackground,
  surface: MaterialDynamicColors.surface,
  'surface-dim': MaterialDynamicColors.surfaceDim,
  'surface-bright': MaterialDynamicColors.surfaceBright,
  'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
  'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
  'surface-container': MaterialDynamicColors.surfaceContainer,
  'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
  'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,
  'on-surface': MaterialDynamicColors.onSurface,
  'surface-variant': MaterialDynamicColors.surfaceVariant,
  'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
  'inverse-surface': MaterialDynamicColors.inverseSurface,
  'inverse-on-surface': MaterialDynamicColors.inverseOnSurface,
  outline: MaterialDynamicColors.outline,
  'outline-variant': MaterialDynamicColors.outlineVariant,
  shadow: MaterialDynamicColors.shadow,
  scrim: MaterialDynamicColors.scrim,
  'surface-tint': MaterialDynamicColors.surfaceTintColor,
  primary: MaterialDynamicColors.primary,
  'on-primary': MaterialDynamicColors.onPrimary,
  'primary-container': MaterialDynamicColors.primaryContainer,
  'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
  'inverse-primary': MaterialDynamicColors.inversePrimary,
  'inverse-on-primary': MaterialDynamicColors.inverseOnPrimary,
  secondary: MaterialDynamicColors.secondary,
  'on-secondary': MaterialDynamicColors.onSecondary,
  'secondary-container': MaterialDynamicColors.secondaryContainer,
  'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
  tertiary: MaterialDynamicColors.tertiary,
  'on-tertiary': MaterialDynamicColors.onTertiary,
  'tertiary-container': MaterialDynamicColors.tertiaryContainer,
  'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
  error: MaterialDynamicColors.error,
  'on-error': MaterialDynamicColors.onError,
  'error-container': MaterialDynamicColors.errorContainer,
  'on-error-container': MaterialDynamicColors.onErrorContainer,
};

/**
 * Convert a hex value to a hct truple
 */
export function hctFromHex(value: string) {
  const hct = Hct.fromInt(argbFromHex(value));
  return hct;
}

/**
 * Convert a hct truple to a hex value
 */
export function hexFromHct(hue: number, chroma: number, tone: number) {
  const hct = Hct.from(hue, chroma, tone);
  const value = hct.toInt();
  return hexFromArgb(value);
}

export function themeFromSourceColor(
  color:
    | string
    | { primary: string; secondary: string; tertiary: string; neutral: string },
  isDark: boolean,
  scheme: Scheme,
  contrast: number
) {
  if (
    (typeof color !== 'string' && scheme !== 'dynamic') ||
    (typeof color !== 'object' && scheme === 'dynamic')
  ) {
    throw new Error('color / scheme type mismatch');
    return;
  }
  /* import and use other schemas from m-c-u for the scheme you want, but this is the "default"
     https://github.com/material-foundation/material-color-utilities/tree/main/typescript/scheme
   */
  let colorScheme: MatScheme;
  if (scheme === 'tonal') {
    colorScheme = new SchemeTonalSpot(
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'fidelity') {
    colorScheme = new SchemeFidelity(
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'vibrant') {
    colorScheme = new SchemeVibrant(
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'expressive') {
    colorScheme = new SchemeExpressive(
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'content') {
    colorScheme = new SchemeContent(
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'neutral') {
    colorScheme = new SchemeNeutral(
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'monochrome') {
    colorScheme = new SchemeMonochrome(
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'dynamic' && typeof color === 'object') {
    const primary = argbFromHex(color.primary);
    const palette = CorePalette.of(primary);

    if (color.secondary !== '#000000') {
      const secondary = argbFromHex(color.secondary);
      const secondaryPalette = CorePalette.of(secondary);
      palette.a2 = secondaryPalette.a1;
    }

    if (color.tertiary !== '#000000') {
      const tertiary = argbFromHex(color.tertiary);
      const tertiaryPalette = CorePalette.of(tertiary);
      palette.a3 = tertiaryPalette.a1;
    }

    if (color.neutral !== '#000000') {
      const neutral = argbFromHex(color.neutral);
      const neutralPalette = CorePalette.of(neutral);
      palette.n1 = neutralPalette.n1;
    }

    colorScheme = new DynamicScheme({
      sourceColorArgb: argbFromHex(color.primary),
      variant: 5, // Variant.FIDELITY https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/variant.ts
      contrastLevel: contrast,
      isDark,
      primaryPalette: palette.a1,
      secondaryPalette: palette.a2,
      tertiaryPalette: palette.a3,
      neutralPalette: palette.n1,
      neutralVariantPalette: palette.n2,
    });
  }

  return themeFromScheme(colorScheme);
}

export function themeFromScheme(colorScheme: MatScheme) {
  const theme: { [key: string]: string } = {};

  for (const [key, value] of Object.entries(materialColors)) {
    theme[key] = hexFromArgb(value.getArgb(colorScheme));
  }

  return theme;
}

export function applyTheme(
  doc: DocumentOrShadowRoot,
  theme: { [name: string]: string },
  ssName = 'material-theme'
) {
  let styleString = ':root{';
  for (const [key, value] of Object.entries(theme)) {
    styleString += `--md-sys-color-${key}:${value};`;
  }
  styleString += '}';

  applyThemeString(doc, styleString, ssName);
}

export function applyThemeString(
  doc: DocumentOrShadowRoot,
  themeString: string,
  ssName: string
) {
  let ss = window[ssName] as CSSStyleSheet | undefined;

  if (!ss) {
    ss = new CSSStyleSheet();
    doc.adoptedStyleSheets.push(ss);
    window[ssName] = ss;
  }

  ss.replace(themeString);
}
