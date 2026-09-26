import { barangays, panglimasugala } from "@/data/brgy";

export const geoJsonLayers = [
  barangays,
  panglimasugala,
];

export const allFeatures = geoJsonLayers.flatMap(
  (layer) => layer.features
);