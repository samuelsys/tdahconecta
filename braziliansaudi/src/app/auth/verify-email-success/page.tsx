// server wrapper
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import VerifyEmailSuccessClient from './VerifyEmailSuccessClient';

export default function Page() {
  return <VerifyEmailSuccessClient />;
}