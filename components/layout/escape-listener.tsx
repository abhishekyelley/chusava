"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export function EscapeListener({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const eventHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push(path);
      }
    },
    [router, path]
  );
  useEffect(() => {
    document.addEventListener("keydown", eventHandler);
    return () =>
      document.removeEventListener("keydown", eventHandler);
  }, [path, router, eventHandler]);
  return <>{children}</>;
}
