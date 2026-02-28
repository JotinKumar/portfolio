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
        "rounded-2xl border backdrop-blur-[12.5px] [background:rgba(0,0,0,0.05)] dark:[background:rgba(255,255,255,0.10)] [border-color:rgba(0,0,0,0.15)] dark:[border-color:rgba(255,255,255,0.15)]",
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
