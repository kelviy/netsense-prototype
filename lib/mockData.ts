import seedrandom from "seedrandom";
import type {
  Sensor,
  MeshNode,
  Alert,
  Field,
  HistoryPoint,
  ActivityEvent,
} from "./types";

export const FARM = {
  name: "Cape Town Vineyard",
  location: "Franschhoek, Western Cape, South Africa",
  centre: [-33.89233, 18.987339] as [number, number],
  hectares: 458.8,
};

export const FIELDS: Field[] = [
  {
    id: "block-a",
    name: "Block A",
    block: "A",
    hectares: 120,
    polygon: [
      [-33.8694, 18.9661],
      [-33.8694, 18.9769],
      [-33.8802, 18.9769],
      [-33.8802, 18.9661],
    ],
  },
  {
    id: "block-b",
    name: "Block B",
    block: "B",
    hectares: 131.4,
    polygon: [
      [-33.879867, 19.00218],
      [-33.879867, 19.01348],
      [-33.891167, 19.01348],
      [-33.891167, 19.00218],
    ],
  },
  {
    id: "block-c",
    name: "Block C",
    block: "C",
    hectares: 83.3,
    polygon: [
      [-33.8908, 18.9826],
      [-33.8908, 18.9916],
      [-33.8998, 18.9916],
      [-33.8998, 18.9826],
    ],
  },
  {
    id: "block-d",
    name: "Block D",
    block: "D",
    hectares: 124.1,
    polygon: [
      [-33.872658, 18.988896],
      [-33.872658, 19.000496],
      [-33.883058, 19.000496],
      [-33.883058, 18.988896],
    ],
  },
];

export const NODES: MeshNode[] = [
  {
    id: "N-02",
    name: "Mesh Router 1",
    radios: ["lora_node"],
    lat: -33.874607,
    lng: 18.975107,
    status: "degraded",
    connectedSensors: 3,
    neighbours: ["N-05"],
    battery: 72,
    uptime: "31 days",
    signalStrength: 48,
    loraRangeKm: 0.55,
  },
  {
    id: "N-03",
    name: "Mesh Router 2",
    radios: ["halow_node"],
    lat: -33.882493,
    lng: 19.004087,
    status: "online",
    connectedSensors: 3,
    neighbours: ["N-05"],
    battery: 88,
    uptime: "47 days",
    signalStrength: 94,
    halowRangeKm: 1,
  },
  {
    id: "N-04",
    name: "Mesh Router 3",
    radios: ["lora_node"],
    lat: -33.8956,
    lng: 18.984639,
    status: "online",
    connectedSensors: 3,
    neighbours: ["N-05"],
    battery: 18,
    uptime: "44 days",
    signalStrength: 86,
    loraRangeKm: 5,
  },
  {
    id: "N-05",
    name: "Mesh Router 4",
    radios: ["lora_node", "halow_node"],
    lat: -33.878328,
    lng: 18.994796,
    status: "online",
    connectedSensors: 3,
    neighbours: ["N-02", "N-03"],
    battery: 81,
    uptime: "47 days",
    signalStrength: 91,
    loraRangeKm: 5,
    halowRangeKm: 1,
  },
];

