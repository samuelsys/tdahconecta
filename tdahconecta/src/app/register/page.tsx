import Link from 'next/link';
import ClientShell from '@/components/ClientShell';
import styles from '@/styles/register.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RegisterPage() {
  return (
    <ClientShell>
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Como deseja se cadastrar?</h1>
          <p className={styles.subtitle}>
            Escolha uma opção para continuar. Você pode mudar depois nas configurações.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Paciente */}
          <article className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.iconCircle} aria-hidden>🧑‍⚕️</div>
              <h2 className={styles.cardTitle}>Sou Paciente</h2>
            </div>

            <p className={styles.cardText}>
              Encontre profissionais, salve favoritos e agende atendimentos.
            </p>

            <ul className={styles.featureList}>
              <li>Busca por especialidade e cidade</li>
              <li>Filtros por preço, modalidade e convênio</li>
              <li>Avaliações reais de outros pacientes</li>
            </ul>

            <div className={styles.ctaRow}>
              <Link className={styles.btnPrimary} href="/patients">
                Quero me cadastrar como paciente
              </Link>
            </div>
          </article>

          {/* Psicólogo(a) / Especialista */}
          <article className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.iconCircle} aria-hidden>💼</div>
              <h2 className={styles.cardTitle}>Sou Psicólogo(a)</h2>
            </div>

            <p className={styles.cardText}>
              Crie seu perfil profissional e receba contatos de pacientes.
            </p>

            <ul className={styles.featureList}>
              <li>Perfil completo com serviços e valores</li>
              <li>Link de agendamento e redes sociais</li>
              <li>Mais visibilidade para sua prática</li>
            </ul>

            <div className={styles.ctaRow}>
              <Link className={styles.btnPrimary} href="/specialists/new">
                Cadastrar como especialista
              </Link>
              <Link className={styles.btnGhost} href="/">
                Ver especialistas
              </Link>
            </div>
          </article>
        </div>
      </section>
    </ClientShell>
  );
}