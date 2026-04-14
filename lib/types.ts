export type SensorType = "soil_moisture" | "temperature" | "humidity" | "ph";
export type SensorStatus = "online" | "offline" | "warning";
export type NodeRadio = "gateway" | "lora_node" | "halow_node";
export type NodeStatus = "online" | "degraded" | "offline";
export type AlertSeverity = "critical" | "warning" | "info";

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  block: "A" | "B" | "C" | "D";
  lat: number;
  lng: number;
  status: SensorStatus;
  battery: number;
  signalStrength: number;
  lastReading: number;
  unit: "%" | "°C" | "pH";
  routedVia: string;
}

export interface MeshNode {
  id: string;
  name: string;
  radios: NodeRadio[];
  lat: number;
  lng: number;
  status: NodeStatus;
  connectedSensors: number;
  neighbours: string[];
  battery: number;
  uptime: string;
  signalStrength: number;
  loraRangeKm?: number;
  halowRangeKm?: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  sensorId: string;
  timestamp: string;
  estimatedImpact: string;
}

export interface Field {
  id: string;
  name: string;
  block: "A" | "B" | "C" | "D";
  hectares: number;
  polygon: [number, number][];
}

export interface HistoryPoint {
  t: string;
  v: number;
}

export interface ActivityEvent {
  id: string;
  message: string;
  ago: string;
  href?: string;
  type: "alert" | "reroute" | "report" | "sync";
}
