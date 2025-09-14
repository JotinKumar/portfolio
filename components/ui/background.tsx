"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  showGrid?: boolean;
}

export function Background({
  children,
  className = "",
  containerClassName = "",
  showGrid = true,
}: BackgroundProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR fallback: no theme
    return (
      <div
        className={cn(
          "min-h-screen w-full relative overflow-hidden",
          containerClassName,
          className
        )}
        style={{
          backgroundColor: "var(--color-background)",
        }}
      >
        {showGrid && <div className="absolute inset-0 z-0" />}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  const isDark = theme === "dark";

  const backgroundColor = "var(--color-background)";
  // Use a visible shade of the theme color for the grid
  const gridColor = isDark
    ? "color-mix(in srgb, var(--color-secondary), transparent 80%)"
    : "color-mix(in srgb, var(--color-primary), transparent 90%)";

  return (
    <div
      className={cn(
        "min-h-screen w-full relative overflow-hidden",
        containerClassName,
        className
      )}
      style={{ backgroundColor }}
    >
      {showGrid && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${gridColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
