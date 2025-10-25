import ClientShell from '@/components/ClientShell';
import PatientForm from './PatientForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PatientsPage() {
  return (
    <ClientShell>
      <PatientForm />
    </ClientShell>
  );
}