import ClientShell from '@/components/ClientShell';
import SpecialistsHome from './specialists/SpecialistsHome';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <ClientShell>
      <SpecialistsHome />
    </ClientShell>
  );
}