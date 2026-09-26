



"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Map, MapControls, MapGeoJSON, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip, type MapRef } from "@/components/ui/map";
import { DateTimeDisplay } from "@/components/ui/date";

import { barangays, panglimasugala } from "@/data/brgy";
import barangayData from "@/data/brgyData.json";
import { getBarangayPopulation } from "@/utils/getBarangayPop";
import { getPopulationColor } from "@/utils/populationColor";
import { getFeatureBounds } from "@/utils/geoUtils";
import { extractMunicipalities } from "@/utils/mapUtils";
import { MAP_STYLES, type StyleKey } from "@/lib/baseMap";

import { BarangaySearch } from "@/components/mapUI/BarangaySearch";
import { MapControlsOverlay } from "@/components/mapUI/MapControlsOverlay";
import { PopulationLegend } from "@/components/mapUI/PopulationLegend";
import { municipalityColors } from "@/lib/municipalityColors";

import { geoJsonLayers, allFeatures } from "@/lib/geolayerbrgy";



export default function MapPage() {
  const mapRef = useRef<MapRef>(null);
  const [style, setStyle] = useState<StyleKey>("default");
  const [search, setSearch] = useState("");
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [showPopulation, setShowPopulation] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);

  const selectedStyle = MAP_STYLES[style];
  const is3D = style === "openstreetmap3d";

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
  }, [is3D]);

  // const municipalities = useMemo(() => extractMunicipalities(barangays.features), []);
  const municipalities = [
    "Bongao",
    "Panglima Sugala",
  ];
  const searchResults = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return [];
    return barangays.features
      .filter((f) => typeof f.properties?.adm4_en === "string" && f.properties.adm4_en.toLowerCase().includes(value))
      .slice(0, 8);
  }, [search]);


const hoveredFeature = useMemo(() => {
  if (!hoveredName) return null;

  return (
    allFeatures.find(
      (feature) =>
        feature.properties?.adm4_en === hoveredName
    ) ?? null
  );
}, [hoveredName]);

  const selectedFeature = useMemo(
    () => (selectedName ? barangays.features.find((f) => f.properties?.adm4_en === selectedName) ?? null : null),
    [selectedName]
  );


  const municipalityFeature = useMemo(() => {
    if (!selectedMunicipality) return null;

    if (selectedMunicipality === "Bongao") {
      return barangays;
    }

    if (selectedMunicipality === "Panglima Sugala") {
      return panglimasugala;
    }

    return null;
  }, [selectedMunicipality]);
  // const municipalityFeature = useMemo(() => {
  //   if (!selectedMunicipality) return null;
  //   const features = barangays.features.filter(
  //     (f: any) => f.properties?.municipality?.toLowerCase() === selectedMunicipality.toLowerCase()
  //   );
  //   return features.length ? ({ type: "FeatureCollection" as const, features } as const) : null;
  // }, [selectedMunicipality]);

  const selectBarangay = (feature: any) => {
    const name = feature.properties?.adm4_en;
    if (!name) return;
    setSelectedName(name);
    setSearch(name);

    const bounds = getFeatureBounds(feature);
    if (bounds) mapRef.current?.fitBounds(bounds, { padding: 80, duration: 1000, maxZoom: 14 });
  };

  const municipalityColor =
    municipalityColors[
    selectedMunicipality ?? "Bongao"
    ];

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Map
        ref={mapRef}
        center={[119.7657797, 5.0245908]}
        zoom={11}
        styles={selectedStyle ? { light: selectedStyle, dark: selectedStyle } : undefined}
      >
        <BarangaySearch
          search={search}
          setSearch={setSearch}
          searchResults={searchResults}
          onSelectBarangay={selectBarangay}
          onClear={() => {
            setSearch("");
            setSelectedName(null);
          }}
        />

        <MapControlsOverlay
          style={style}
          setStyle={setStyle}
          showPopulation={showPopulation}
          setShowPopulation={setShowPopulation}
          selectedMunicipality={selectedMunicipality}
          setSelectedMunicipality={setSelectedMunicipality}
          municipalities={municipalities}
        />

        {/* Polygons */}
      {geoJsonLayers.map((layer, layerIndex) =>
  layer.features.map((feature: any, featureIndex) => {
    const name = feature.properties?.adm4_en;

    if (!name) return null;

    // Population data exists only for Bongao
    const hasPopulationData = layer === barangays;

    const population = hasPopulationData
      ? getBarangayPopulation(name)
      : null;

    return (
      <MapGeoJSON
        key={`${layerIndex}-${featureIndex}`}
        data={{
          type: "FeatureCollection",
          features: [feature],
        }}
        interactive
        onHover={(e) => {
          setHoveredName(
            e?.feature?.properties?.adm4_en ?? null
          );
        }}
        fillPaint={{
          "fill-color":
            showPopulation && hasPopulationData
              ? getPopulationColor(population!)
              : "#fcfcfc00",

          "fill-opacity":
            showPopulation && hasPopulationData
              ? 0.45
              : 0.05,
        }}
        linePaint={{
          "line-color": "#f5eeee04",
          "line-width": 1,
        }}
      />
    );
  })
)}
        {/* Highlight Layers */}
        {/* Highlight Layers */}
        {hoveredFeature && (
          <MapGeoJSON
            data={{
              type: "FeatureCollection",
              features: [hoveredFeature],
            }}
            interactive={false}
            fillPaint={{
              "fill-color": "#ffffff",
              "fill-opacity": 0.25,
            }}
            linePaint={{
              "line-color": "#16a34a",
              "line-width": 3,
            }}
          />
        )}

        {/* Hover Name Card */}
        {hoveredFeature && (
          <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-4 py-2 shadow-lg">
            <p className="text-sm font-semibold text-gray-900">
              {hoveredFeature.properties?.adm4_en}
            </p>
          </div>
        )}

        {municipalityFeature && (
          <MapGeoJSON
            data={municipalityFeature}
            interactive={false}
            fillPaint={{
              "fill-color":
                municipalityColor.fill,

              "fill-opacity": 0.7,
            }}
            linePaint={{
              "line-color":
                municipalityColor.line,

              "line-width": 1,
            }}
          />
        )}

        {selectedFeature && (
          <MapGeoJSON
            data={{ type: "FeatureCollection", features: [selectedFeature] }}
            interactive={false}
            fillPaint={{ "fill-color": "#f32a14", "fill-opacity": 0.5 }}
            linePaint={{ "line-color": "#0c0000", "line-width": 2 }}
          />
        )}

        {/* Legends & Markers */}
        {showPopulation && <PopulationLegend />}

        <div className="absolute bottom-2 left-2 z-50 max-w-[calc(100vw-1rem)] sm:bottom-6 sm:left-4">
          <DateTimeDisplay />
        </div>

        {barangayData.map((location: any) => {
          const lat = Number(location.lat);
          const lng = Number(location.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

          return (
            <MapMarker key={location.Barangays} longitude={lng} latitude={lat}>
              <MarkerContent>
                <div className="size-3 rounded-full border-2 border-white bg-blue-500 shadow-lg sm:size-4" />
              </MarkerContent>
              <MarkerTooltip>{location.Barangays}</MarkerTooltip>
              <MarkerPopup>
                <div className="max-w-[260px] space-y-2 sm:max-w-none">
                  <p className="text-base font-semibold text-blue-500 sm:text-lg">{location.Barangays}</p>
                  <p className="text-sm">Population: {location.Population}</p>
                  <p className="text-sm">Type: {location.type}</p>
                  <p className="text-sm">Total voters: {location["Total voters"]}</p>
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}

        <MapControls />
      </Map>
    </main>
  );
}