'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/info.module.css';
import Link from 'next/link';

type MeResponse = {
  user: { uid: string; email: string | null; emailVerified: boolean } | null;
};

export default function InfoClient() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse['user']>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = (await res.json()) as MeResponse;
      setMe(data.user);
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    // força revalidação do layout/nav
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.centered}>Carregando…</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {me ? (
        <div className={styles.profile}>
          <h1>Perfil</h1>
          <p>E-mail: {me.email}</p>
          <button onClick={handleLogout} className={styles.button}>Sair</button>
        </div>
      ) : (
        <div className={styles.loginPrompt}>
          <h2>Você não está logado</h2>
          <p>Faça login para acessar seu perfil.</p>
          <Link href="/auth/login"><button className={styles.loginButton}>Login</button></Link>
          <Link href="/auth/signup"><button className={styles.loginButton}>Cadastro</button></Link>
        </div>
      )}
    </div>
  );
}