import { darkColors, lightColors } from './colors';
import { typography } from './typography';
import { spacing, radius } from './spacing';

export function buildTheme(isDark: boolean) {
  return {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    radius,
    isDark,
  };
}

export type Theme = ReturnType<typeof buildTheme>;