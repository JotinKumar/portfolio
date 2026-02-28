"use client";

import dynamic from "next/dynamic";
import { HeroSplitSkeleton } from "@/components/sections/hero/HeroSplitSkeleton";

const HeroSplit = dynamic(() => import("@/components/sections/hero/HeroSplit"), {
  ssr: false,
  loading: () => <HeroSplitSkeleton />,
});

export function HeroSplitClient() {
  return <HeroSplit />;
}
