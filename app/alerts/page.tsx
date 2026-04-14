"use client";
import { AlertBanner } from "@/components/AlertBanner";
import { Card, CardBody } from "@/components/ui";
import { ALERTS } from "@/lib/mockData";
import { BellOff } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <div className="text-xs text-muted-foreground mb-2">
        {ALERTS.length} active {ALERTS.length === 1 ? "alert" : "alerts"} across your farm.
      </div>
      {ALERTS.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <BellOff className="w-8 h-8" />
            <div>No active alerts. Everything looks healthy.</div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-2">
          {ALERTS.map((a) => (
            <AlertBanner key={a.id} alert={a} />
          ))}
        </div>
      )}
    </div>
  );
}
