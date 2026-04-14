"use client";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type FarmMapType from "./FarmMap";

const FarmMap = dynamic(() => import("./FarmMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export default function DynamicFarmMap(
  props: ComponentProps<typeof FarmMapType>
) {
  return <FarmMap {...props} />;
}
