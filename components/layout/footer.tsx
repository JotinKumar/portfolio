import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";
import type { NavigationItem, SiteConfig, SocialLink } from "@/lib/db-types";

const iconForPlatform = (platform: string) => {
  const normalized = platform.toLowerCase();
  if (normalized.includes("github")) return Github;
  if (normalized.includes("linkedin")) return Linkedin;
  if (normalized.includes("twitter")) return Twitter;
  return Mail;
};

const normalizeLinks = (links: NavigationItem[]) =>
  links.map((item) => ({ name: item.label, href: item.href, openInNewTab: item.openInNewTab }));

export function Footer({
  siteConfig,
  socialLinks,
  quickLinks,
  resourceLinks,
  legalLinks,
}: {
  siteConfig: SiteConfig | null;
  socialLinks: SocialLink[];
  quickLinks: NavigationItem[];
  resourceLinks: NavigationItem[];
  legalLinks: NavigationItem[];
}) {
  const footerLinks: Record<string, { name: string; href: string; openInNewTab: boolean }[]> = {
    "Quick Links": normalizeLinks(quickLinks),
    Resources: normalizeLinks(resourceLinks),
    Legal: normalizeLinks(legalLinks),
  };

  const siteName = siteConfig?.siteName ?? "Portfolio";
  const tagline = siteConfig?.siteTagline ?? "";

  return (
    <footer className="border-t bg-background">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">{siteName}</span>
            </div>
            <p className="text-muted-foreground text-sm">{tagline}</p>
            <div className="flex space-x-2">
              {socialLinks.map((social) => {
                const Icon = iconForPlatform(social.platform);
                return (
                  <Button key={social.id} variant="ghost" size="icon" asChild>
                    <Link href={social.url} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{social.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              (c) {new Date().getFullYear()} {siteName}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>using Next.js & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
