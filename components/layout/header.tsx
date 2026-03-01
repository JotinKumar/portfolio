"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { NavigationItem, SiteConfig } from "@/lib/db-types";
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
  Download,
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
  if (normalized.includes("article")) return FileText;
  if (normalized.includes("project")) return Briefcase;
  if (normalized.includes("contact")) return Mail;
  return FileText;
};

export function Header({
  siteConfig,
  navigationItems,
}: {
  siteConfig: SiteConfig | null;
  navigationItems: NavigationItem[];
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const resumeUrl = siteConfig?.resumeUrl;
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
                  const Icon = iconForLabel(item.label);
                  return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
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

            {resumeUrl ? (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                asChild
              >
                <Link href={resumeUrl} target="_blank">
                  <Download className="w-4 h-4 mr-2" />
                  Resume
                </Link>
              </Button>
            ) : null}

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
                    const Icon = iconForLabel(item.label);
                    return (
                    <Link
                      key={`mobile-${item.id}`}
                      href={item.href}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      className="flex items-center space-x-2 text-lg font-medium"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )})}
                  {resumeUrl ? (
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href={resumeUrl} target="_blank">
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Glassmorphism>
    </header>
  );
}