export const SENSORS: Sensor[] = [
  // Block A — one critical (S-001), others OK
  { id: "S-001", name: "Sensor 1", type: "soil_moisture", block: "A",
    lat: -33.8711, lng: 18.9683, status: "warning", battery: 87, signalStrength: 76,
    lastReading: 18, unit: "%", routedVia: "S-002" },
  { id: "S-002", name: "Sensor 2", type: "soil_moisture", block: "A",
    lat: -33.8749, lng: 18.9719, status: "online", battery: 92, signalStrength: 81,
    lastReading: 27, unit: "%", routedVia: "N-02" },
  { id: "S-003", name: "Sensor 3", type: "temperature", block: "A",
    lat: -33.8786, lng: 18.9751, status: "online", battery: 78, signalStrength: 72,
    lastReading: 22, unit: "°C", routedVia: "N-02" },

  // Block B
  { id: "S-004", name: "Sensor 4", type: "soil_moisture", block: "B",
    lat: -33.881293, lng: 19.012687, status: "online", battery: 94, signalStrength: 88,
    lastReading: 29, unit: "%", routedVia: "N-03" },
  { id: "S-005", name: "Sensor 5", type: "humidity", block: "B",
    lat: -33.884593, lng: 19.009487, status: "online", battery: 83, signalStrength: 85,
    lastReading: 58, unit: "%", routedVia: "N-03" },
  { id: "S-006", name: "Sensor 6", type: "ph", block: "B",
    lat: -33.889393, lng: 19.011587, status: "online", battery: 69, signalStrength: 80,
    lastReading: 6.4, unit: "pH", routedVia: "N-03" },

  // Block C
  { id: "S-007", name: "Sensor 7", type: "soil_moisture", block: "C",
    lat: -33.8924, lng: 18.9837, status: "online", battery: 90, signalStrength: 82,
    lastReading: 26, unit: "%", routedVia: "N-04" },
  { id: "S-008", name: "Sensor 8", type: "soil_moisture", block: "C",
    lat: -33.8955, lng: 18.9874, status: "online", battery: 74, signalStrength: 54,
    lastReading: 28, unit: "%", routedVia: "N-04" },
  { id: "S-009", name: "Sensor 9", type: "temperature", block: "C",
    lat: -33.8983, lng: 18.9901, status: "online", battery: 88, signalStrength: 77,
    lastReading: 21, unit: "°C", routedVia: "N-04" },

  // Block D
  { id: "S-010", name: "Sensor 10", type: "soil_moisture", block: "D",
    lat: -33.874458, lng: 18.995996, status: "online", battery: 91, signalStrength: 86,
    lastReading: 31, unit: "%", routedVia: "N-05" },
  { id: "S-011", name: "Sensor 11", type: "humidity", block: "D",
    lat: -33.878028, lng: 18.997396, status: "online", battery: 77, signalStrength: 82,
    lastReading: 55, unit: "%", routedVia: "N-05" },
  { id: "S-012", name: "Sensor 12", type: "ph", block: "D",
    lat: -33.881158, lng: 18.992296, status: "online", battery: 85, signalStrength: 84,
    lastReading: 6.7, unit: "pH", routedVia: "N-05" },
];

export const ALERTS: Alert[] = [
  {
    id: "A-1",
    severity: "critical",
    title: "Soil moisture critical — Sensor 1",
    message:
      "Moisture dropped below 18%. Irrigation recommended within 6 hours to avoid yield loss.",
    sensorId: "S-001",
    timestamp: "14 min ago",
    estimatedImpact: "~R12,400 potential yield loss if untreated",
  },
  {
    id: "A-2",
    severity: "warning",
    title: "Battery low — Block C",
    message:
      "Node for Block C battery at 18%. Recharge within 9 days to avoid service interruption.",
    sensorId: "",
    timestamp: "2 hr ago",
    estimatedImpact: "Service risk: 3 sensors in Block C",
  },
  {
    id: "A-3",
    severity: "info",
    title: "Reroute active — Sensor 1",
    message:
      "Sensor 1 is routing through Sensor 2 because the Block A node is degraded. No farmer action required.",
    sensorId: "S-001",
    timestamp: "1 hr ago",
    estimatedImpact: "Network redundancy held — 0 data loss",
  },
];

