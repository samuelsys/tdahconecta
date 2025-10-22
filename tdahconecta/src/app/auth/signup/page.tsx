// src/app/auth/signup/page.tsx
import ClientShell from '@/components/ClientShell';
import SignUpForm from './SignUpForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SignUpPage() {
  return (
    <ClientShell>
      <SignUpForm />
    </ClientShell>
  );
}