// src/firebase/admin.ts
import 'server-only';
import admin from 'firebase-admin';

// ⚠️ NÃO COMMITAR ESTE ARQUIVO JSON
// Requer tsconfig com "resolveJsonModule": true
// Arquivo: src/firebase/credentialsFirebase.json
// Ex.: { "type":"service_account", "project_id":"...", "private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n", "client_email":"..." }
const serviceAccount = require('./credentialsFirebase.json');

if (!admin.apps.length) {
  // logs estilo legado (opcional)
  console.log('############################');
  console.log('############################');
  console.log('apps: ' + admin.apps.length);
  console.log('############################');
  console.log('############################');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      // garante que quebras de linha estão corretas
      privateKey: serviceAccount.private_key?.replace(/\\n/g, '\n'),
    }),
    // mantenha se usar RTDB; se não, pode remover
    databaseURL: 'https://affilialert-7f957-default-rtdb.firebaseio.com',
  });
}

// exporta igual ao legado
export { admin };