// src/components/CookieConsentBanner.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/cookie-consent-banner.module.css';

export default function CookieConsentBanner({ onConsentGiven }: { onConsentGiven: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ga_consent');
    if (consent === null) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('ga_consent', 'true');
    setVisible(false);
    onConsentGiven();
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'consent_given', { non_interaction: true });
    }
  };

  const decline = () => {
    localStorage.setItem('ga_consent', 'false');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <p>Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa política de privacidade.</p>
      <div className={styles.actions}>
        <button onClick={accept} className={styles.accept}>Aceitar</button>
        <button onClick={decline} className={styles.decline}>Recusar</button>
      </div>
    </div>
  );
}