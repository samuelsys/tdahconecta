// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Tdah Conecta',
  description: 'MarketPlace Tdag',
  keywords:
    'colocar keywords',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* fontes/ícones do projeto antigo */}
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://use.fontawesome.com/releases/v5.15.3/css/all.css"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* shell do cliente com navbar/footer/toaster/cookies */}
        {children}
      </body>
    </html>
  );
}