'use client';

import styles from '@/styles/products-v2.module.css';

type Props = {
  s: {
    id: string;
    fullName: string;
    profession: string;
    avatarUrl?: string;
    primaryCondition?: string;
    tags: string[];
    languages: string[];
    modality?: string;
    priceFrom?: number | null;
    city?: string;
    state?: string;
    acceptsInsurance?: boolean;
    rating: number;
    reviewsCount: number;
    sessionsCount: number;
  };
};

export default function SpecialistTile({ s }: Props) {
  const locale =
    s.city && s.state ? `${s.city}/${s.state}` : s.city || s.state || '—';

  return (
    <div className={styles.tile}>
      <img
        src={s.avatarUrl ?? '/avatar-placeholder.png'}
        alt={s.fullName}
        className={styles.tileImg}
      />

      <h3 className={styles.h3}>{s.fullName}</h3>
      <div className={styles.platformTag}>{s.profession}</div>

      <div style={{ marginBottom: 8 }}>
        {locale} · {s.modality ?? '—'}
      </div>

      {/* Indicadores (novo layout) */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span className={styles.statIcon}>★</span> Avaliação
          </div>
          <div className={styles.statValue}>{s.rating.toFixed(1)}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span className={styles.statIcon}>👥</span> Atendimentos
          </div>
          <div className={styles.statValue}>{s.sessionsCount}</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Condição foco:</strong> {s.primaryCondition ?? '—'}
      </div>

      {s.tags?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <strong>Tags:</strong> {s.tags.join(' · ')}
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <strong>Preço a partir de:</strong>{' '}
        {typeof s.priceFrom === 'number' ? `R$ ${s.priceFrom.toFixed(0)}` : '—'}
      </div>

      <div className={styles.actions}>
        <button className={styles.buttonCard}>Ver perfil</button>
        <button className={styles.buttonCard}>Agendar</button>
      </div>
    </div>
  );
}