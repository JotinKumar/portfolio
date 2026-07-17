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
        "rounded-2xl border border-border/70 bg-card/80 backdrop-blur-[12.5px] dark:bg-card/85",
        noShadow ? "shadow-none" : "shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,255,0.10)]",
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
