"use client";
import { useState } from "react";
import {
  Battery,
  Signal,
  Radio,
  ShieldCheck,
  X,
  AlertTriangle,
  Info,
  Zap,
} from "lucide-react";
import DynamicFarmMap from "@/components/DynamicFarmMap";
import { Card, CardBody, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { NODES, SENSORS, RECOMMENDATIONS, getNode } from "@/lib/mockData";
import type { MeshNode } from "@/lib/types";

export default function NetworkPage() {
  const [showFields, setShowFields] = useState(true);
  const [showLoraRanges, setShowLoraRanges] = useState(true);
  const [showHalowRanges, setShowHalowRanges] = useState(true);
  const [showSensorRanges, setShowSensorRanges] = useState(false);
  const [sortKey, setSortKey] = useState<"id" | "battery" | "status">("id");
  const [selected, setSelected] = useState<MeshNode | null>(null);

  const healthyCount = NODES.filter((n) => n.status === "online").length;
  const degradedCount = NODES.filter((n) => n.status === "degraded").length;
  const loraNodeCount = NODES.filter((n) => n.radios.includes("lora_node")).length;
  const halowNodeCount = NODES.filter((n) => n.radios.includes("halow_node")).length;

  const sorted = [...NODES].sort((a, b) => {
    if (sortKey === "battery") return a.battery - b.battery;
    if (sortKey === "status") return a.status.localeCompare(b.status);
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Network health</h1>
        <div className="text-xs text-muted-foreground">
          Decentralised mesh topology — self-healing, farmer-owned.
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardBody className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total nodes</span>
              <Radio className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{NODES.length}</div>
            <div className="text-xs text-muted-foreground">
              {loraNodeCount} LoRa Nodes · {halowNodeCount} WiFi HaLow nodes
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Healthy</span>
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{healthyCount} / {NODES.length}</div>
            <Badge tone="amber" className="w-fit">{degradedCount} degraded mesh node</Badge>
          </CardBody>
        </Card>
        <Kpi label="Sensors served" value={`${SENSORS.length}`} icon={<Signal className="w-4 h-4 text-blue-500" />} />
        <Card>
          <CardBody className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Redundancy score</span>
              <ShieldCheck className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold">Good</div>
            <Badge tone="green" className="w-fit">Redundant nodes &gt; 80%</Badge>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 overflow-hidden relative z-0">
          <CardHeader className="flex flex-wrap items-center justify-between gap-2 flex-row py-2">
            <CardTitle>Mesh topology</CardTitle>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <ToggleChip
                on={showFields}
                set={setShowFields}
                label="Fields"
              />
              <ToggleChip
                on={showLoraRanges}
                set={setShowLoraRanges}
                label="LoRa ranges"
              />
              <ToggleChip
                on={showHalowRanges}
                set={setShowHalowRanges}
                label="HaLow ranges"
              />
              <ToggleChip
                on={showSensorRanges}
                set={setShowSensorRanges}
                label="Sensor ranges"
              />
            </div>
          </CardHeader>
          <div className="h-[540px] w-full relative z-0">
            <DynamicFarmMap
              mode="network"
              showFields={showFields}
              showSensors={true}
              showNodes={true}
              showMeshLinks={true}
              showLoraRanges={showLoraRanges}
              showHalowRanges={showHalowRanges}
              showSensorRanges={showSensorRanges}
              onNodeClick={(id) => setSelected(getNode(id) ?? null)}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="py-3">
            <CardTitle>Network recommendations</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {RECOMMENDATIONS.map((r) => (
              <div
                key={r.id}
                className={`rounded-lg border p-3 flex gap-3 ${
                  r.severity === "warning"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                {r.severity === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-sm">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {r.body}
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Node table */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle>Nodes</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs text-muted-foreground">
              <tr>
                <Th onClick={() => setSortKey("id")} active={sortKey === "id"}>
                  Node
                </Th>
                <Th>Type</Th>
                <Th
                  onClick={() => setSortKey("status")}
                  active={sortKey === "status"}
                >
                  Status
                </Th>
                <Th
                  onClick={() => setSortKey("battery")}
                  active={sortKey === "battery"}
                >
                  Battery
                </Th>
                <Th>Sensors</Th>
                <Th>Range</Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((n) => (
                <tr
                  key={n.id}
                  onClick={() => setSelected(n)}
                  className="border-t border-border hover:bg-muted cursor-pointer"
                >
                  <td className="px-3 py-2 font-mono text-xs">{n.id}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{n.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatNodeRadios(n)}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      tone={
                        n.status === "online"
                          ? "green"
                          : n.status === "degraded"
                            ? "amber"
                            : "red"
                      }
                    >
                      {n.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <BatteryCell pct={n.battery} />
                  </td>
                  <td className="px-3 py-2">{n.connectedSensors}</td>
                  <td className="px-3 py-2">{formatNodeRanges(n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {selected && <NodeDialog node={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <th
      onClick={onClick}
      className={`text-left px-3 py-2 font-medium ${
        onClick ? "cursor-pointer hover:text-foreground" : ""
      } ${active ? "text-foreground" : ""}`}
    >
      {children}
      {active && " ↓"}
    </th>
  );
}

function BatteryCell({ pct }: { pct: number }) {
  const tone = pct < 25 ? "red" : pct < 60 ? "amber" : "green";
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            tone === "red"
              ? "bg-red-500"
              : tone === "amber"
                ? "bg-amber-500"
                : "bg-green-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs">{pct}%</span>
    </div>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardBody>
    </Card>
  );
}

function ToggleChip({
  on,
  set,
  label,
}: {
  on: boolean;
  set: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => set(!on)}
      className={`px-2 py-1 rounded-md border transition-colors ${
        on
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted text-muted-foreground border-border"
      }`}
    >
      {label}
    </button>
  );
}

function NodeDialog({ node, onClose }: { node: MeshNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card className="max-w-md w-full relative z-[2001]" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex items-center justify-between flex-row py-3">
          <CardTitle>{node.name}</CardTitle>
          <button onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </CardHeader>
        <CardBody className="space-y-2 text-sm">
          <div className="flex gap-2">
            <Badge
              tone={
                node.status === "online"
                  ? "green"
                  : node.status === "degraded"
                    ? "amber"
                    : "red"
              }
            >
              {node.status}
            </Badge>
            <Badge tone="slate">{formatNodeRadios(node)}</Badge>
          </div>
          <Row label="Node ID" value={node.id} />
          <Row label="Uptime" value={node.uptime} />
          <Row label="Signal strength" value={`${node.signalStrength}%`} />
          <Row label="Battery" value={`${node.battery}%`} />
          <Row label="Ranges" value={formatNodeRanges(node)} />
          <Row label="Connected sensors" value={`${node.connectedSensors}`} />
          <Row label="Neighbours" value={node.neighbours.join(", ") || "—"} />
        </CardBody>
      </Card>
    </div>
  );
}

function formatNodeRadios(node: MeshNode) {
  return node.radios
    .map((radio) => radio === "lora_node" ? "LoRa" : radio === "halow_node" ? "HaLow" : "Gateway")
    .join(" + ");
}

function formatNodeRanges(node: MeshNode) {
  const ranges = [
    node.loraRangeKm ? `LoRa ${node.loraRangeKm} km` : null,
    node.halowRangeKm ? `HaLow ${node.halowRangeKm} km` : null,
  ].filter(Boolean);

  return ranges.join(" · ") || "—";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
