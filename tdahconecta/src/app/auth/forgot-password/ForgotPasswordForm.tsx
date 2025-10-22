// src/app/auth/forgot-password/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/client';
import styles from '@/styles/auth-form.module.css';

export default function ForgotPasswordForm() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError]     = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('sent');
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Erro ao enviar email de redefinição.';
      setError(message);
      setStatus('error');
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Redefinir senha</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="email"
          required
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className={styles.button}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Enviando…' : 'Enviar link de redefinição'}
        </button>
      </form>

      {status === 'sent'  && <p className={styles.description}>Verifique seu e-mail para o link de redefinição.</p>}
      {status === 'error' && <p className={styles.error}>{error}</p>}
    </main>
  );
}