import ClientShell from '@/components/ClientShell';
import SpecialistForm from './SpecialistForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function NewSpecialistPage() {
  return (
    <ClientShell>
      <SpecialistForm />
    </ClientShell>
  );
}