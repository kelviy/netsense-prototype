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
  centre: [-33.8869, 18.9756] as [number, number],
  hectares: 120,
};

export const FIELDS: Field[] = [
  {
    id: "block-a",
    name: "Block A",
    block: "A",
    hectares: 28,
    polygon: [
      [-33.8825, 18.9705],
      [-33.8825, 18.9755],
      [-33.8869, 18.9755],
      [-33.8869, 18.9705],
    ],
  },
  {
    id: "block-b",
    name: "Block B",
    block: "B",
    hectares: 22,
    polygon: [
      [-33.8825, 18.9757],
      [-33.8825, 18.9807],
      [-33.8869, 18.9807],
      [-33.8869, 18.9757],
    ],
  },
  {
    id: "block-c",
    name: "Block C",
    block: "C",
    hectares: 35,
    polygon: [
      [-33.8871, 18.9705],
      [-33.8871, 18.9755],
      [-33.8915, 18.9755],
      [-33.8915, 18.9705],
    ],
  },
  {
    id: "block-d",
    name: "Block D",
    block: "D",
    hectares: 35,
    polygon: [
      [-33.8871, 18.9757],
      [-33.8871, 18.9807],
      [-33.8915, 18.9807],
      [-33.8915, 18.9757],
    ],
  },
];

export const NODES: MeshNode[] = [
  {
    id: "N-01",
    name: "Gateway — Farmhouse",
    type: "gateway",
    lat: -33.8869,
    lng: 18.9756,
    status: "online",
    connectedSensors: 0,
    neighbours: ["N-02", "N-03", "N-04", "N-05"],
    battery: 100,
    uptime: "47 days",
    signalStrength: 98,
    rangeKm: 5,
  },
  {
    id: "N-02",
    name: "Mesh Node — North-West",
    type: "lora_node",
    lat: -33.8840,
    lng: 18.9724,
    status: "degraded",
    connectedSensors: 3,
    neighbours: ["N-01", "N-03"],
    battery: 72,
    uptime: "31 days",
    signalStrength: 48,
    rangeKm: 0.55,
  },
  {
    id: "N-03",
    name: "Mesh Node — North-East",
    type: "halow_node",
    lat: -33.8840,
    lng: 18.9790,
    status: "online",
    connectedSensors: 3,
    neighbours: ["N-01", "N-02"],
    battery: 88,
    uptime: "47 days",
    signalStrength: 94,
    rangeKm: 1,
  },
  {
    id: "N-04",
    name: "Mesh Node — South-West",
    type: "lora_node",
    lat: -33.8898,
    lng: 18.9724,
    status: "online",
    connectedSensors: 3,
    neighbours: ["N-01", "N-05"],
    battery: 18,
    uptime: "44 days",
    signalStrength: 86,
    rangeKm: 5,
  },
  {
    id: "N-05",
    name: "Mesh Node — South-East",
    type: "halow_node",
    lat: -33.8898,
    lng: 18.9790,
    status: "online",
    connectedSensors: 3,
    neighbours: ["N-01", "N-04"],
    battery: 81,
    uptime: "47 days",
    signalStrength: 91,
    rangeKm: 1,
  },
];

