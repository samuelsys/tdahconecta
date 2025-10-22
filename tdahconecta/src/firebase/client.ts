// src/firebase/client.ts
'use client';

import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  // opcional:
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// singleton app
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(clientCredentials);

// auth + persistência de sessão no navegador (igual legado)
const auth: Auth = getAuth(app);
setPersistence(auth, browserSessionPersistence).catch(() => { /* ignore */ });

// provider Google com consent (igual legado)
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  access_type: 'offline',
  prompt: 'consent',
});

const firestore: Firestore = getFirestore(app);

// storage com bucket explícito (igual legado)
const storage: FirebaseStorage = getStorage(app, clientCredentials.storageBucket);

// analytics só no client e quando suportado
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((ok) => {
      if (ok) analytics = getAnalytics(app);
    })
    .catch(() => { /* sem suporte (SSR/Edge), mantem null */ });
}

export { app, auth, provider, firestore, storage, analytics };