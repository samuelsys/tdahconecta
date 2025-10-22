import 'server-only';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
    });
  } else {
    // Fallback local (apenas se o arquivo existir; NÃO usa require com string literal)
    const localPath = path.join(process.cwd(), 'src', 'firebase', 'credentialsFirebase.local.json');

    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, 'utf-8');
      const serviceAccount = JSON.parse(raw);

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: String(serviceAccount.private_key || '').replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
      });
    } else {
      throw new Error(
        'Firebase Admin não configurado. Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY ' +
          'ou crie src/firebase/credentialsFirebase.local.json (gitignored) para uso local.'
      );
    }
  }
}

export { admin };