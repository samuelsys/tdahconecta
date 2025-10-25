'use client';

import { useState } from 'react';
import styles from '@/styles/specialist-form.module.css';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';
import { uploadImageFile } from '@/lib/uploadImage';

type Form = {
  fullName: string;
  profession: 'Psicologia' | 'Psiquiatria' | 'Neuropsicologia' | 'Terapia Ocupacional' | 'Outros';
  crp: string;
  yearsExperience: number | '';
  avatarUrl: string; // será preenchido após upload
  primaryCondition: string;
  tags: string;        // string separada por vírgulas
  languages: string;   // string separada por vírgulas
  bio: string;
  modality: 'online' | 'presencial' | 'híbrido';
  priceFrom: number | '';
  city: string;
  state: string;
  whatsapp: string;
  website: string;
  instagram: string;
  bookingUrl: string;
};

export default function SpecialistForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

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
      // Upload da foto (se houver)
      let avatarUrl = f.avatarUrl || '';
      if (photoFile) {
        const auth = getAuth();
        const uid = auth.currentUser?.uid || 'anonymous';
        avatarUrl = await uploadImageFile(photoFile, uid, 'avatars');
      }

      const res = await fetch('/api/specialists/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...f,
          avatarUrl,
          yearsExperience: f.yearsExperience ? Number(f.yearsExperience) : 0,
          priceFrom: f.priceFrom ? Number(f.priceFrom) : null,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Falha ao salvar');
      }

      toast.success('Especialista cadastrado!');
      router.push('/info');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Cadastro de Especialista</h1>
        <p className={styles.subtitle}>
          Complete as informações abaixo. Você poderá alterar depois nas configurações.
        </p>
      </header>

      <form onSubmit={submit} className={styles.formCard}>
        {/* Seção: dados básicos */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dados básicos</h2>
            <p className={styles.sectionHint}>Informações públicas do seu perfil.</p>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Nome completo*</span>
              <input
                className={styles.input}
                value={f.fullName}
                onChange={(e) => onChange('fullName', e.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Profissão</span>
              <select
                className={styles.input}
                value={f.profession}
                onChange={(e) => onChange('profession', e.target.value as Form['profession'])}
              >
                <option>Psicologia</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>CRP/CRM</span>
              <input
                className={styles.input}
                placeholder="CRP: 03/22212"
                value={f.crp}
                onChange={(e) => onChange('crp', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Anos de experiência</span>
              <input
                className={styles.input}
                type="number"
                min={0}
                value={f.yearsExperience}
                onChange={(e) =>
                  onChange('yearsExperience', e.target.value ? Number(e.target.value) : '')
                }
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Condição principal</span>
              <input
                className={styles.input}
                placeholder="Ex.: TDAH"
                value={f.primaryCondition}
                onChange={(e) => onChange('primaryCondition', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Idiomas</span>
              <input
                className={styles.input}
                placeholder="Português, Inglês"
                value={f.languages}
                onChange={(e) => onChange('languages', e.target.value)}
              />
            </label>

            <label className={styles.field + ' ' + styles.full}>
              <span className={styles.label}>Tags/Especialidades</span>
              <input
                className={styles.input}
                placeholder="Ansiedade, Autoestima, Cirurgia Bariátrica"
                value={f.tags}
                onChange={(e) => onChange('tags', e.target.value)}
              />
              <span className={styles.help}>Separe por vírgulas.</span>
            </label>

            {/* Foto de perfil - upload */}
            <label className={styles.field + ' ' + styles.full}>
              <span className={styles.label}>Foto de perfil</span>

              <div className={styles.uploadBox}>
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Pré-visualização"
                    className={styles.uploadPreview}
                  />
                ) : (
                  <div className={styles.uploadEmpty}>
                    <span className={styles.uploadIcon}>📷</span>
                    <span className={styles.uploadText}>Selecione uma imagem (JPG/PNG)</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setPhotoFile(file);
                    setPhotoPreview(file ? URL.createObjectURL(file) : '');
                  }}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Seção: atendimento */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Atendimento</h2>
            <p className={styles.sectionHint}>Informações sobre sua prática clínica.</p>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Modalidade</span>
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
              <span className={styles.label}>Valor (a partir de)</span>
              <input
                className={styles.input}
                type="number"
                min={0}
                placeholder="ex: 120"
                value={f.priceFrom}
                onChange={(e) =>
                  onChange('priceFrom', e.target.value ? Number(e.target.value) : '')
                }
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Cidade</span>
              <input
                className={styles.input}
                value={f.city}
                onChange={(e) => onChange('city', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>UF</span>
              <input
                className={styles.input}
                maxLength={2}
                placeholder="SC"
                value={f.state}
                onChange={(e) => onChange('state', e.target.value.toUpperCase())}
              />
            </label>

            <label className={styles.field + ' ' + styles.full}>
              <span className={styles.label}>Bio/Descrição</span>
              <textarea
                className={styles.textarea}
                rows={6}
                placeholder="Fale sobre sua experiência, linhas de cuidado, etc."
                value={f.bio}
                onChange={(e) => onChange('bio', e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Seção: contatos */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Contatos</h2>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>WhatsApp</span>
              <input
                className={styles.input}
                placeholder="55 48 9 9999-9999"
                value={f.whatsapp}
                onChange={(e) => onChange('whatsapp', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Website</span>
              <input
                className={styles.input}
                placeholder="https://..."
                value={f.website}
                onChange={(e) => onChange('website', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Instagram</span>
              <input
                className={styles.input}
                placeholder="@seu_perfil"
                value={f.instagram}
                onChange={(e) => onChange('instagram', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Link de Agendamento</span>
              <input
                className={styles.input}
                placeholder="Calendly/Agenda"
                value={f.bookingUrl}
                onChange={(e) => onChange('bookingUrl', e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </button>
          <button disabled={loading} className={styles.btnPrimary} type="submit">
            {loading ? 'Salvando…' : 'Salvar especialista'}
          </button>
        </div>
      </form>
    </section>
  );
}