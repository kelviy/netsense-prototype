"use client";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { Alert } from "@/lib/types";

export function AlertBanner({ alert }: { alert: Alert }) {
  const href = alert.sensorId ? `/sensors/${alert.sensorId}` : "/network";
  const toneClass =
    alert.severity === "critical"
      ? "bg-red-50 border-red-200 text-red-900"
      : alert.severity === "warning"
        ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-blue-50 border-blue-200 text-blue-900";
  return (
    <Link
      href={href}
      className={`flex items-start md:items-center gap-3 rounded-xl border px-4 py-3 ${toneClass} hover:shadow-sm transition-shadow`}
    >
      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 md:mt-0" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm flex items-center gap-2">
          {alert.title}
          <span className="text-[10px] uppercase tracking-wide bg-white/60 rounded px-1.5 py-0.5">
            {alert.severity}
          </span>
        </div>
        <div className="text-xs opacity-80 mt-0.5">{alert.message}</div>
        <div className="text-xs font-semibold mt-1">{alert.estimatedImpact}</div>
      </div>
      <ArrowRight className="w-4 h-4 shrink-0" />
    </Link>
  );
}
