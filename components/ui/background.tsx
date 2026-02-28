"use client";
import React from "react";
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
  return (
    <div
      className={cn(
        "min-h-screen w-full relative overflow-hidden",
        containerClassName,
        className
      )}
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {showGrid && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, color-mix(in srgb, var(--color-primary), transparent 90%) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in srgb, var(--color-primary), transparent 90%) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
