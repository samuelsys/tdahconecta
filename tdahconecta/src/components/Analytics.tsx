// src/components/Analytics.tsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const GA_TRACKING_ID = 'G-36WRMST94T';

export default function Analytics({ debugMode = false }: { debugMode?: boolean }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = (...args: any[]) => (window as any).dataLayer.push(args);
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', GA_TRACKING_ID, { debug_mode: debugMode });
  }, [debugMode]);

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      strategy="afterInteractive"
      onLoad={() => (window as any).gtag?.('event', 'page_view')}
    />
  );
}