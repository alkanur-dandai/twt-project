// components/map/BarangaySearch.tsx
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { getBarangayPopulation } from "@/utils/getBarangayPop";

interface BarangaySearchProps {
  search: string;
  setSearch: (value: string) => void;
  searchResults: any[];
  onSelectBarangay: (feature: any) => void;
  onClear: () => void;
}

export function BarangaySearch({
  search,
  setSearch,
  searchResults,
  onSelectBarangay,
  onClear,
}: BarangaySearchProps) {
  return (
    <div className="absolute left-2 right-2 top-2 z-50 w-auto sm:left-4 sm:right-auto sm:top-4 sm:w-[380px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search barangay..."
          className="h-11 bg-background pl-10 pr-10 text-base shadow-lg sm:h-12"
        />
        {search && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="mt-2 max-h-[50vh] overflow-y-auto rounded-lg border bg-background shadow-xl">
          {searchResults.map((feature: any) => {
            const name = feature.properties?.adm4_en;
            if (!name) return null;

            return (
              <button
                key={name}
                type="button"
                onClick={() => onSelectBarangay(feature)}
                className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-muted"
              >
                <span className="truncate font-medium">{name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {getBarangayPopulation(name)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}