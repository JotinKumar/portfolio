"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function AdminActionToast() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const success = params.get("success");
    const error = params.get("error");

    if (!success && !error) return;

    if (success) toast.success(success.replace(/_/g, " "));
    if (error) toast.error(error.replace(/_/g, " "));

    router.replace(pathname);
  }, [params, pathname, router]);

  return null;
}
