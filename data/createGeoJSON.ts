

import type { Feature, FeatureCollection } from "geojson";

export function createGeoJSON(
  features: Feature[]
): FeatureCollection {
  return {
    type: "FeatureCollection",
    features,
  };
}