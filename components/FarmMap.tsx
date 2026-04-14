"use client";
import { useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Polyline,
  Circle,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { FARM, FIELDS, NODES, SENSORS, getNode, getSensor } from "@/lib/mockData";
import type { Sensor, MeshNode } from "@/lib/types";

type Props = {
  mode?: "dashboard" | "network" | "setup";
  showSensors?: boolean;
  showNodes?: boolean;
  showFields?: boolean;
  showMeshLinks?: boolean;
  showNodeRanges?: boolean;
  showSensorRanges?: boolean;
  visibleSensorIds?: string[]; // for setup animation
  onSensorClick?: (id: string) => void;
  onNodeClick?: (id: string) => void;
  highlightSensorId?: string;
};

function sensorIcon(sensor: Sensor, highlight = false) {
  const cls = sensor.status;
  return L.divIcon({
    className: "",
    html: `<div class="sensor-pin ${cls}" style="${highlight ? "transform:scale(1.4);box-shadow:0 0 0 3px rgba(22,163,74,0.8);" : ""}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function nodeIcon(node: MeshNode) {
  const classes = [
    "node-pin",
    node.type === "gateway" ? "gateway" : "",
    node.status === "degraded" ? "degraded" : "",
  ].filter(Boolean).join(" ");
  const label = node.type === "gateway" ? "GW" : node.id.replace("N-", "");
  return L.divIcon({
    className: "",
    html: `<div class="${classes}">${label}</div>`,
    iconSize: node.type === "gateway" ? [34, 34] : [28, 28],
    iconAnchor: node.type === "gateway" ? [17, 17] : [14, 14],
  });
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const b = L.latLngBounds(
      FIELDS.flatMap((f) => f.polygon.map(([a, b]) => [a, b] as [number, number]))
    );
    map.fitBounds(b, { padding: [30, 30] });
  }, [map]);
  return null;
}

export default function FarmMap({
  mode = "dashboard",
  showSensors = true,
  showNodes = true,
  showFields = true,
  showMeshLinks = true,
  showNodeRanges = false,
  showSensorRanges = false,
  visibleSensorIds,
  onSensorClick,
  onNodeClick,
  highlightSensorId,
}: Props) {
  const router = useRouter();
  const sensorsShown = useMemo(
    () => (visibleSensorIds ? SENSORS.filter((s) => visibleSensorIds.includes(s.id)) : SENSORS),
    [visibleSensorIds]
  );

  // Build mesh link lines
  const meshLinks = useMemo(() => {
    const links: { a: [number, number]; b: [number, number]; degraded: boolean; id: string }[] = [];
    // node-to-node links
    const seen = new Set<string>();
    for (const n of NODES) {
      for (const nid of n.neighbours) {
        const key = [n.id, nid].sort().join("-");
        if (seen.has(key)) continue;
        seen.add(key);
        const other = getNode(nid);
        if (!other) continue;
        const deg = n.status === "degraded" || other.status === "degraded";
        links.push({
          a: [n.lat, n.lng],
          b: [other.lat, other.lng],
          degraded: deg,
          id: key,
        });
      }
    }
    return links;
  }, []);

  // sensor → parent links
  const sensorLinks = useMemo(() => {
    return SENSORS.map((s) => {
      const parent = s.routedVia.startsWith("N-")
        ? getNode(s.routedVia)
        : getSensor(s.routedVia);
      if (!parent) return null;
      return {
        id: s.id,
        from: [s.lat, s.lng] as [number, number],
        to: [parent.lat, parent.lng] as [number, number],
        rerouted: !s.routedVia.startsWith("N-"),
        sensor: s,
      };
    }).filter(Boolean) as {
      id: string;
      from: [number, number];
      to: [number, number];
      rerouted: boolean;
      sensor: Sensor;
    }[];
  }, []);

  return (
    <MapContainer
      center={FARM.centre}
      zoom={15}
      scrollWheelZoom={false}
      className="w-full h-full rounded-xl"
    >
      <FitBounds />
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {showFields &&
        FIELDS.map((f) => (
          <Polygon
            key={f.id}
            positions={f.polygon}
            pathOptions={{
              color: mode === "network" ? "#9ca3af" : "#2e7d4f",
              fillColor: mode === "network" ? "#e5e7eb" : "#4ade80",
              fillOpacity: mode === "network" ? 0.15 : 0.25,
              weight: mode === "network" ? 1 : 2,
            }}
          >
            <Tooltip sticky>
              <strong>{f.name}</strong> — {f.hectares} ha
            </Tooltip>
          </Polygon>
        ))}

      {/* Node range circles */}
      {showNodeRanges &&
        NODES.map((n) => (
          <Circle
            key={`r-${n.id}`}
            center={[n.lat, n.lng]}
            radius={n.rangeKm * 1000}
            pathOptions={{
              color: n.status === "degraded" ? "#d97706" : n.type === "gateway" ? "#0ea5e9" : "#16a34a",
              weight: 1,
              fillOpacity: 0.06,
              dashArray: "4 4",
            }}
          />
        ))}

      {/* Sensor LoRa range (1km) */}
      {showSensorRanges &&
        SENSORS.map((s) => (
          <Circle
            key={`sr-${s.id}`}
            center={[s.lat, s.lng]}
            radius={1000}
            pathOptions={{
              color: "#84cc16",
              weight: 1,
              fillOpacity: 0.03,
              dashArray: "2 4",
            }}
          />
        ))}

      {/* Mesh node-to-node links */}
      {showMeshLinks &&
        meshLinks.map((l) => (
          <Polyline
            key={l.id}
            positions={[l.a, l.b]}
            pathOptions={{
              color: l.degraded ? "#d97706" : "#16a34a",
              weight: l.degraded ? 2 : 3,
              opacity: 0.85,
              dashArray: "8 6",
              className: "mesh-link-active",
            }}
          />
        ))}

      {/* Sensor → parent links (for network mode) */}
      {showMeshLinks && mode === "network" &&
        sensorLinks.map((l) => {
          const color = l.rerouted ? "#16a34a" : "#22c55e";
          const weight = l.rerouted ? 3 : 1.5;
          return (
            <Polyline
              key={`sl-${l.id}`}
              positions={[l.from, l.to]}
              pathOptions={{
                color,
                weight,
                opacity: 0.9,
                dashArray: l.rerouted ? "6 4" : undefined,
                className: l.rerouted ? "mesh-link-active" : undefined,
              }}
            />
          );
        })}

      {/* Broken link — S-008 to N-02 (thin red) to show original path is gone */}
      {showMeshLinks && mode === "network" && (
        <Polyline
          positions={[
            [getSensor("S-008")!.lat, getSensor("S-008")!.lng],
            [getNode("N-02")!.lat, getNode("N-02")!.lng],
          ]}
          pathOptions={{
            color: "#dc2626",
            weight: 1,
            opacity: 0.7,
            dashArray: "2 6",
          }}
        />
      )}

      {/* Sensor markers */}
      {showSensors &&
        sensorsShown.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={sensorIcon(s, s.id === highlightSensorId)}
            eventHandlers={{
              click: () => {
                if (onSensorClick) onSensorClick(s.id);
                else if (mode === "dashboard") router.push(`/sensors/${s.id}`);
              },
            }}
          >
            <Tooltip>
              <strong>{s.name}</strong>
              <br />
              {s.lastReading}
              {s.unit} · routed via {s.routedVia}
            </Tooltip>
          </Marker>
        ))}

      {/* Node markers */}
      {showNodes &&
        NODES.map((n) => (
          <Marker
            key={n.id}
            position={[n.lat, n.lng]}
            icon={nodeIcon(n)}
            eventHandlers={{
              click: () => onNodeClick?.(n.id),
            }}
          >
            <Tooltip>
              <strong>{n.name}</strong>
              <br />
              {n.status} · {n.connectedSensors} sensors · {n.rangeKm}km range
            </Tooltip>
          </Marker>
        ))}
    </MapContainer>
  );
}