export const SENSORS: Sensor[] = [
  // Block A — one critical (S-001), others OK
  { id: "S-001", name: "Block A — North", type: "soil_moisture", block: "A",
    lat: -33.8838, lng: 18.9720, status: "warning", battery: 87, signalStrength: 76,
    lastReading: 18, unit: "%", routedVia: "N-02" },
  { id: "S-002", name: "Block A — Mid", type: "soil_moisture", block: "A",
    lat: -33.8850, lng: 18.9735, status: "online", battery: 92, signalStrength: 81,
    lastReading: 27, unit: "%", routedVia: "N-02" },
  { id: "S-003", name: "Block A — South", type: "temperature", block: "A",
    lat: -33.8862, lng: 18.9738, status: "online", battery: 78, signalStrength: 72,
    lastReading: 22, unit: "°C", routedVia: "N-02" },

  // Block B
  { id: "S-004", name: "Block B — North", type: "soil_moisture", block: "B",
    lat: -33.8838, lng: 18.9775, status: "online", battery: 94, signalStrength: 88,
    lastReading: 29, unit: "%", routedVia: "N-03" },
  { id: "S-005", name: "Block B — Mid", type: "humidity", block: "B",
    lat: -33.8850, lng: 18.9782, status: "online", battery: 83, signalStrength: 85,
    lastReading: 58, unit: "%", routedVia: "N-03" },
  { id: "S-006", name: "Block B — South", type: "ph", block: "B",
    lat: -33.8862, lng: 18.9770, status: "online", battery: 69, signalStrength: 80,
    lastReading: 6.4, unit: "pH", routedVia: "N-03" },

  // Block C — S-008 reroutes via S-009 due to N-02 degradation
  { id: "S-007", name: "Block C — North", type: "soil_moisture", block: "C",
    lat: -33.8882, lng: 18.9720, status: "online", battery: 90, signalStrength: 82,
    lastReading: 26, unit: "%", routedVia: "N-04" },
  { id: "S-008", name: "Block C — Mid", type: "soil_moisture", block: "C",
    lat: -33.8878, lng: 18.9735, status: "online", battery: 74, signalStrength: 54,
    lastReading: 28, unit: "%", routedVia: "S-009" },
  { id: "S-009", name: "Block C — South", type: "temperature", block: "C",
    lat: -33.8895, lng: 18.9738, status: "online", battery: 88, signalStrength: 77,
    lastReading: 21, unit: "°C", routedVia: "N-04" },

  // Block D
  { id: "S-010", name: "Block D — North", type: "soil_moisture", block: "D",
    lat: -33.8882, lng: 18.9775, status: "online", battery: 91, signalStrength: 86,
    lastReading: 31, unit: "%", routedVia: "N-05" },
  { id: "S-011", name: "Block D — Mid", type: "humidity", block: "D",
    lat: -33.8893, lng: 18.9782, status: "online", battery: 77, signalStrength: 82,
    lastReading: 55, unit: "%", routedVia: "N-05" },
  { id: "S-012", name: "Block D — South", type: "ph", block: "D",
    lat: -33.8905, lng: 18.9770, status: "online", battery: 85, signalStrength: 84,
    lastReading: 6.7, unit: "pH", routedVia: "N-05" },
];

export const ALERTS: Alert[] = [
  {
    id: "A-1",
    severity: "critical",
    title: "Soil moisture critical — Block A North",
    message:
      "Moisture dropped below 18%. Irrigation recommended within 6 hours to avoid yield loss.",
    sensorId: "S-001",
    timestamp: "14 min ago",
    estimatedImpact: "~R12,400 potential yield loss if untreated",
  },
  {
    id: "A-2",
    severity: "warning",
    title: "Battery low — N-04",
    message:
      "Mesh node N-04 battery at 18%. Recharge within 9 days to avoid service interruption.",
    sensorId: "",
    timestamp: "2 hr ago",
    estimatedImpact: "Service risk: 3 Block C sensors",
  },
  {
    id: "A-3",
    severity: "info",
    title: "Self-healing event — S-008",
    message:
      "Sensor S-008 rerouted through S-009 because N-02 signal degraded. No farmer action required.",
    sensorId: "S-008",
    timestamp: "1 hr ago",
    estimatedImpact: "Network redundancy held — 0 data loss",
  },
];

export const ACTIVITY: ActivityEvent[] = [
  {
    id: "E-1",
    message: "Block A North moisture dropped to 18% — irrigation recommended.",
    ago: "14 min ago",
    href: "/sensors/S-001",
    type: "alert",
  },
  {
    id: "E-2",
    message: "Sensor S-008 routed via S-009 (N-02 degraded).",
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
    message: "N-04 battery dropped below 20%.",
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
    title: "Re-site relay near Block C",
    body:
      "Sensor S-008 is currently routing through S-009 instead of N-02 (degraded). Raise the antennas on S-008 and S-009, or add a relay node between them to restore direct mesh link.",
    severity: "warning" as const,
  },
  {
    id: "R-2",
    title: "Replace battery on N-04",
    body:
      "Battery at 18%. Estimated 9 days remaining. Recharge to avoid service interruption across 3 Block C sensors.",
    severity: "warning" as const,
  },
  {
    id: "R-3",
    title: "Upgrade gateway firmware to v2.4.1",
    body:
      "Improves battery life by 15% and adds support for new sensor types.",
    severity: "info" as const,
  },
];
