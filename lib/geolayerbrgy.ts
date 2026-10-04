import { barangays, panglimasugala, Languyan, Tandubas, SapaSapa, Southubian, simunul, sitangkai, sibutu, mapun,  turtle } from "@/data/brgy";

export const geoJsonLayers = [
  barangays,
  panglimasugala,
  Languyan,
  Tandubas,
  SapaSapa,
  Southubian,
  simunul,
  sitangkai,
  sibutu,
  mapun,
  turtle
];

export const allFeatures = geoJsonLayers.flatMap(
  (layer) => layer.features
);