export const ACTIVITY: ActivityEvent[] = [
  {
    id: "E-1",
    message: "Sensor 1 moisture dropped to 18% — irrigation recommended.",
    ago: "14 min ago",
    href: "/sensors/S-001",
    type: "alert",
  },
  {
    id: "E-2",
    message: "Sensor 1 routed via Sensor 2 (Block A node degraded).",
    ago: "1 hr ago",
    href: "/network",
    type: "reroute",
  },
  {
    id: "E-3",
    message: "Daily report ready.",
    ago: "3 hr ago",
    type: "report",
  },
  {
    id: "E-4",
    message: "Mesh sync complete — all sensors reporting.",
    ago: "6 hr ago",
    type: "sync",
  },
  {
    id: "E-5",
    message: "Block C node battery dropped below 20%.",
    ago: "8 hr ago",
    href: "/network",
    type: "alert",
  },
];

// ---- History generation (seeded, runs once at module load) -----------------
function generateHistory(
  sensorId: string,
  base: number,
  unit: string,
  trend: number,
  volatility: number
): HistoryPoint[] {
  const rng = seedrandom(sensorId);
  const points: HistoryPoint[] = [];
  const HOURS = 24 * 30;
  const now = new Date("2026-04-14T08:00:00Z").getTime();
  for (let i = HOURS; i >= 0; i--) {
    const t = new Date(now - i * 3600_000);
    const progress = (HOURS - i) / HOURS;
    const drift = trend * progress;
    const dayCycle = Math.sin((t.getUTCHours() / 24) * Math.PI * 2) * (unit === "°C" ? 3 : 2);
    const noise = (rng() - 0.5) * volatility;
    const v = base + drift + dayCycle + noise;
    points.push({ t: t.toISOString(), v: Math.round(v * 10) / 10 });
  }
  return points;
}

const HISTORY_MAP: Record<string, HistoryPoint[]> = {};
for (const s of SENSORS) {
  let base = 28, trend = 0, vol = 2;
  if (s.id === "S-001") { base = 30; trend = -13; vol = 1.4; }
  else if (s.type === "soil_moisture") { base = 28; trend = -1; vol = 2; }
  else if (s.type === "temperature") { base = 22; trend = -1; vol = 3; }
  else if (s.type === "humidity") { base = 58; trend = 0; vol = 6; }
  else if (s.type === "ph") { base = 6.5; trend = 0; vol = 0.3; }
  HISTORY_MAP[s.id] = generateHistory(s.id, base, s.unit, trend, vol);
}

export const HISTORY = HISTORY_MAP;

export function getSensor(id: string) {
  return SENSORS.find((s) => s.id === id);
}

export function getNode(id: string) {
  return NODES.find((n) => n.id === id);
}

export const KPI = {
  avgMoisture: 24,
  avgMoistureDelta: -2,
  avgTemp: 22,
  avgTempDelta: 1,
  sensorsOnline: 12,
  sensorsTotal: 12,
};

export const WEATHER = {
  temp: 22,
  summary: "Partly cloudy",
  forecast: "No rain forecast for 5 days",
};

export const RECOMMENDATIONS = [
  {
    id: "R-1",
    title: "Review Sensor 1 reroute",
    body:
      "Sensor 1 is currently routing through Sensor 2 to reach Mesh Router 1. Check antenna alignment between Sensor 1, Sensor 2, and Mesh Router 1 to restore the direct path.",
    severity: "warning" as const,
  },
  {
    id: "R-2",
    title: "Review Mesh Router 1 to Mesh Router 4 path",
    body:
      "The Sensor 1 to Sensor 2 reroute is keeping Mesh Router 1 connected through Mesh Router 4. Review placement and signal alignment to reduce dependency on the fallback path.",
    severity: "info" as const,
  },
  {
    id: "R-3",
    title: "Replace battery on Mesh Router 3",
    body:
      "Battery at 18%. Estimated 9 days remaining. Recharge to avoid service interruption across the 3 sensors served by Mesh Router 3.",
    severity: "warning" as const,
  },
  {
    id: "R-4",
    title: "Update Mesh Router 4 firmware",
    body:
      "Improves battery life by 15% and stabilises LoRa/HaLow handoff on Mesh Router 4.",
    severity: "info" as const,
  },
];
