"use client";
import { use, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Battery,
  Signal,
  Droplets,
  Thermometer,
  Activity,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Line,
  LineChart,
  Legend,
} from "recharts";
import { Card, CardBody, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { SENSORS, HISTORY, getSensor, ALERTS } from "@/lib/mockData";

type TimeRange = "24h" | "7d" | "30d";

export default function SensorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const sensor = getSensor(id);
  const [range, setRange] = useState<TimeRange>("30d");
  const [dialog, setDialog] = useState<null | "irrigate" | "resolved">(null);
  if (!sensor) return notFound();

  const history = HISTORY[sensor.id] ?? [];
  const sliced = useMemo(() => {
    const hours = range === "24h" ? 24 : range === "7d" ? 24 * 7 : 24 * 30;
    return history.slice(-hours).map((p) => ({
      t: p.t,
      v: p.v,
      label:
        range === "24h"
          ? new Date(p.t).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(p.t).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            }),
    }));
  }, [history, range]);

  // Comparison chart — sensor vs block avg vs farm avg (last 7d daily)
  const comparison = useMemo(() => {
    const days = 7;
    const rows: { day: string; sensor: number; block: number; farm: number }[] = [];
    for (let d = days - 1; d >= 0; d--) {
      const endIdx = history.length - d * 24;
      const startIdx = endIdx - 24;
      const sliceAvg = (arr: number[]) =>
        arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
      const sensorVals = history.slice(startIdx, endIdx).map((p) => p.v);
      const sensorAvg = sliceAvg(sensorVals);
      const blockSensors = SENSORS.filter(
        (s) => s.block === sensor.block && s.type === sensor.type
      );
      const blockAvg = sliceAvg(
        blockSensors.flatMap((s) =>
          HISTORY[s.id]?.slice(startIdx, endIdx).map((p) => p.v) ?? []
        )
      );
      const farmSensors = SENSORS.filter((s) => s.type === sensor.type);
      const farmAvg = sliceAvg(
        farmSensors.flatMap((s) =>
          HISTORY[s.id]?.slice(startIdx, endIdx).map((p) => p.v) ?? []
        )
      );
      rows.push({
        day: new Date(
          history[endIdx - 1]?.t ?? Date.now()
        ).toLocaleDateString([], { month: "short", day: "numeric" }),
        sensor: Math.round(sensorAvg * 10) / 10,
        block: Math.round(blockAvg * 10) / 10,
        farm: Math.round(farmAvg * 10) / 10,
      });
    }
    return rows;
  }, [history, sensor]);

  const hasAlert = ALERTS.some((a) => a.sensorId === sensor.id);
  const isMoisture = sensor.type === "soil_moisture";

  const typeLabel: Record<typeof sensor.type, string> = {
    soil_moisture: "Soil moisture",
    temperature: "Temperature",
    humidity: "Humidity",
    ph: "Soil pH",
  };

  const icon =
    sensor.type === "soil_moisture" ? (
      <Droplets className="w-5 h-5 text-blue-500" />
    ) : sensor.type === "temperature" ? (
      <Thermometer className="w-5 h-5 text-orange-500" />
    ) : (
      <Activity className="w-5 h-5 text-primary" />
    );

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-4 space-y-4">
          {/* Header */}
          <Card>
            <CardBody className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  {icon}
                  <span>{typeLabel[sensor.type]}</span>
                  <span>·</span>
                  <span>{sensor.id}</span>
                </div>
                <h1 className="text-2xl font-bold">{sensor.name}</h1>
                <div className="text-sm text-muted-foreground mt-1">
                  Routed via {sensor.routedVia} · Mode:{" "}
                  {sensor.routedVia.startsWith("S-") ? "LoRa mesh relay" : "LoRa"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-5xl font-bold tabular-nums">
                  {sensor.lastReading}
                  <span className="text-2xl text-muted-foreground ml-1">
                    {sensor.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    tone={
                      sensor.status === "online"
                        ? "green"
                        : sensor.status === "warning"
                          ? "red"
                          : "slate"
                    }
                  >
                    {sensor.status}
                  </Badge>
                  <Badge tone="slate">
                    <Battery className="w-3 h-3" /> {sensor.battery}%
                  </Badge>
                  <Badge tone="slate">
                    <Signal className="w-3 h-3" /> {sensor.signalStrength}%
                  </Badge>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Hero chart */}
          <Card>
            <CardHeader className="flex items-center justify-between flex-row py-3">
              <CardTitle>
                {typeLabel[sensor.type]} — {range === "24h" ? "last 24 hours" : range === "7d" ? "last 7 days" : "last 30 days"}
              </CardTitle>
              <div className="flex gap-1.5">
                {(["24h", "7d", "30d"] as TimeRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      range === r
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardBody className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sliced} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={40} />
                  <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                  {isMoisture && (
                    <>
                      <ReferenceArea
                        y1={22}
                        y2={35}
                        fill="#16a34a"
                        fillOpacity={0.08}
                        stroke="#16a34a"
                        strokeOpacity={0.3}
                      />
                      <ReferenceLine
                        y={20}
                        stroke="#d97706"
                        strokeDasharray="4 4"
                        label={{ value: "warning", fontSize: 10, fill: "#d97706" }}
                      />
                      <ReferenceLine
                        y={18}
                        stroke="#dc2626"
                        strokeDasharray="4 4"
                        label={{ value: "critical", fontSize: 10, fill: "#dc2626" }}
                      />
                    </>
                  )}
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    formatter={(v) => [`${v}${sensor.unit}`, typeLabel[sensor.type]]}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#16a34a"
                    strokeWidth={2}
                    fill="url(#g)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Insights + Comparison */}
          {hasAlert && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle>NetSense Insights</CardTitle>
                </CardHeader>
                <CardBody className="space-y-3 text-sm">
                  <Insight>
                    Moisture has dropped <b>12%</b> over the last 7 days — faster
                    than the seasonal average.
                  </Insight>
                  <Insight>
                    Recommended action: irrigate Sensor 1 within <b>6 hours</b>.
                    Estimated <b>4,200 L</b> required.
                  </Insight>
                  <Insight>
                    Historical correlation: similar moisture patterns in 2024 led to
                    an <b>8% yield reduction</b> in Cabernet blocks.
                  </Insight>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-red-700 uppercase tracking-wide font-semibold">
                        Estimated yield damage
                      </div>
                      <div className="text-2xl font-bold text-red-900">R12,400</div>
                    </div>
                    <Droplets className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={() => setDialog("irrigate")}>
                      Schedule irrigation
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setDialog("resolved")}
                    >
                      Mark as resolved
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle>Benchmark — sensor vs block vs farm</CardTitle>
                </CardHeader>
                <CardBody className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparison} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="sensor"
                        name="This sensor"
                        stroke="#dc2626"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="block"
                        name={`Block ${sensor.block} avg`}
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="farm"
                        name="Farm avg"
                        stroke="#16a34a"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {/* Sensor list sidebar */}
        <aside className="lg:col-span-1 space-y-2 lg:sticky lg:top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-wide">
            All sensors
          </div>
          {SENSORS.map((s) => (
            <Link
              key={s.id}
              href={`/sensors/${s.id}`}
              className={`block rounded-lg border px-3 py-2 transition-colors ${
                s.id === sensor.id
                  ? "bg-primary/10 border-primary"
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    s.status === "online"
                      ? "bg-green-500"
                      : s.status === "warning"
                        ? "bg-red-500"
                        : "bg-gray-400"
                  }`}
                />
                <div className="text-xs font-mono text-muted-foreground">
                  {s.id}
                </div>
              </div>
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs text-muted-foreground">
                Block {s.block} · {s.type.replace("_", " ")}
              </div>
            </Link>
          ))}
        </aside>
      </div>

      {dialog && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setDialog(null)}
        >
          <Card
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex items-center justify-between flex-row py-3">
              <CardTitle>
                {dialog === "irrigate" ? "Schedule irrigation" : "Mark as resolved"}
              </CardTitle>
              <button onClick={() => setDialog(null)}>
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              {dialog === "irrigate" ? (
                <>
                  <p>
                    Schedule <b>4,200 L</b> irrigation for Sensor 1, starting in
                    the next 2 hours?
                  </p>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Irrigation scheduled. Farm manager notified.
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  Alert marked as resolved. Logged to farm journal.
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => setDialog(null)}>Done</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

function Insight({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
