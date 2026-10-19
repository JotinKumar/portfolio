"use client";

import { cn } from "@/lib/utils";

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  noShadow?: boolean;
}

export function Glassmorphism({
  children,
  className = "",
  noShadow = false,
}: GlassmorphismProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-layout)] border border-border/70 bg-card/80 backdrop-blur-[12.5px] dark:bg-card/85",
        noShadow ? "shadow-none" : "shadow-lg",
        className
      )}
      style={{
        WebkitBackdropFilter: "blur(12.5px)",
      }}
    >
      {children}
    </div>
  );
}
