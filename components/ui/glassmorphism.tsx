"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
}

export function Glassmorphism({
  children,
  className = "",
}: GlassmorphismProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render without theme-specific styles during SSR
    return <div className={cn("rounded-2xl", className)}>{children}</div>;
  }

  const isDark = theme === "dark";

  return (
    <div
      className={cn("rounded-2xl", className)}
      style={{
        background: isDark
          ? "rgba(255, 255, 255, 0.10)"
          : "rgba(0, 0, 0, 0.05)",

        boxShadow: isDark
          ? "0 4px 30px rgba(0, 0, 255, 0.10)"
          : "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(12.5px)",
        WebkitBackdropFilter: "blur(12.5px)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.15)"
          : "1px solid rgba(0, 0, 0, 0.15)",
      }}
    >
      {children}
    </div>
  );
}
