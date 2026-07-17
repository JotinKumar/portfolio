"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PublicDesignScope({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/profile") {
    return <>{children}</>;
  }

  return <div className="public-design-scope contents">{children}</div>;
}
