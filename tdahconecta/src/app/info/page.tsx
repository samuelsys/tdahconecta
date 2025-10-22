import ClientShell from '@/components/ClientShell';
import InfoClient from './InfoClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function InfoPage() {
  return (
    <ClientShell>
      <InfoClient />
    </ClientShell>
  );
}