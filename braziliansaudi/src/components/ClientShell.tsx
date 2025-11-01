// src/components/ClientShell.tsx
'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import Analytics from '@/components/Analytics';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Analytics />
      <Toaster position="bottom-center" />
      <NavBar />
      <main className="container-main">{children}</main>
      <Footer />
      <CookieConsentBanner onConsentGiven={() => {}} />
    </>
  );
}