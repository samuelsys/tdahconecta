// src/components/NavBar.tsx
'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import styles from '@/styles/navbar.module.css';

export default function NavBar() {
  const [open, setOpen] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const onResize = () => setOpen(window.innerWidth > 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        setLogged(Boolean(data?.user));
      } catch {
        setLogged(false);
      }
    };
    check();
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <Link href="/">TDAH CONECTA</Link>
      </div>

      <button
        className={styles.hamburger}
        onClick={() => setOpen((v) => !v)}
        aria-label="menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`${styles.links} ${open ? styles.isOpen : ''}`}>
        <li><Link href="/specialists">Especialistas</Link></li>
        <li><Link href="/info">Perfil</Link></li>

        {!logged && (
          <>
            <li><Link href="/auth/login">Entrar</Link></li>
            <li><Link href="/auth/signup">Cadastrar</Link></li>
          </>
        )}

      </ul>
    </nav>
  );
}