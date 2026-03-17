export type StationConfig = {
  id: number;
  title: string;
  subtitle?: string;
  size: number;
  columns: number;
};

export const ELEVATOR_STATION_ID = "3";

export const STATION_CONFIGS: Record<string, StationConfig> = {
  "1": {
    id: 1,
    title: "SUBWAY 1",
    subtitle: "4-Cut Train Car",
    size: 4,
    columns: 2,
  },
  "2": {
    id: 2,
    title: "SUBWAY 2",
    subtitle: "Subway Doors",
    size: 6,
    columns: 3,
  },
  "3": {
    id: 3,
    title: "ELEVATOR",
    subtitle: "Vertical Strip",
    size: 4,
    columns: 1,
  },
  "4": {
    id: 4,
    title: "TRANSIT TERMINAL",
    subtitle: "Route Maps",
    size: 6,
    columns: 2,
  },
};

export function getEnabledStations(): StationConfig[] {
  return Object.values(STATION_CONFIGS);
}

export function getActiveStationConfig(
  stationId?: string | null,
): StationConfig {
  const normalizedId = stationId?.trim();
  return STATION_CONFIGS[normalizedId || "1"] || STATION_CONFIGS["1"];
}
