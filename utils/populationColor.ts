

export function getPopulationColor(population: string | number) {
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
