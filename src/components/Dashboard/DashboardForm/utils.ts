import type { ThemeJson } from "@apptypes/organisation";

/**
 * Compares two arrays of numbers and returns true if they contain the same elements, regardless of order.
 * @param left - The first array of numbers to compare.
 * @param right - The second array of numbers to compare.
 * @returns A boolean indicating whether the two arrays contain the same elements.
 */
export const sameIds = (left: number[], right: number[]) => {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort((a, b) => a - b);
  const sortedRight = [...right].sort((a, b) => a - b);
  return sortedLeft.every((id, index) => id === sortedRight[index]);
};

export const getThemeColor = (theme: ThemeJson, mode: "light" | "dark", colorType: "primary" | "secondary") => {
  return theme?.[mode]?.palette?.[colorType]?.main ?? "";
};

export const buildThemeJson = (colors: Record<string, string>): string => {
  const newTheme: ThemeJson = {
    dark: colors.darkPrimaryColor || colors.darkSecondaryColor ? {
      palette: {
        primary: colors.darkPrimaryColor ? { main: colors.darkPrimaryColor } : undefined,
        secondary: colors.darkSecondaryColor ? { main: colors.darkSecondaryColor } : undefined,
      },
    } : {},
     light: colors.lightPrimaryColor || colors.lightSecondaryColor ? {
      palette: {
        primary: colors.lightPrimaryColor ? { main: colors.lightPrimaryColor } : undefined,
        secondary: colors.lightSecondaryColor ? { main: colors.lightSecondaryColor } : undefined,
      },
    } : {},
    default: colors.defaultTheme || 'light',
  };

  return JSON.stringify(newTheme);
};