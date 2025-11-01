// src/lib/firebaseClient.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics";

const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!, // obrigatório p/ Analytics
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let ready: Promise<boolean> | null = null;

/** Inicializa Firebase/GA4 no browser. Em dev só liga GA4 se DEBUG=1. */
export function initFirebase(): void {
  if (typeof window === "undefined") return;

  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    if (DEBUG || process.env.NODE_ENV !== "production") {
      console.info("[analytics] Firebase app initialized", {
        projectId: firebaseConfig.projectId,
      });
    }
  }

  if (!ready) {
    ready = (async () => {
      try {
        // Em produção: sempre tenta; em dev: só se DEBUG=1
        if (process.env.NODE_ENV !== "production" && !DEBUG) {
          if (DEBUG || process.env.NODE_ENV !== "production") {
            console.info("[analytics] Skipping GA init in dev (set NEXT_PUBLIC_ANALYTICS_DEBUG=1 to enable).");
          }
          return false;
        }

        if (!firebaseConfig.measurementId) {
          console.warn("[analytics] Missing NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID");
          return false;
        }

        const supported = await isSupported().catch(() => false);
        if (DEBUG || process.env.NODE_ENV !== "production") {
          console.info("[analytics] isSupported =", supported);
        }
        if (!supported) return false;

        analytics = getAnalytics(app!);

        // Força debug_mode para aparecer no DebugView
        try {
          (window as any).gtag?.("set", "debug_mode", true);
        } catch {
          /* noop */
        }

        if (DEBUG || process.env.NODE_ENV !== "production") {
          console.info("[analytics] GA4 ready");
        }

        // util: ganchos para testar do console
        (window as any).__ANALYTICS_TEST = () =>
          trackEvent("debug_test", { ts: Date.now() });

        return true;
      } catch (e) {
        console.error("[analytics] init error", e);
        return false;
      }
    })();
  }
}

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  await ready?.catch(() => {});
  return analytics;
}

/** Envia evento. Em dev/DEBUG sempre loga no console. */
export async function trackEvent(
  name: string,
  params?: Record<string, unknown>
) {
  if (DEBUG || process.env.NODE_ENV !== "production") {
    console.debug("[analytics:event]", name, params || {});
    (window as any).__ANALYTICS_TAP?.(name, params);
  }

  const a = await getAnalyticsInstance();
  if (!a) return;

  try {
    const payload = {
      ...(params || {}),
      ...(DEBUG ? { debug_mode: 1 } : {}),
    };
    logEvent(a, name as any, payload);
  } catch (e) {
    if (DEBUG || process.env.NODE_ENV !== "production") {
      console.warn("[analytics] logEvent failed", e);
    }
  }
}