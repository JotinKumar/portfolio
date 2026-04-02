"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { SiteConfig } from "@/lib/db-types";
import type { SiteNavLink } from "@/lib/public-page-visibility";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Moon,
  Sun,
  Menu,
  Mail,
  Download,
  User,
  FileText,
  Briefcase,
  Home,
} from "lucide-react";
import { APP_SHELL_CLASS } from "@/lib/layout";

const iconForLabel = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes("home")) return Home;
  if (normalized.includes("profile")) return User;
  if (normalized.includes("article") || normalized.includes("blog")) return FileText;
  if (normalized.includes("project")) return Briefcase;
  if (normalized.includes("contact")) return Mail;
  return FileText;
};

const normalizeNavLabel = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes("article") || normalized.includes("articel") || normalized.includes("articels")) {
    return "Blogs";
  }
  return label;
};

export function Header({
  siteConfig,
  navigationItems,
}: {
  siteConfig: SiteConfig | null;
  navigationItems: SiteNavLink[];
}) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const logoUrl = siteConfig?.logoUrl ?? "/images/logo.png";
  const logoAlt = siteConfig?.logoAlt ?? "Portfolio Logo";
  const resumeUrl = siteConfig?.resumeUrl ?? "/jotin-madugula-resume.pdf";
  const items = navigationItems;
  const isProfilePage = pathname === "/profile";

  const headerBody = (
    <div
      className={
        isProfilePage
          ? "mx-auto border border-border/70 bg-background/94 shadow-[0_10px_24px_rgba(30,24,18,0.08)] backdrop-blur-md"
          : undefined
      }
    >
      <div className="flex h-14 items-center px-3 md:px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={32}
              height={32}
              className="rounded-sm"
            />
          </Link>
        </div>

        <div className="hidden md:flex md:flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => {
                const label = normalizeNavLabel(item.label);
                const Icon = iconForLabel(label);
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                        className="type-nav group inline-flex h-10 items-center justify-center rounded-none border border-transparent bg-transparent px-3 py-2 tracking-[0.03em] transition-[transform,color,background-color,border-color] duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-primary/20 hover:bg-accent/75 hover:text-accent-foreground focus:border-primary/20 focus:bg-accent/75 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 md:w-10 md:px-0 lg:w-max lg:px-4"
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">{label}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {isProfilePage ? (
            <>
              <Button variant="outline" size="icon" className="md:hidden" asChild>
                <a href={resumeUrl} target="_blank" rel="noreferrer" aria-label="Download resume">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download resume</span>
                </a>
              </Button>
              <Button variant="outline" size="icon" className="hidden md:inline-flex lg:hidden" asChild>
                <a href={resumeUrl} target="_blank" rel="noreferrer" aria-label="Resume">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Resume</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" className="hidden lg:inline-flex" asChild>
                <a href={resumeUrl} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
            </>
          ) : null}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8 flex flex-col space-y-4">
                {isProfilePage ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="type-nav flex items-center space-x-2 border-b border-border/60 pb-3 text-foreground transition-colors duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] hover:text-primary"
                  >
                    <Download className="h-5 w-5" />
                    <span>Resume</span>
                  </a>
                ) : null}
                {items.map((item) => {
                  const label = normalizeNavLabel(item.label);
                  const Icon = iconForLabel(label);
                  return (
                    <Link
                      key={`mobile-${item.id}`}
                      href={item.href}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      className="type-nav flex items-center space-x-2 border-b border-border/60 pb-3 text-foreground transition-colors duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] hover:text-primary"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );

  return (
    <header className="fixed top-4 left-4 right-4 z-[100]">
      <div className={APP_SHELL_CLASS}>
        {isProfilePage ? headerBody : <Glassmorphism className="mx-auto">{headerBody}</Glassmorphism>}
      </div>
    </header>
  );
}
