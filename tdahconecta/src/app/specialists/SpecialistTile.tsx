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
        {s.city && s.state ? `${s.city}/${s.state}` : s.city || s.state || '—'} · {s.modality ?? '—'}
      </div>

      <div className={styles.card}>
        <div className={styles.column}>
          <div className={styles.tag}>Avaliação</div>
          <div className={styles.value}>{s.rating.toFixed(1)} ★</div>
        </div>
        <div className={styles.column}>
          <div className={styles.tag}>Atendimentos</div>
          <div className={styles.value}>{s.sessionsCount}</div>
        </div>
        <div className={styles.column}>
          <div className={styles.tag}>Opiniões</div>
          <div className={styles.value}>{s.reviewsCount}</div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Condição foco:</strong> {s.primaryCondition ?? '—'}
      </div>

      {s.tags?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <strong>Tags:</strong> {s.tags.join(' · ')}
        </div>
      )}

      <div style={{ marginTop: 6 }}>
        <strong>Idiomas:</strong> {s.languages.join(' · ')}
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Preço a partir de:</strong> {s.priceFrom ? `R$ ${s.priceFrom.toFixed(0)}` : '—'}
        {s.acceptsInsurance ? ' · aceita convênio' : ''}
      </div>

      <div className={styles.actions}>
        <button className={styles.buttonCard}>Ver perfil</button>
        <button className={styles.buttonCard}>Agendar</button>
      </div>
    </div>
  );
}