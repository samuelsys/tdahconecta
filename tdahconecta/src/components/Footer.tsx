import Link from 'next/link';
import styles from '../styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ul className={styles.links}>
        <li><Link href="https://wa.me/5548992230242">Suport</Link></li>
        <li><Link href="/termos.html">Terms</Link></li>
        <li><Link href="/privacidade.html">Privacy Politics</Link></li>
      </ul>
      <p className={styles.copy}>
        © {new Date().getFullYear()} braziliansaudi.com All rights reserved.
      </p>
    </footer>
  );
}