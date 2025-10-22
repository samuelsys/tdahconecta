'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '@/styles/products-v2.module.css'; // reaproveitando o CSS
import SpecialistsFilter from './SpecialistsFilter';
import SpecialistTile from './SpecialistTile';

type Specialist = {
  id: string;
  fullName: string;
  profession: 'Psicologia' | 'Psiquiatria' | 'Neuropsicologia' | 'Terapia Ocupacional' | 'Outros';
  avatarUrl?: string;
  primaryCondition?: string;
  tags: string[];
  languages: string[];
  modality?: 'online' | 'presencial' | 'híbrido';
  priceFrom?: number | null;
  city?: string;
  state?: string;
  acceptsInsurance?: boolean;
  rating: number;
  reviewsCount: number;
  sessionsCount: number;
};

type Range = [number, number];

function debounce<T extends (...args: any[]) => void>(fn: T, delay = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function SpecialistsHome() {
  const [items, setItems] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(false);

  // filtros
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [city, setCity] = useState('');
  const [stateUF, setStateUF] = useState('');
  const [modality, setModality] = useState('');
  const [language, setLanguage] = useState('');
  const [acceptsInsurance, setAcceptsInsurance] = useState<'' | boolean>('');
  const [priceRange, setPriceRange] = useState<Range>([0, 600]);

  // paginação
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [pageInfo, setPageInfo] = useState('');

  const doFetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/specialists/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          profession,
          city,
          state: stateUF,
          modality,
          language,
          acceptsInsurance,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          page,
          pageSize,
        }),
      });
      const data = await res.json();
      setItems(data.specialists ?? []);
      setHasPrev(Boolean(data.hasPreviousPage));
      setHasNext(Boolean(data.hasNextPage));
      const totalPages = Math.max(1, Math.ceil((data.total ?? 0) / (data.pageSize ?? pageSize)));
      setPageInfo(`Página ${data.page ?? page} de ${totalPages}`);
    } finally {
      setLoading(false);
    }
  }, [name, profession, city, stateUF, modality, language, acceptsInsurance, priceRange, page]);

  const debouncedFetch = useMemo(() => debounce(doFetch, 400), [doFetch]);

  // dispara busca
  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  // handlers de filtro
  const onName = (v: string) => { setPage(1); setName(v); };
  const onProfession = (v: string) => { setPage(1); setProfession(v); };
  const onCity = (v: string) => { setPage(1); setCity(v); };
  const onState = (v: string) => { setPage(1); setStateUF(v); };
  const onModality = (v: string) => { setPage(1); setModality(v); };
  const onLanguage = (v: string) => { setPage(1); setLanguage(v); };
  const onAccepts = (v: '' | boolean) => { setPage(1); setAcceptsInsurance(v); };
  const onPrice = (min: number, max: number) => { setPage(1); setPriceRange([min, max]); };

  return (
    <div className={styles.container}>
      <SpecialistsFilter
        name={name}
        profession={profession}
        city={city}
        stateUF={stateUF}
        modality={modality}
        language={language}
        acceptsInsurance={acceptsInsurance}
        minPrice={priceRange[0]}
        maxPrice={priceRange[1]}
        onName={onName}
        onProfession={onProfession}
        onCity={onCity}
        onState={onState}
        onModality={onModality}
        onLanguage={onLanguage}
        onAcceptsInsurance={onAccepts}
        onPriceChange={onPrice}
        loading={loading}
      />

      {loading ? (
        <div className={styles.centered}>Carregando…</div>
      ) : (
        <div className={styles.resultsSection}>
          {items.map(sp => (
            <SpecialistTile key={sp.id} s={sp} />
          ))}
        </div>
      )}

      {!loading && (
        <div className={styles.paginationButtons}>
          {hasPrev && <button onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</button>}
          <div className={styles.paginationInfo}>{pageInfo}</div>
          {hasNext && <button onClick={() => setPage(p => p + 1)}>Próximo</button>}
        </div>
      )}
    </div>
  );
}