import { barangays, panglimasugala, Languyan, Tandubas, SapaSapa } from "@/data/brgy";

export const geoJsonLayers = [
  barangays,
  panglimasugala,
  Languyan,
  Tandubas,
  SapaSapa
];

export const allFeatures = geoJsonLayers.flatMap(
  (layer) => layer.features
);