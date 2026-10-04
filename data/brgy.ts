
//   languyanGeoJson as unknown as FeatureCollection;
import type { FeatureCollection } from "geojson";

import barangaysData from "./Bongao1.json";
import panglimasugalaData from "./panglimasugala.json";
import languyanGeoJson from "./Languyan.json";
import tandubasGeoJson from "./tandubas.json";
import sapaSapaGeoJson from "./sapa-sapa.json";
import southubianGeoJson from "./southubian.json";
import simunulGeoJson from "./simunul.json";
import sitangkaiGeoJson from "./sitangkai.json";
import sibutuGeojson from "./sibutu.json"
import mapunGeoJson from "./mapun.json";
import TurtleGeojson from "./turtle island.json";
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

export const Southubian =
  southubianGeoJson as unknown as FeatureCollection;

export const simunul =
  simunulGeoJson as unknown as FeatureCollection;

export const sitangkai = 
  sitangkaiGeoJson as unknown as FeatureCollection;

export const sibutu =
  sibutuGeojson as unknown as FeatureCollection;

export const mapun =
  mapunGeoJson as unknown as FeatureCollection;

export const turtle =
  TurtleGeojson as unknown as FeatureCollection;