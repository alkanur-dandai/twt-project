export type Bounds = [
  [number, number],
  [number, number]
];

export function getFeatureBounds(feature: any): Bounds | null {
  const coordinates = feature.geometry?.coordinates;

  if (!coordinates) {
    return null;
  }

  const bounds: [number, number, number, number] = [
    Infinity,
    Infinity,
    -Infinity,
    -Infinity,
  ];

  const processCoordinates = (coords: any): void => {
    if (
      Array.isArray(coords) &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      bounds[0] = Math.min(bounds[0], coords[0]);
      bounds[1] = Math.min(bounds[1], coords[1]);
      bounds[2] = Math.max(bounds[2], coords[0]);
      bounds[3] = Math.max(bounds[3], coords[1]);

      return;
    }

    if (Array.isArray(coords)) {
      coords.forEach(processCoordinates);
    }
  };

  processCoordinates(coordinates);

  if (
    !Number.isFinite(bounds[0]) ||
    !Number.isFinite(bounds[1]) ||
    !Number.isFinite(bounds[2]) ||
    !Number.isFinite(bounds[3])
  ) {
    return null;
  }

  return [
    [bounds[0], bounds[1]],
    [bounds[2], bounds[3]],
  ];
}