"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initFirebase, trackEvent } from "@/lib/firebaseClient";

/**
 * - Inicializa Firebase Analytics no browser
 * - Emite "home_enter" apenas na Home (uma vez por path)
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    initFirebase();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = searchParams?.toString();
    const path = pathname + (query ? `?${query}` : "");
    const isHome = pathname === "/" || pathname === "" || pathname === "/index";

    if (isHome && lastTrackedPath.current !== path) {
      lastTrackedPath.current = path;
      trackEvent("home_enter", {
        page_path: path,
        referrer: document.referrer || null,
      });
    }
  }, [pathname, searchParams]);

  return null;
}