"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Wifi, CheckCircle2, Radio, MapPin, Loader2 } from "lucide-react";
import { Button, Card, CardBody, Badge } from "@/components/ui";
import DynamicFarmMap from "@/components/DynamicFarmMap";
import { SENSORS, FARM } from "@/lib/mockData";

type Stage = "login" | "step1" | "step2" | "step3";

export default function SetupPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("login");
  const [farmName, setFarmName] = useState(FARM.name);
  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (stage === "step3" && scanning) {
      let cancelled = false;
      SENSORS.forEach((s, i) => {
        setTimeout(() => {
          if (cancelled) return;
          setVisibleIds((prev) => [...prev, s.id]);
          if (i === SENSORS.length - 1) setScanning(false);
        }, 250 + i * 240);
      });
      return () => {
        cancelled = true;
      };
    }
  }, [stage, scanning]);

  function finish() {
    localStorage.setItem("netsense:setupComplete", "1");
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b1a12] via-[#0f2a1c] to-[#16361f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold">NetSense</div>
            <div className="text-xs text-white/60">Mesh Farm Intelligence</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {stage === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="max-w-md mx-auto mt-16 text-center"
            >
              <h1 className="text-4xl font-bold mb-3">Welcome back</h1>
              <p className="text-white/70 mb-8">
                Sign in to manage your farm&apos;s mesh sensor network.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur text-left space-y-4">
                <div>
                  <label className="text-xs text-white/60">Email</label>
                  <input
                    defaultValue="janneke@capetownvineyard.co.za"
                    className="w-full h-10 mt-1 rounded-lg bg-white/10 border border-white/10 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full h-10 mt-1 rounded-lg bg-white/10 border border-white/10 px-3 text-sm"
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setStage("step1")}
                >
                  Sign in
                </Button>
              </div>
              <p className="text-xs text-white/40 mt-4">
                Demo build — sign-in advances to first-time setup.
              </p>
            </motion.div>
          )}

          {stage === "step1" && (
            <StepShell
              key="step1"
              step={1}
              title="Name your farm"
              subtitle="We&apos;ve pre-filled this from your registration. Confirm or edit to continue."
              action={
                <Button size="lg" onClick={() => setStage("step2")}>
                  Next
                </Button>
              }
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <label className="text-xs text-white/60">Farm name</label>
                <input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full h-11 mt-1 rounded-lg bg-white/10 border border-white/10 px-3 text-base font-medium"
                />
                <div className="mt-4 text-xs text-white/60 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {FARM.location}
                </div>
              </div>
            </StepShell>
          )}

          {stage === "step2" && (
            <StepShell
              key="step2"
              step={2}
              title="Place your gateway"
              subtitle="We&apos;ve detected your gateway powered on at the farmhouse. Confirm to register it on the mesh."
              action={
                <Button size="lg" onClick={() => setStage("step3")}>
                  Confirm &amp; continue
                </Button>
              }
            >
              <div className="rounded-xl overflow-hidden h-[360px] border border-white/10">
                <DynamicFarmMap
                  mode="setup"
                  showSensors={false}
                  showNodes={true}
                  showFields={true}
                  showMeshLinks={false}
                  visibleSensorIds={[]}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
                <Wifi className="w-4 h-4 text-accent" />
                Gateway “Farmhouse” detected · signal 98%
              </div>
            </StepShell>
          )}

          {stage === "step3" && (
            <StepShell
              key="step3"
              step={3}
              title="Add your sensors"
              subtitle="Power them on anywhere on the farm — NetSense auto-detects and joins them to the mesh."
              action={
                visibleIds.length === SENSORS.length ? (
                  <Button size="lg" onClick={finish}>
                    Go to dashboard
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => {
                      setVisibleIds([]);
                      setScanning(true);
                    }}
                    disabled={scanning}
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Scanning…
                      </>
                    ) : (
                      <>
                        <Radio className="w-4 h-4" /> + Auto-detect new sensors
                      </>
                    )}
                  </Button>
                )
              }
            >
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3 rounded-xl overflow-hidden h-[420px] border border-white/10">
                  <DynamicFarmMap
                    mode="setup"
                    showSensors={true}
                    showNodes={true}
                    showFields={true}
                    showMeshLinks={visibleIds.length > 0}
                    visibleSensorIds={visibleIds}
                  />
                </div>
                <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3 h-[420px] overflow-y-auto">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="font-semibold text-sm">Detected sensors</div>
                    <Badge tone="green">{visibleIds.length} / {SENSORS.length}</Badge>
                  </div>
                  <div className="space-y-1.5">
                    {SENSORS.map((s) => {
                      const visible = visibleIds.includes(s.id);
                      return (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{
                            opacity: visible ? 1 : 0.25,
                            x: visible ? 0 : 8,
                          }}
                          className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-xs border border-white/5"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              visible ? "bg-accent" : "bg-white/20"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="font-mono text-[11px] text-white/70">
                              {s.id}
                            </div>
                            <div className="text-white">{s.name}</div>
                          </div>
                          {visible && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  {visibleIds.length === SENSORS.length && (
                    <div className="mt-3 text-xs text-white/60 text-center">
                      No other sensors detected on the mesh.
                    </div>
                  )}
                </div>
              </div>
            </StepShell>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepShell({
  step,
  title,
  subtitle,
  children,
  action,
}: {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="max-w-5xl mx-auto mt-6"
    >
      <div className="flex items-center gap-3 mb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? "bg-accent" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <div className="text-xs uppercase tracking-wide text-white/50 mb-1">
        Step {step} of 3
      </div>
      <h1 className="text-3xl font-bold mb-1">{title}</h1>
      <p className="text-white/70 mb-6">{subtitle}</p>
      <div>{children}</div>
      <div className="mt-6 flex justify-end">{action}</div>
    </motion.div>
  );
}
