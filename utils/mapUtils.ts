// utils/mapUtils.ts
export function extractMunicipalities(features: any[]): string[] {
  const names = features
    .map((feature) => feature.properties?.municipality)
    .filter((name): name is string => typeof name === "string" && name.trim() !== "");

  return Array.from(new Set(names)).sort();
}