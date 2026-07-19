"use client";

import { useSyncExternalStore } from "react";

import HeroSplit from "@/components/home/HeroSplit";
import { MobileHero } from "@/components/home/mobile-hero";
import {
  getHeroVariant,
  type HeroVariant,
} from "@/components/home/responsive-hero-model";
import { TabletHero } from "@/components/home/tablet-hero";
import type { HeroContent, SiteConfig } from "@/lib/db-types";

const VIEWPORT_QUERIES = ["(max-width: 767px)", "(min-width: 1024px)"];

type ResponsiveHeroProps = {
  heroContent: HeroContent;
  siteConfig: SiteConfig | null;
};

function subscribeToViewport(onStoreChange: () => void) {
  const mediaQueries = VIEWPORT_QUERIES.map((query) => window.matchMedia(query));

  mediaQueries.forEach((mediaQuery) => {
    mediaQuery.addEventListener("change", onStoreChange);
  });

  return () => {
    mediaQueries.forEach((mediaQuery) => {
      mediaQuery.removeEventListener("change", onStoreChange);
    });
  };
}

function getClientHeroVariant(): HeroVariant {
  return getHeroVariant(window.innerWidth);
}

function getServerHeroVariant(): null {
  return null;
}

export function ResponsiveHero({
  heroContent,
  siteConfig,
}: ResponsiveHeroProps) {
  const variant = useSyncExternalStore(
    subscribeToViewport,
    getClientHeroVariant,
    getServerHeroVariant
  );

  if (variant === null) {
    return (
      <div
        aria-hidden="true"
        data-testid="responsive-hero-placeholder"
        className="h-[38rem] w-full md:h-[43rem] lg:h-[42.5rem]"
      />
    );
  }

  if (variant === "mobile") {
    return (
      <div data-responsive-hero-variant="mobile">
        <MobileHero heroContent={heroContent} siteConfig={siteConfig} />
      </div>
    );
  }

  if (variant === "tablet") {
    return (
      <div data-responsive-hero-variant="tablet">
        <TabletHero heroContent={heroContent} siteConfig={siteConfig} />
      </div>
    );
  }

  return (
    <div data-responsive-hero-variant="desktop">
      <HeroSplit heroContent={heroContent} siteConfig={siteConfig} />
    </div>
  );
}
