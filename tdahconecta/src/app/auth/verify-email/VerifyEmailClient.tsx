// src/app/auth/verify-email/VerifyEmailClient.tsx
'use client';

import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/firebase/client';
import styles from '@/styles/home.module.css';
import Link from 'next/link';

export default function VerifyEmailClient() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', { page_path: '/auth/verify-email' });
    }
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Verificar E-mail</h1>
        <p className={styles.description}>
          Enviamos um link de verificação para o seu e-mail.
          <br />
          Verifique sua caixa de entrada (e também o spam) para continuar.
        </p>

        <Link href="/" className={styles.button} style={{ marginTop: 16 }}>
          Voltar à Home
        </Link>
      </main>
    </div>
  );
}