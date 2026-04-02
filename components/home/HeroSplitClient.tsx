"use client";

import dynamic from "next/dynamic";
import { HeroSplitSkeleton } from "@/components/home/HeroSplitSkeleton";
import type { HeroContent, SiteConfig } from "@/lib/db-types";

const HeroSplit = dynamic(() => import("@/components/home/HeroSplit"), {
  ssr: false,
  loading: () => <HeroSplitSkeleton />,
});

export function HeroSplitClient({
  heroContent,
  siteConfig,
}: {
  heroContent: HeroContent;
  siteConfig: SiteConfig | null;
}) {
  return <HeroSplit heroContent={heroContent} siteConfig={siteConfig} />;
}
