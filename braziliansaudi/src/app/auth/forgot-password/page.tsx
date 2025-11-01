// src/app/auth/forgot-password/page.tsx
import ClientShell from '@/components/ClientShell';
import ForgotPasswordForm from './ForgotPasswordForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ForgotPasswordPage() {
  return (
    <ClientShell>
      <ForgotPasswordForm />
    </ClientShell>
  );
}