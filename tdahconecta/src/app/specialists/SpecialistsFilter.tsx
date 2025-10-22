'use client';

import styles from '@/styles/products-v2.module.css';
import { ChangeEvent } from 'react';

type Props = {
  name: string;
  profession: string;
  city: string;
  stateUF: string;
  modality: string;
  language: string;
  acceptsInsurance: '' | boolean;
  minPrice: number;
  maxPrice: number;
  loading?: boolean;

  onName: (v: string) => void;
  onProfession: (v: string) => void;
  onCity: (v: string) => void;
  onState: (v: string) => void;
  onModality: (v: string) => void;
  onLanguage: (v: string) => void;
  onAcceptsInsurance: (v: '' | boolean) => void;
  onPriceChange: (min: number, max: number) => void;
};

export default function SpecialistsFilter(props: Props) {
  const {
    name, profession, city, stateUF, modality, language, acceptsInsurance, minPrice, maxPrice, loading,
    onName, onProfession, onCity, onState, onModality, onLanguage, onAcceptsInsurance, onPriceChange
  } = props;

  const onPriceMin = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value || 0);
    onPriceChange(v, maxPrice);
  };
  const onPriceMax = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value || 0);
    onPriceChange(minPrice, v);
  };

  return (
    <section className={styles.filterSection}>
      <h2 className={styles.h2}>Encontre especialistas</h2>

      <div className={styles.filterRow}>
        <div className={styles.filterRowDiv}>
          <input
            className={styles.selectInput}
            placeholder="Nome, condição ou tag"
            value={name}
            onChange={(e) => onName(e.target.value)}
          />
        </div>

        <div className={styles.filterRowDiv}>
          <select className={styles.selectInput} value={profession} onChange={(e) => onProfession(e.target.value)}>
            <option value="">Profissão</option>
            <option value="Psicologia">Psicologia</option>
            <option value="Psiquiatria">Psiquiatria</option>
            <option value="Neuropsicologia">Neuropsicologia</option>
            <option value="Terapia Ocupacional">Terapia Ocupacional</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div className={styles.filterRowDiv}>
          <select className={styles.selectInput} value={modality} onChange={(e) => onModality(e.target.value)}>
            <option value="">Modalidade</option>
            <option value="online">Online</option>
            <option value="presencial">Presencial</option>
            <option value="híbrido">Híbrido</option>
          </select>
        </div>

        <div className={styles.filterRowDiv}>
          <input
            className={styles.selectInput}
            placeholder="Cidade"
            value={city}
            onChange={(e) => onCity(e.target.value)}
          />
        </div>

        <div className={styles.filterRowDiv}>
          <input
            className={styles.selectInput}
            placeholder="Estado (UF)"
            value={stateUF}
            onChange={(e) => onState(e.target.value)}
          />
        </div>
      </div>

      {loading && <div style={{ marginTop: 10 }}>Filtrando…</div>}
    </section>
  );
}