import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EnvelopeSimple as Mail, GithubLogo as Github, Heart, LinkedinLogo as Linkedin, XLogo } from "@phosphor-icons/react/ssr";
import type { NavigationItem, SiteConfig, SocialLink } from "@/lib/db-types";
import { isExternalSocialLink, normalizeSocialPlatform, resolveSocialLinkTarget } from "@/lib/social-links";

const iconForPlatform = (platform: string) => {
  const normalized = normalizeSocialPlatform(platform);
  if (normalized === "github") return Github;
  if (normalized === "linkedin") return Linkedin;
  if (normalized === "x") return XLogo;
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
              <span className="font-serif text-xl font-medium">{siteName}</span>
            </div>
            <p className="type-body text-muted-foreground">{tagline}</p>
            <div className="flex space-x-2">
              {socialLinks.filter((social) => resolveSocialLinkTarget(social)).map((social) => {
                const Icon = iconForPlatform(social.platform);
                const href = resolveSocialLinkTarget(social);

                if (!href) {
                  return null;
                }

                return (
                  <Button key={social.id} variant="ghost" size="icon" asChild>
                    <Link href={href} target={isExternalSocialLink(social) ? "_blank" : undefined} rel={isExternalSocialLink(social) ? "noopener noreferrer" : undefined}>
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
              <h3 className="type-card-title text-[1.05rem]">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                      className="type-nav text-muted-foreground transition-colors hover:text-foreground"
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
          <div className="type-meta flex items-center space-x-2 text-muted-foreground">
            <span>
              (c) {new Date().getFullYear()} {siteName}. All rights reserved.
            </span>
          </div>
          <div className="type-meta flex items-center space-x-1 text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 fill-current text-primary" />
            <span>using Next.js & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
