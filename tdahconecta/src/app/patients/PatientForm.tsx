'use client';

import { useRef, useState } from 'react';
import styles from '@/styles/patient-form.module.css';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Form = {
  fullName: string;
  birthDate: string;                // yyyy-mm-dd
  avatarUrl: string;                // preenchido pelo upload
  city: string;
  state: string;
  modality: 'online' | 'presencial' | 'híbrido';
  goals: string;                    // vírgulas
  conditions: string;               // vírgulas
  languages: string;                // vírgulas
  whatsapp: string;
  email: string;
  notes: string;
};

export default function PatientForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [f, setF] = useState<Form>({
    fullName: '',
    birthDate: '',
    avatarUrl: '',
    city: '',
    state: '',
    modality: 'online',
    goals: '',
    conditions: '',
    languages: 'Português',
    whatsapp: '',
    email: '',
    notes: '',
  });

  const onChange = (k: keyof Form, v: any) => setF((s) => ({ ...s, [k]: v }));

  const pickFile = () => fileRef.current?.click();

  const onFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem (JPG/PNG).');
      return;
    }
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/uploads', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Falha no upload');
      }
      const { url } = await res.json();
      onChange('avatarUrl', url);
      toast.success('Foto enviada!');
    } catch (e: any) {
      toast.error(e?.message ?? 'Erro ao enviar a foto');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.fullName.trim()) {
      toast.error('Informe seu nome completo');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/patients/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(f),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Falha ao salvar cadastro');
      }
      toast.success('Cadastro de paciente concluído!');
      router.push('/'); // ou /info
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.kicker}>Cadastro</div>
          <h1 className={styles.title}>Cadastro de Paciente</h1>
          <p className={styles.subtitle}>
            Crie seu perfil para encontrar profissionais alinhados às suas necessidades.
          </p>
        </div>
      </header>

      <form onSubmit={submit} className={styles.formCard}>
        {/* Identificação */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Seus dados</h2>
            <p className={styles.sectionHint}>Informações básicas do seu perfil.</p>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Nome completo*</span>
              <input
                className={styles.input}
                value={f.fullName}
                onChange={(e) => onChange('fullName', e.target.value)}
                placeholder="Ex.: João da Silva"
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Data de nascimento</span>
              <input
                className={styles.input}
                type="date"
                value={f.birthDate}
                onChange={(e) => onChange('birthDate', e.target.value)}
              />
            </label>

            {/* Uploader de foto */}
            <div className={`${styles.field} ${styles.full}`}>
              <span className={styles.label}>Foto de perfil</span>

              <div className={styles.avatarRow}>
                <div className={styles.avatarWrap}>
                  {f.avatarUrl ? (
                    <img src={f.avatarUrl} className={styles.avatar} alt="Sua foto" />
                  ) : (
                    <div className={styles.avatarPlaceholder}>🙋‍♂️</div>
                  )}
                </div>

                <div className={styles.uploadCol}>
                  <div className={styles.uploadRow}>
                    <button
                      type="button"
                      className={styles.btnGhost}
                      onClick={pickFile}
                      disabled={uploading}
                    >
                      {uploading ? 'Enviando…' : 'Escolher foto'}
                    </button>
                    {f.avatarUrl && (
                      <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={() => onChange('avatarUrl', '')}
                        disabled={uploading}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <small className={styles.help}>
                    JPG/PNG até ~3MB. Mostraremos um preview redondo.
                  </small>
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className={styles.hiddenFile}
                onChange={onFile}
              />
            </div>
          </div>
        </div>

        {/* Preferências de atendimento */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Preferências</h2>
            <p className={styles.sectionHint}>Onde e como você prefere ser atendido(a).</p>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Cidade</span>
              <input
                className={styles.input}
                value={f.city}
                onChange={(e) => onChange('city', e.target.value)}
                placeholder="Ex.: Curitiba"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>UF</span>
              <input
                className={styles.input}
                maxLength={2}
                placeholder="PR"
                value={f.state}
                onChange={(e) => onChange('state', e.target.value.toUpperCase())}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Modalidade</span>
              <select
                className={styles.select}
                value={f.modality}
                onChange={(e) => onChange('modality', e.target.value as Form['modality'])}
              >
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="híbrido">Híbrido</option>
              </select>
            </label>
          </div>
        </div>

        {/* Objetivos e condições */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Objetivos & Condições</h2>
            <p className={styles.sectionHint}>Isso nos ajuda a indicar profissionais adequados.</p>
          </div>

          <div className={styles.grid}>
            <label className={`${styles.field} ${styles.full}`}>
              <span className={styles.label}>Objetivos</span>
              <input
                className={styles.input}
                placeholder="Ex.: Autoconhecimento, manejo de ansiedade…"
                value={f.goals}
                onChange={(e) => onChange('goals', e.target.value)}
              />
              <small className={styles.help}>Separe por vírgulas.</small>
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span className={styles.label}>Condições</span>
              <input
                className={styles.input}
                placeholder="Ex.: TDAH, ansiedade social…"
                value={f.conditions}
                onChange={(e) => onChange('conditions', e.target.value)}
              />
              <small className={styles.help}>Separe por vírgulas.</small>
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span className={styles.label}>Idiomas</span>
              <input
                className={styles.input}
                placeholder="Português, Inglês"
                value={f.languages}
                onChange={(e) => onChange('languages', e.target.value)}
              />
              <small className={styles.help}>Separe por vírgulas.</small>
            </label>
          </div>
        </div>

        {/* Contatos */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Contato</h2>
            <p className={styles.sectionHint}>Como os profissionais podem falar com você.</p>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>WhatsApp</span>
              <input
                className={styles.input}
                placeholder="55 11 99999-9999"
                value={f.whatsapp}
                onChange={(e) => onChange('whatsapp', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>E-mail</span>
              <input
                className={styles.input}
                type="email"
                placeholder="voce@email.com"
                value={f.email}
                onChange={(e) => onChange('email', e.target.value)}
              />
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span className={styles.label}>Observações</span>
              <textarea
                className={styles.textarea}
                rows={4}
                placeholder="Alguma informação relevante que queira compartilhar."
                value={f.notes}
                onChange={(e) => onChange('notes', e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => router.back()}
            disabled={loading || uploading}
          >
            Voltar
          </button>
          <button disabled={loading || uploading} className={styles.btnPrimary} type="submit">
            {loading ? 'Salvando…' : 'Salvar cadastro'}
          </button>
        </div>
      </form>
    </section>
  );
}