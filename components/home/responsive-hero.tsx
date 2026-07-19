import HeroSplit from "@/components/home/HeroSplit";
import { MobileHero } from "@/components/home/mobile-hero";
import { TabletHero } from "@/components/home/tablet-hero";
import type { HeroContent, SiteConfig } from "@/lib/db-types";

type ResponsiveHeroProps = {
  heroContent: HeroContent;
  siteConfig: SiteConfig | null;
};

export function ResponsiveHero({
  heroContent,
  siteConfig,
}: ResponsiveHeroProps) {
  return (
    <>
      <div className="md:hidden">
        <MobileHero heroContent={heroContent} siteConfig={siteConfig} />
      </div>
      <div className="hidden md:block lg:hidden">
        <TabletHero heroContent={heroContent} siteConfig={siteConfig} />
      </div>
      <div className="hidden lg:block">
        <HeroSplit heroContent={heroContent} siteConfig={siteConfig} />
      </div>
    </>
  );
}
