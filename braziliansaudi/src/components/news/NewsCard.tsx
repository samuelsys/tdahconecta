"use client";

import { useState } from "react";
import styles from "@/styles/news.module.css";

type Article = {
  title: string;
  url: string;
  image?: string;
  publishedAt?: string;
  section?: string;
  lang: "en" | "ar";
  source: string;
  countryName?: string;
  countryCode?: string;
  portal?: string;
  continent?: string;
};

export default function NewsCard({ article }: { article: Article }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [busy, setBusy] = useState(false);

  const onVote = async (next: "up" | "down") => {
    const newVal = vote === next ? null : next; // toggle
    setVote(newVal); // otimista
    setBusy(true);
    try {
      await fetch("/api/news/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: article.url, vote: newVal }), // 'up' | 'down' | null
      });
    } catch {
      // em caso de erro, reverte visualmente
      setVote(vote);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className={styles.card}>
      {article.image && (
        <a
          className={styles.cardImgWrap}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.cardImg} src={article.image} alt={article.title} />
        </a>
      )}

      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <span className={styles.metaPill}>
            {article.countryName ?? "—"}
          </span>
          <span className={styles.dot} />
          <span className={styles.metaText}>
            {article.portal ?? new URL(article.url).hostname}
          </span>
        </div>

        <h3 className={styles.cardTitle}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        <div className={styles.cardFooter}>
          <div className={styles.voteBar}>
            <button
              className={`${styles.voteBtn} ${vote === "up" ? styles.voteUpActive : ""}`}
              onClick={() => onVote("up")}
              aria-pressed={vote === "up"}
              disabled={busy}
              title="Joinha (confiável)"
            >
              <span role="img" aria-label="thumbs up">👍</span>
            </button>
            <button
              className={`${styles.voteBtn} ${vote === "down" ? styles.voteDownActive : ""}`}
              onClick={() => onVote("down")}
              aria-pressed={vote === "down"}
              disabled={busy}
              title="Não-joinha (duvidosa)"
            >
              <span role="img" aria-label="thumbs down">👎</span>
            </button>
          </div>

          <a
            className={styles.readBtn}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read
          </a>
        </div>
      </div>
    </article>
  );
}