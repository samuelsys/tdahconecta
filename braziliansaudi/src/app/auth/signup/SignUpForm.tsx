// src/app/auth/signup/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import { auth } from '@/firebase/client';
import styles from '@/styles/auth-form.module.css';

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      await sendEmailVerification(cred.user, { url: `${origin}/auth/verify-email-success` });

      // opcional: manter usuário logado até verificar ou deslogar já
      // await auth.signOut();

      router.push('/auth/verify-email');
    } catch (err) {
      const fb = err as FirebaseError;
      setErrorMsg(fb.message ?? 'Erro no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Cadastro</h1>
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      <form onSubmit={handleSignup} className={styles.form}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
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
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Carregando…' : 'Cadastrar'}
        </button>
      </form>
    </main>
  );
}