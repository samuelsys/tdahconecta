// src/lib/firebaseClient.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

/** Sanitize env (trim and turn empty -> undefined) */
const clean = (v?: string) => (v ?? '').trim() || undefined;

const firebaseConfig = {
  apiKey: clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: clean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: clean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  // measurementId é opcional no client
  measurementId: clean(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
} as const;

/**
 * Em ambiente de browser, falhe cedo com mensagem clara
 * se alguma env essencial estiver ausente. Isso evita o erro
 * genérico "Firebase: Error (auth/invalid-api-key)".
 */
if (typeof window !== 'undefined') {
  for (const [k, v] of Object.entries(firebaseConfig)) {
    if (k === 'measurementId') continue; // opcional
    if (!v) {
      throw new Error(
        `Firebase client: variável de ambiente faltando (${k}). `
        + `Verifique seu .env.local e reinicie o dev server.`
      );
    }
  }
}

// Singleton do app
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// SDKs principais
const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Analytics — inicialize somente no client e quando suportado
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  // fire-and-forget; consumidores devem lidar com null
  isSupported()
    .then((ok) => {
      if (ok) {
        try {
          analytics = getAnalytics(app);
        } catch {
          // silencioso: alguns ambientes bloqueiam Analytics
          analytics = null;
        }
      }
    })
    .catch(() => {
      analytics = null;
    });
}

export { app, auth, firestore, storage, googleProvider, analytics };