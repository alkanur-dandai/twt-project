

import type { FeatureCollection } from "geojson";

import barangaysData from "./Bongao1.json";
import panglimasugalaData from "./panglimasugala.json";

export const barangays =
  barangaysData as unknown as FeatureCollection;

export const panglimasugala = 
  panglimasugalaData as unknown as FeatureCollection;