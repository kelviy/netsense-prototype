"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const done =
      typeof window !== "undefined" &&
      localStorage.getItem("netsense:setupComplete") === "1";
    router.replace(done ? "/dashboard" : "/setup");
  }, [router]);
  return (
    <div className="flex items-center justify-center h-screen text-muted-foreground">
      Loading…
    </div>
  );
}
