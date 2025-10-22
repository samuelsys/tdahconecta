// src/app/page.tsx
import ClientShell from '@/components/ClientShell';

export default function HomePage() {
  return (
    <ClientShell>
      <section className="hero">
        <h1 className="hero__title">Bem-vindo ao TdahConecta</h1>
        <p className="hero__desc">
          O TDAH Conecta é um marketplace de especialistas voltado à saúde mental e neurodiversidade.
Nosso propósito é aproximar pessoas que convivem com o Transtorno de Déficit de Atenção e Hiperatividade (TDAH) — ou outras condições relacionadas — de profissionais qualificados que realmente entendem suas necessidades.
        </p>
        <div className="hero__actions">
          <a className="btn btn-primary" href="/specialists">Especialistas</a>
        </div>
      </section>
    </ClientShell>
  );
}