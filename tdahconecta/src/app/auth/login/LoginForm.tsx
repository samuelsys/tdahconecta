// src/app/auth/login/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  type UserCredential,
} from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import { auth } from '@/firebase/client';
import styles from '@/styles/auth-form.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const setSession = async (idToken: string) => {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        // mantém compatível com o legado
        router.push('/auth/verify-email');
        return;
      }

      const idToken = await cred.user.getIdToken();
      await setSession(idToken);

      // opcional: desloga do client para usar só session-cookie.
      // await auth.signOut();

      router.push('/info');
    } catch (err) {
      const fb = err as FirebaseError;
      setErrorMsg(fb.message ?? 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result: UserCredential = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();
      await setSession(idToken);

      router.push('/info');
    } catch (err) {
      const fb = err as FirebaseError;
      setErrorMsg(fb.message ?? 'Erro no login com Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Entrar</h1>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <form onSubmit={handleEmailLogin} className={styles.form}>
        <input
          className={styles.input}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required
        />

        <button className={`${styles.button} btn btn-primary`} type="submit" disabled={loading}>
          {loading ? 'Carregando…' : 'Entrar'}
        </button>

        <div className={styles.linksContainer}>
          <a className={styles.link} href="/auth/forgot-password">Esqueci minha senha</a>
          <a className={styles.link} href="/auth/signup">Criar conta</a>
        </div>
      </form>

      <div className={styles.separator}>ou</div>

      <button
        className={`${styles.googleButton} btn`}
        onClick={handleGoogleLogin}
        disabled={loading}
        type="button"
        aria-label="Entrar com Google"
      >
        Entrar com Google
      </button>
    </section>
  );
}