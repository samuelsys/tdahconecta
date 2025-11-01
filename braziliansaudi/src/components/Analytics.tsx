'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

type GtagEventParams = Record<string, unknown>;

export default function Analytics() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];

    const gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args as unknown as Record<string, unknown>);
    };

    window.gtag = gtag;

    // exemplo de page_view
    window.gtag('event', 'page_view', {
      page_path: window.location.pathname,
    } as GtagEventParams);
  }, []);

  return null;
}