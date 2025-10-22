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
  const location =
    s.city && s.state ? `${s.city}/${s.state}` : s.city || s.state || '—';

  const tags = s.tags?.slice?.(0, 3) ?? [];
  const extra = (s.tags?.length ?? 0) - tags.length;

  return (
    <div className={styles.tile}>
      <img
        src={s.avatarUrl ?? '/avatar-placeholder.png'}
        alt={s.fullName}
        className={styles.tileImg}
      />

      {/* header */}
      <div className={styles.tileHeader}>
        <h3 className={styles.cardTitleSm}>{s.fullName}</h3>
        <span className={styles.badgeGreen}>{s.profession}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaText}>{location}</span>
        <span className={styles.dot} />
        <span className={styles.metaText}>{s.modality ?? '—'}</span>
      </div>

      {/* indicadores compactos */}
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

      {/* infos */}
      {/* Condição foco */}
    <div className={styles.infoBlock}>
    <span className={`${styles.pill} ${styles.pillAccent}`}>
        {s.primaryCondition ?? '—'}
    </span>
     {tags.map((t) => (
        <span key={t} className={styles.pill}>{t}</span>
        ))}
        {extra > 0 && (
        <span className={`${styles.pill} ${styles.pillMore}`}>+{extra}</span>
        )}
    </div>

    {/* Tags em pílulas */}
    <div className={styles.infoBlock}>
    <span className={styles.infoLabel}></span>
    <div className={styles.pillRow}>
       
    </div>
    </div>

      <div className={styles.footerRow}>
        <div className={styles.pricePill}>
          a partir de <strong>R$ {s.priceFrom ? s.priceFrom.toFixed(0) : '—'}</strong>
        </div>

        <div className={styles.ctaRow}>
          <button className={styles.buttonCard}>Ver perfil</button>
          <button className={styles.buttonCardOutline}>Agendar</button>
        </div>
      </div>
    </div>
  );
}