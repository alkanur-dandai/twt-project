"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Map,
  MapControls,
  MapGeoJSON,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  type MapRef,
} from "@/components/ui/map";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search, X, Users } from "lucide-react";

import { barangays } from "@/data/brgy";
import barangayData from "@/data/brgyData.json";


// =====================================================
// MAP STYLES
// =====================================================

const styles = {
  default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

type StyleKey = keyof typeof styles;


// =====================================================
// POPULATION COLOR
// =====================================================

function getPopulationColor(population: string | number) {
  const value = Number(
    String(population).replace(/,/g, "")
  );

  if (value >= 10000) {
    return "#dc2626"; // Very High
  }

  if (value >= 5000) {
    return "#f97316"; // High
  }

  if (value >= 2000) {
    return "#eab308"; // Medium
  }

  return "#22c55e"; // Low
}


// =====================================================
// MAIN MAP
// =====================================================

export default function MapPage() {
  const mapRef = useRef<MapRef>(null);


  // ===================================================
  // STATES
  // ===================================================

  const [style, setStyle] =
    useState<StyleKey>("default");

  const [search, setSearch] =
    useState("");

  const [hoveredName, setHoveredName] =
    useState<string | null>(null);

  const [selectedName, setSelectedName] =
    useState<string | null>(null);

  const [showPopulation, setShowPopulation] =
    useState(false);


  // ===================================================
  // STYLE
  // ===================================================

  const selectedStyle = styles[style];

  const is3D =
    style === "openstreetmap3d";


  // ===================================================
  // CHANGE MAP PITCH
  // ===================================================

  useEffect(() => {
    mapRef.current?.easeTo({
      pitch: is3D ? 60 : 0,
      duration: 500,
    });
  }, [is3D]);


  // ===================================================
  // GET BARANGAY POPULATION
  // ===================================================

  const getBarangayPopulation = (
    name: string
  ) => {
    const data = barangayData.find(
      (item) =>
        String(item.Barangays).toLowerCase() ===
        name.toLowerCase()
    );

    return data?.Population ?? "0";
  };


  // ===================================================
  // SEARCH RESULTS
  // ===================================================

  const searchResults = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return barangays.features
      .filter((feature) => {
        const name =
          feature.properties?.adm4_en;

        return (
          typeof name === "string" &&
          name.toLowerCase().includes(value)
        );
      })
      .slice(0, 8);

  }, [search]);


  // ===================================================
  // HOVERED FEATURE
  // ===================================================

  const hoveredFeature = useMemo(() => {

    if (!hoveredName) {
      return null;
    }

    return (
      barangays.features.find(
        (feature) =>
          feature.properties?.adm4_en ===
          hoveredName
      ) ?? null
    );

  }, [hoveredName]);


  // ===================================================
  // SELECTED FEATURE
  // ===================================================

  const selectedFeature = useMemo(() => {

    if (!selectedName) {
      return null;
    }

    return (
      barangays.features.find(
        (feature) =>
          feature.properties?.adm4_en ===
          selectedName
      ) ?? null
    );

  }, [selectedName]);


  // ===================================================
  // HOVER
  // ===================================================

  const handleBarangayHover = (
    event: any
  ) => {

    const name =
      event?.feature?.properties?.adm4_en ??
      null;

    setHoveredName(name);
  };


  // ===================================================
  // SELECT BARANGAY FROM SEARCH
  // ===================================================

  const selectBarangay = (
    feature: any
  ) => {

    const name =
      feature.properties?.adm4_en;

    if (!name) {
      return;
    }

    setSelectedName(name);
    setSearch(name);


    // -----------------------------------------------
    // GET GEOMETRY
    // -----------------------------------------------

    const coordinates =
      feature.geometry?.coordinates;

    if (!coordinates) {
      return;
    }


    // -----------------------------------------------
    // CREATE BOUNDS
    // -----------------------------------------------

    const bounds: [
      number,
      number,
      number,
      number
    ] = [
      Infinity,
      Infinity,
      -Infinity,
      -Infinity,
    ];


    // -----------------------------------------------
    // PROCESS COORDINATES
    // -----------------------------------------------

    const processCoordinates = (
      coords: any
    ): void => {

      if (
        Array.isArray(coords) &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number"
      ) {

        bounds[0] = Math.min(
          bounds[0],
          coords[0]
        );

        bounds[1] = Math.min(
          bounds[1],
          coords[1]
        );

        bounds[2] = Math.max(
          bounds[2],
          coords[0]
        );

        bounds[3] = Math.max(
          bounds[3],
          coords[1]
        );

        return;
      }


      if (Array.isArray(coords)) {
        coords.forEach(
          processCoordinates
        );
      }

    };


    processCoordinates(
      coordinates
    );


    // -----------------------------------------------
    // FIT MAP
    // -----------------------------------------------

    if (
      Number.isFinite(bounds[0]) &&
      Number.isFinite(bounds[1]) &&
      Number.isFinite(bounds[2]) &&
      Number.isFinite(bounds[3])
    ) {

      mapRef.current?.fitBounds(
        [
          [
            bounds[0],
            bounds[1],
          ],
          [
            bounds[2],
            bounds[3],
          ],
        ],
        {
          padding: 80,
          duration: 1000,
          maxZoom: 14,
        }
      );

    }

  };


  // ===================================================
  // CLEAR SEARCH
  // ===================================================

  const clearSearch = () => {

    setSearch("");
    setSelectedName(null);

  };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <main className="relative h-screen w-full overflow-hidden">

      <Map
        ref={mapRef}
        center={[
          119.7657797,
          5.0245908,
        ]}
        zoom={11}
        styles={
          selectedStyle
            ? {
                light: selectedStyle,
                dark: selectedStyle,
              }
            : undefined
        }
      >


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="absolute left-4 top-4 z-50 w-[320px] sm:w-[380px]">

          <div className="relative">

            <Search
              className="
                absolute
                left-3
                top-1/2
                size-5
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                if (!e.target.value) {
                  setSelectedName(null);
                }

              }}
              placeholder="Search barangay..."
              className="
                h-12
                bg-background
                pl-10
                pr-10
                text-base
                shadow-lg
              "
            />


            {search && (

              <button
                type="button"
                onClick={clearSearch}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  rounded-md
                  p-1
                  text-muted-foreground
                  hover:bg-muted
                "
              >

                <X className="size-5" />

              </button>

            )}

          </div>


          {/* ===============================================
              SEARCH RESULTS
          =============================================== */}

          {searchResults.length > 0 && (

            <div
              className="
                mt-2
                overflow-hidden
                rounded-lg
                border
                bg-background
                shadow-xl
              "
            >

              {searchResults.map(
                (feature: any) => {

                  const name =
                    feature.properties?.adm4_en;

                  if (!name) {
                    return null;
                  }

                  const population =
                    getBarangayPopulation(
                      name
                    );


                  return (

                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        selectBarangay(
                          feature
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        px-4
                        py-3
                        text-left
                        text-sm
                        hover:bg-muted
                      "
                    >

                      <span className="font-medium">
                        {name}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {population}
                      </span>

                    </button>

                  );

                }
              )}

            </div>

          )}

        </div>


        {/* =================================================
            MAP STYLE
        ================================================= */}

        <div className="absolute right-4 top-4 z-50">

          <select
            value={style}
            onChange={(e) =>
              setStyle(
                e.target.value as StyleKey
              )
            }
            className="
              rounded-md
              border
              bg-background
              px-3
              py-2
              text-sm
              text-foreground
              shadow-lg
              outline-none
            "
          >

            <option value="default">
              Default (Carto)
            </option>

            <option value="openstreetmap">
              OpenStreetMap
            </option>

            <option value="openstreetmap3d">
              OpenStreetMap 3D
            </option>

          </select>

        </div>


        {/* =================================================
            POPULATION BUTTON
        ================================================= */}

        <div className="absolute right-4 top-16 z-50">

          <Button
            type="button"
            variant={
              showPopulation
                ? "default"
                : "secondary"
            }
            className="
          
              h-10
              gap-2
              shadow-lg
            "
            onClick={() =>
              setShowPopulation(
                (value) => !value
              )
            }
          >

            <Users className="size-4" />

            {showPopulation
              ? "Hide Population"
              : "Population"}

          </Button>

        </div>


        {/* =================================================
            BARANGAY POLYGONS
        ================================================= */}

        {barangays.features.map(
          (feature: any) => {

            const name =
              feature.properties?.adm4_en;

            if (!name) {
              return null;
            }


            const population =
              getBarangayPopulation(
                name
              );


            const color =
              getPopulationColor(
                population
              );


            return (

              <MapGeoJSON
                key={name}
                data={{
                  type: "FeatureCollection",
                  features: [feature],
                }}
                interactive={true}
                onHover={
                  handleBarangayHover
                }
                fillPaint={{

                  "fill-color":
                    showPopulation
                      ? color
                      : "#ffffff",

                  "fill-opacity":
                    showPopulation
                      ? 0.45
                      : 0.05,

                }}
                linePaint={{
                  "line-color":
                    "#ffffff",

                  "line-width":
                    1,
                }}
              />

            );

          }
        )}


        {/* =================================================
            HOVER HIGHLIGHT
        ================================================= */}

        {hoveredFeature && (

          <MapGeoJSON
            data={{
              type: "FeatureCollection",
              features: [
                hoveredFeature,
              ],
            }}
            interactive={false}
            fillPaint={{

              "fill-color":
                "#ffffff",

              "fill-opacity":
                0.25,

            }}
            linePaint={{

              "line-color":
                "#16a34a",

              "line-width":
                3,

            }}
          />

        )}


        {/* =================================================
            SELECTED BARANGAY
        ================================================= */}

        {selectedFeature && (

          <MapGeoJSON
            data={{
              type: "FeatureCollection",
              features: [
                selectedFeature,
              ],
            }}
            interactive={false}
            fillPaint={{

              "fill-color":
                "#f32a14",

              "fill-opacity":
                0.5,

            }}
            linePaint={{

              "line-color":
                "#0c0000",

              "line-width":
                2,

            }}
          />

        )}


        {/* =================================================
            HOVER INFORMATION CARD
        ================================================= */}

        {hoveredFeature && (

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-20
              z-[100]
              -translate-x-1/2
            "
          >

            <div
              className="
                rounded-xl
                border
                bg-background
                px-5
                py-4
                shadow-xl
              "
            >

              <p
                className="
                  text-lg
                  font-semibold
                  text-green-600
                "
              >
                {
                  hoveredFeature
                    .properties
                    ?.adm4_en
                }
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Population:{" "}

                {
                  getBarangayPopulation(
                    hoveredFeature
                      .properties
                      ?.adm4_en
                  )
                }

              </p>

            </div>

          </div>

        )}


        {/* =================================================
            POPULATION LEGEND
        ================================================= */}

        {showPopulation && (

          <div
            className="
              absolute
              bottom-6
              right-4
              z-50
              rounded-lg
              border
              bg-background/95
              p-4
              shadow-xl
              backdrop-blur
            "
          >

            <p
              className="
                mb-3
                text-sm
                font-semibold
              "
            >
              Population
            </p>


            <div
              className="
                space-y-2
                text-xs
              "
            >

              {/* VERY HIGH */}

              <div className="flex items-center gap-2">

                <span
                  className="size-3 rounded-sm"
                  style={{
                    backgroundColor:
                      "#dc2626",
                  }}
                />

                <span>
                  Very High — 10,000+
                </span>

              </div>


              {/* HIGH */}

              <div className="flex items-center gap-2">

                <span
                  className="size-3 rounded-sm"
                  style={{
                    backgroundColor:
                      "#f97316",
                  }}
                />

                <span>
                  High — 5,000–9,999
                </span>

              </div>


              {/* MEDIUM */}

              <div className="flex items-center gap-2">

                <span
                  className="size-3 rounded-sm"
                  style={{
                    backgroundColor:
                      "#eab308",
                  }}
                />

                <span>
                  Medium — 2,000–4,999
                </span>

              </div>


              {/* LOW */}

              <div className="flex items-center gap-2">

                <span
                  className="size-3 rounded-sm"
                  style={{
                    backgroundColor:
                      "#22c55e",
                  }}
                />

                <span>
                  Low — below 2,000
                </span>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            BARANGAY MARKERS
        ================================================= */}

        {barangayData.map(
          (location: any) => {

            const lat =
              Number(location.lat);

            const lng =
              Number(location.lng);


            if (
              !Number.isFinite(lat) ||
              !Number.isFinite(lng)
            ) {

              console.warn(
                `Invalid coordinates for ${location.Barangays}`,
                location
              );

              return null;
            }


            return (

              <MapMarker
                key={
                  location.Barangays
                }
                longitude={lng}
                latitude={lat}
              >

                <MarkerContent>

                  <div
                    className="
                      size-4
                      rounded-full
                      border-2
                      border-white
                      bg-blue-500
                      shadow-lg
                    "
                  />

                </MarkerContent>


                <MarkerTooltip>

                  {location.Barangays}

                </MarkerTooltip>


                <MarkerPopup>

                  <div
                    className="
                      space-y-2
                    "
                  >

                    <p className="font-medium">
                      {location.Barangays}
                    </p>


                    <p className="text-sm">
                      Population:{" "}
                      {location.Population}
                    </p>


                    <p className="text-sm">
                      Type:{" "}
                      {location["type"]}
                    </p>


                    <p className="text-sm">
                      Total voters:{" "}
                      {
                        location[
                          "Total voters"
                        ]
                      }
                    </p>

                  </div>

                </MarkerPopup>

              </MapMarker>

            );

          }
        )}


        {/* =================================================
            MAP CONTROLS
        ================================================= */}

        <MapControls />

      </Map>

    </main>

  );
}