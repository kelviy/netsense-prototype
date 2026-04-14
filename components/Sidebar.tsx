"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Network,
  Bell,
  Settings,
  RotateCcw,
  Leaf,
} from "lucide-react";
import { ALERTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sensors/S-001", label: "Sensors", icon: Radio },
  { href: "/network", label: "Network", icon: Network },
  { href: "/alerts", label: "Alerts", icon: Bell, badge: ALERTS.length },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname.startsWith("/setup") || pathname === "/") return null;

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card">
      <Link href="/dashboard" className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-none">NetSense</span>
          <span className="text-[10px] text-muted-foreground">Mesh Farm Intelligence</span>
        </div>
      </Link>
      <nav className="flex-1 p-2 space-y-1">
        {nav.map((item) => {
          const active = item.href === "/sensors/S-001"
            ? pathname.startsWith("/sensors")
            : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="text-[10px] bg-danger text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("netsense:setupComplete");
              router.push("/setup");
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset demo
        </button>
      </div>
    </aside>
  );
}

export function MobileBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/setup") || pathname === "/") return null;
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-card flex justify-around h-14">
      {nav.slice(0, 4).map((item) => {
        const active = item.href === "/sensors/S-001"
          ? pathname.startsWith("/sensors")
          : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px]",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
