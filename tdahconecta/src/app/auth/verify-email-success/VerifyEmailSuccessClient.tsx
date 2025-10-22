// src/app/auth/verify-email-success/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import styles from '@/styles/home.module.css';
import Link from 'next/link';

export default function Page() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>E-mail verificado com sucesso!</h1>
        <p className={styles.description}>Você já pode fazer login.</p>
        <Link href="/auth/login" className={styles.button}>Ir para Login</Link>
      </main>
    </div>
  );
}