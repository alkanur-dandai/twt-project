// @/constants/mapStyles.ts
export const MAP_STYLES = {
  default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
} as const;

export type StyleKey = keyof typeof MAP_STYLES;