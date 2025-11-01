import Link from 'next/link';
import styles from '../styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ul className={styles.links}>
        <li><Link href="https://wa.me/5548992166198">Suporte</Link></li>
        <li><Link href="/termos.html">Termos de Serviço</Link></li>
        <li><Link href="/privacidade.html">Política de Privacidade</Link></li>
      </ul>
      <p className={styles.copy}>
        © {new Date().getFullYear()} Tdah Conecta. Todos os direitos reservados.
      </p>
    </footer>
  );
}