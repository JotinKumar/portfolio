"use client";

import Link from "next/link";
import Image from "next/image";
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
  User,
  FileText,
  Briefcase,
  Home,
} from "lucide-react";

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
  const { resolvedTheme, setTheme } = useTheme();
  const logoUrl = siteConfig?.logoUrl ?? "/images/logo.png";
  const logoAlt = siteConfig?.logoAlt ?? "Portfolio Logo";
  const items = navigationItems;

  return (
    <header className="fixed top-4 left-4 right-4 z-[100]">
      <Glassmorphism className="max-w-[1280px] mx-auto">
        <div className="flex h-14 items-center px-4">
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

          {/* Desktop Navigation */}
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
                        className="type-nav group inline-flex h-10 w-max items-center justify-center rounded-none bg-transparent px-4 py-2 transition-colors hover:bg-accent/80 hover:text-accent-foreground focus:bg-accent/80 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )})}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {items.map((item) => {
                    const label = normalizeNavLabel(item.label);
                    const Icon = iconForLabel(label);
                    return (
                    <Link
                      key={`mobile-${item.id}`}
                      href={item.href}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      className="type-nav flex items-center space-x-2 text-foreground"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  )})}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Glassmorphism>
    </header>
  );
}
