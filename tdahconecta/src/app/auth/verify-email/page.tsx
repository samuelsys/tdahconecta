// server wrapper (segue nosso padrão)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import VerifyEmailClient from './VerifyEmailClient';

export default function Page() {
  return <VerifyEmailClient />;
}