// components/map/PopulationLegend.tsx
const LEGEND_ITEMS = [
  { label: "Very High — 10,000+", color: "#dc2626" },
  { label: "High — 5,000–9,999", color: "#f97316" },
  { label: "Medium — 2,000–4,999", color: "#eab308" },
  { label: "Low — below 2,000", color: "#22c55e" },
];

export function PopulationLegend() {
  return (
    <div className="absolute bottom-20 right-2 z-50 max-w-[calc(100vw-1rem)] rounded-lg border bg-background/95 p-3 shadow-xl backdrop-blur sm:bottom-6 sm:right-4 sm:p-4">
      <p className="mb-2 text-xs font-semibold sm:mb-3 sm:text-sm">Population</p>
      <div className="space-y-1.5 text-[11px] sm:space-y-2 sm:text-xs">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}