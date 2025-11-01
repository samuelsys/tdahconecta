// src/lib/firebaseAdmin.ts
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | undefined;

function initAdminApp(): App {
  if (getApps().length) return getApps()[0];

  // Opção A: usar o JSON inteiro em base64
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) {
    const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
    adminApp = initializeApp({ credential: cert(json) });
    return adminApp;
  }

  // Opção B: usar variáveis separadas
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey?.startsWith('"') && privateKey.endsWith('"')) {
    // remove aspas adicionadas por shell
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey) {
    // converte \n literais em quebras reais
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    return adminApp;
  }

  // Se chegou aqui, falta configuração
  throw new Error(
    'Firebase Admin não configurado. Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY.'
  );
}

export const app = initAdminApp();
export const adminAuth = getAuth(app);

// Export compatível com código legado: admin.auth().xxxxx
export const admin = {
  auth: () => adminAuth,
};