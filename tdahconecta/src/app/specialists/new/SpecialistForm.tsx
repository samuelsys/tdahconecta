'use client';

import { useState } from 'react';
import styles from '@/styles/specialist-form.module.css';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Form = {
  fullName: string;
  profession: 'Psicologia' | 'Psiquiatria' | 'Neuropsicologia' | 'Terapia Ocupacional' | 'Outros';
  crp: string;
  yearsExperience: number | '';
  avatarUrl: string;
  primaryCondition: string;
  tags: string;        // input como string separada por vírgula
  languages: string;   // idem (ex: "Português, Inglês")
  bio: string;
  modality: 'online' | 'presencial' | 'híbrido';
  priceFrom: number | '';
  city: string;
  state: string;
  acceptsInsurance: boolean;
  whatsapp: string;
  website: string;
  instagram: string;
  bookingUrl: string;
};

export default function SpecialistForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState<Form>({
    fullName: '',
    profession: 'Psicologia',
    crp: '',
    yearsExperience: '',
    avatarUrl: '',
    primaryCondition: 'TDAH',
    tags: '',
    languages: 'Português',
    bio: '',
    modality: 'online',
    priceFrom: '',
    city: '',
    state: '',
    acceptsInsurance: false,
    whatsapp: '',
    website: '',
    instagram: '',
    bookingUrl: '',
  });

  const onChange = (k: keyof Form, v: any) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.fullName) {
      toast.error('Informe o nome completo');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/specialists/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...f,
          yearsExperience: f.yearsExperience ? Number(f.yearsExperience) : 0,
          priceFrom: f.priceFrom ? Number(f.priceFrom) : null,
          // strings -> arrays serão tratados na API (tags/languages)
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Falha ao salvar');
      }

      toast.success('Especialista cadastrado!');
      router.push('/info'); // ou para uma listagem /specialists
    } catch (err: any) {
      toast.error(err.message ?? 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Cadastro de Especialista</h1>
      <form onSubmit={submit} className={styles.form}>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Nome completo*</span>
            <input
              className={styles.input}
              value={f.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            <span>Profissão</span>
            <select
              className={styles.input}
              value={f.profession}
              onChange={(e) => onChange('profession', e.target.value as Form['profession'])}
            >
              <option>Psicologia</option>
              <option>Psiquiatria</option>
              <option>Neuropsicologia</option>
              <option>Terapia Ocupacional</option>
              <option>Outros</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>CRP/CRM</span>
            <input
              className={styles.input}
              placeholder="CRP: 03/22212"
              value={f.crp}
              onChange={(e) => onChange('crp', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Anos de experiência</span>
            <input
              className={styles.input}
              type="number"
              min={0}
              value={f.yearsExperience}
              onChange={(e) => onChange('yearsExperience', e.target.value ? Number(e.target.value) : '')}
            />
          </label>

          <label className={styles.field}>
            <span>Condição principal</span>
            <input
              className={styles.input}
              placeholder="Ex.: TDAH"
              value={f.primaryCondition}
              onChange={(e) => onChange('primaryCondition', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Tags/Especialidades</span>
            <input
              className={styles.input}
              placeholder="Ansiedade, Autoestima, Cirurgia Bariátrica"
              value={f.tags}
              onChange={(e) => onChange('tags', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Idiomas</span>
            <input
              className={styles.input}
              placeholder="Português, Inglês"
              value={f.languages}
              onChange={(e) => onChange('languages', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Modalidade</span>
            <select
              className={styles.input}
              value={f.modality}
              onChange={(e) => onChange('modality', e.target.value as Form['modality'])}
            >
              <option value="online">Online</option>
              <option value="presencial">Presencial</option>
              <option value="híbrido">Híbrido</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Valor (a partir de)</span>
            <input
              className={styles.input}
              type="number"
              min={0}
              placeholder="ex: 120"
              value={f.priceFrom}
              onChange={(e) => onChange('priceFrom', e.target.value ? Number(e.target.value) : '')}
            />
          </label>

          <label className={styles.field}>
            <span>Cidade</span>
            <input
              className={styles.input}
              value={f.city}
              onChange={(e) => onChange('city', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>UF</span>
            <input
              className={styles.input}
              maxLength={2}
              placeholder="SC"
              value={f.state}
              onChange={(e) => onChange('state', e.target.value.toUpperCase())}
            />
          </label>

          <label className={styles.field}>
            <span>Foto (URL)</span>
            <input
              className={styles.input}
              placeholder="https://..."
              value={f.avatarUrl}
              onChange={(e) => onChange('avatarUrl', e.target.value)}
            />
          </label>

          <label className={styles.fieldCheckbox}>
            <input
              type="checkbox"
              checked={f.acceptsInsurance}
              onChange={(e) => onChange('acceptsInsurance', e.target.checked)}
            />
            <span>Aceita convênio</span>
          </label>
        </div>

        <label className={styles.field}>
          <span>Bio/Descrição</span>
          <textarea
            className={styles.textarea}
            rows={6}
            placeholder="Fale sobre sua experiência, linhas de cuidado, etc."
            value={f.bio}
            onChange={(e) => onChange('bio', e.target.value)}
          />
        </label>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span>WhatsApp</span>
            <input
              className={styles.input}
              placeholder="55 48 9 9999-9999"
              value={f.whatsapp}
              onChange={(e) => onChange('whatsapp', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Website</span>
            <input
              className={styles.input}
              placeholder="https://..."
              value={f.website}
              onChange={(e) => onChange('website', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Instagram</span>
            <input
              className={styles.input}
              placeholder="@seu_perfil"
              value={f.instagram}
              onChange={(e) => onChange('instagram', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Link de Agendamento</span>
            <input
              className={styles.input}
              placeholder="Calendly/Agenda"
              value={f.bookingUrl}
              onChange={(e) => onChange('bookingUrl', e.target.value)}
            />
          </label>
        </div>

        <div className={styles.actions}>
          <button disabled={loading} className={`${styles.button} btn btn-primary`} type="submit">
            {loading ? 'Salvando…' : 'Salvar especialista'}
          </button>
        </div>
      </form>
    </section>
  );
}