// components/map/MapControlsOverlay.tsx
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { MAP_STYLES, type StyleKey } from "@/lib/baseMap";

interface MapControlsOverlayProps {
  style: StyleKey;
  setStyle: (style: StyleKey) => void;
  showPopulation: boolean;
  setShowPopulation: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMunicipality: string | null;
  setSelectedMunicipality: (municipality: string | null) => void;
  municipalities: string[];
}

export function MapControlsOverlay({
  style,
  setStyle,
  showPopulation,
  setShowPopulation,
  selectedMunicipality,
  setSelectedMunicipality,
  municipalities,
}: MapControlsOverlayProps) {
  return (
    <div className="absolute right-2 top-16 z-50 flex flex-col gap-2 sm:right-4 sm:top-4">
      {/* Style Selector */}
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value as StyleKey)}
        className="rounded-md border bg-background px-3 py-2 text-xs shadow-lg outline-none sm:text-sm"
      >
        <option value="default">Default (Carto)</option>
        <option value="openstreetmap">OpenStreetMap</option>
        <option value="openstreetmap3d">OpenStreetMap 3D</option>
      </select>

      {/* Population Toggle */}
      <Button
        type="button"
        variant={showPopulation ? "default" : "secondary"}
        className="h-9 gap-2 text-xs shadow-lg sm:h-10 sm:text-sm"
        onClick={() => setShowPopulation((prev) => !prev)}
      >
        <Users className="size-4" />
        {showPopulation ? "Hide Population" : "Population"}
      </Button>

      {/* Municipality Selector */}
      <select
        value={selectedMunicipality ?? ""}
        onChange={(e) => setSelectedMunicipality(e.target.value || null)}
        className="rounded-md border bg-background px-3 py-2 text-xs shadow-lg outline-none sm:text-sm"
      >
        <option value="">Select Municipality</option>
        {municipalities.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}