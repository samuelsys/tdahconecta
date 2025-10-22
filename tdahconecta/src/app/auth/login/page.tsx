// src/app/auth/login/page.tsx
import ClientShell from '@/components/ClientShell';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginPage() {
  return (
    <ClientShell>
      <LoginForm />
    </ClientShell>
  );
}