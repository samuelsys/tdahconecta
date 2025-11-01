// src/app/specialists/SpecialistsListClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type SpecialistListItem = {
  id: string;
  fullName?: string;
  profession?: string;
  city?: string;
  state?: string;
};

export default function SpecialistsListClient() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SpecialistListItem[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/specialists', { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar especialistas');
        const data = await res.json();
        setItems(data || []);
      } catch (e: any) {
        setError(e?.message ?? 'Erro ao carregar');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main style={{ maxWidth: 960, margin: '32px auto', padding: '0 16px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Especialistas</h1>
        <Link
          href="/specialists/new"
          className="btn btn-primary"
          style={{
            background: '#10b981',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          + Cadastrar especialista
        </Link>
      </header>

      {loading && <p>Carregando…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <p>Nenhum especialista ainda.</p>
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
        {items.map((s) => (
          <li
            key={s.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{s.fullName ?? '(sem nome)'}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                {s.profession ?? '—'} · {(s.city || s.state) ? `${s.city ?? ''}${s.city && s.state ? ' - ' : ''}${s.state ?? ''}` : 'Local não informado'}
              </div>
            </div>

            {/* Se quiser depois: link para editar /specialists/[id] */}
            {/* <Link href={`/specialists/${s.id}`} style={{ textDecoration: 'none' }}>Editar</Link> */}
          </li>
        ))}
      </ul>
    </main>
  );
}