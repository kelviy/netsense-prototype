"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Cloud,
  Droplets,
  Thermometer,
  Radio,
  TrendingDown,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import DynamicFarmMap from "@/components/DynamicFarmMap";
import { Card, CardBody, CardHeader, CardTitle, Badge } from "@/components/ui";
import { AlertBanner } from "@/components/AlertBanner";
import { ALERTS, ACTIVITY, KPI, FARM, WEATHER } from "@/lib/mockData";

export default function DashboardPage() {
  const [showMesh, setShowMesh] = useState(true);
  const [showFields, setShowFields] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const critical = ALERTS.find((a) => a.severity === "critical") ?? ALERTS[0];

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{FARM.name}</h1>
          <div className="text-xs text-muted-foreground">
            {FARM.location} · {FARM.hectares} ha
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">
            Synced 2 min ago via mesh
          </div>
          <Card className="px-3 py-2 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-500" />
            <div className="text-xs">
              <div className="font-semibold">
                {WEATHER.temp}°C · {WEATHER.summary}
              </div>
              <div className="text-muted-foreground">{WEATHER.forecast}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Alert banner */}
      <AlertBanner alert={critical} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi
          label="Avg soil moisture"
          value={`${KPI.avgMoisture}%`}
          delta={KPI.avgMoistureDelta}
          icon={<Droplets className="w-4 h-4 text-blue-500" />}
        />
        <Kpi
          label="Avg temperature"
          value={`${KPI.avgTemp}°C`}
          delta={KPI.avgTempDelta}
          icon={<Thermometer className="w-4 h-4 text-orange-500" />}
        />
        <Kpi
          label="Sensors online"
          value={`${KPI.sensorsOnline} / ${KPI.sensorsTotal}`}
          icon={<Radio className="w-4 h-4 text-primary" />}
        />
        <Kpi
          label="Active alerts"
          value={`${ALERTS.length}`}
          icon={
            <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse inline-block" />
          }
        />
      </div>

      {/* Map + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="flex items-center justify-between flex-row py-2">
            <CardTitle>Farm map</CardTitle>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <ToggleChip on={showFields} set={setShowFields} label="Fields" />
              <ToggleChip on={showSensors} set={setShowSensors} label="Sensors" />
              <ToggleChip on={showNodes} set={setShowNodes} label="Nodes" />
              <ToggleChip on={showMesh} set={setShowMesh} label="Mesh links" />
            </div>
          </CardHeader>
          <div className="h-[500px] w-full">
            <DynamicFarmMap
              mode="dashboard"
              showFields={showFields}
              showSensors={showSensors}
              showNodes={showNodes}
              showMeshLinks={showMesh}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="py-2">
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {ACTIVITY.map((e) => {
                const content = (
                  <>
                    <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          e.type === "alert"
                            ? "bg-red-500"
                            : e.type === "reroute"
                              ? "bg-amber-500"
                              : e.type === "report"
                                ? "bg-blue-500"
                                : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{e.message}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {e.ago}
                        </div>
                      </div>
                      {e.href && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                    </div>
                  </>
                );
                return (
                  <li key={e.id}>
                    {e.href ? <Link href={e.href}>{content}</Link> : content}
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {delta !== undefined && (
          <div
            className={`text-xs flex items-center gap-1 ${
              delta < 0 ? "text-red-600" : "text-green-700"
            }`}
          >
            {delta < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            {Math.abs(delta)}
            {label.includes("moisture") ? "%" : "°"} vs yesterday
          </div>
        )}
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
