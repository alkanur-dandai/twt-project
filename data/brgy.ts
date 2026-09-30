
//   languyanGeoJson as unknown as FeatureCollection;
import type { FeatureCollection } from "geojson";

import barangaysData from "./Bongao1.json";
import panglimasugalaData from "./panglimasugala.json";
import languyanGeoJson from "./Languyan.json";
import tandubasGeoJson from "./tandubas.json";
import sapaSapaGeoJson from "./sapa-sapa.json";
export const barangays =
  barangaysData as unknown as FeatureCollection;

export const panglimasugala =
  panglimasugalaData as unknown as FeatureCollection;

export const Languyan =
  languyanGeoJson as unknown as FeatureCollection;

export const Tandubas = 
  tandubasGeoJson as unknown as FeatureCollection;

export const SapaSapa = 
  sapaSapaGeoJson as unknown as FeatureCollection;