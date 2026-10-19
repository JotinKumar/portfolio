"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";

export function PublicDesignScope({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const className = pathname === "/profile" ? "contents" : "public-design-scope contents";

  useLayoutEffect(() => {
    const root = document.documentElement;
    const enabled = pathname !== "/profile";

    root.classList.toggle("public-design-scope", enabled);

    return () => {
      root.classList.remove("public-design-scope");
    };
  }, [pathname]);

  return <div className={className}>{children}</div>;
}
