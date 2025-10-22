// src/app/specialists/page.tsx
import SpecialistsListClient from './SpecialistsListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SpecialistsPage() {
  return <SpecialistsListClient />;
}