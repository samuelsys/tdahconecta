"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/news.module.css";
import NewsCard from "./NewsCard";
import CompactFilterBar from "@/components/news/CompactFilterBar";

import { inferCountryFromUrl } from "@/lib/country";
import { getContinentForCountry } from "@/lib/geo";
import type { Continent } from "@/lib/geo";
import { trackEvent } from "@/lib/firebaseClient";

type Article = {
  title: string;
  url: string;
  image?: string;
  publishedAt?: string;
  section?: string;
  lang: "en" | "ar";
  source: string;
};

type FetchState = "idle" | "loading" | "done" | "error";
const LIMITS = [6, 12, 18, 24];
const LS_KEY = "news_filters_v1";

// (type local só para este arquivo)
type OptionCount = { id: string; label: string; count: number };

export default function NewsHome() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [limit, setLimit] = useState<number>(12);

  const [items, setItems] = useState<Article[]>([]);
  const [state, setState] = useState<FetchState>("idle");
  const [error, setError] = useState<string>("");

  // Filtros
  const [continent, setContinent] = useState<Continent | "">("");
  const [countriesSel, setCountriesSel] = useState<string[]>([]);
  const [portalsSel, setPortalsSel] = useState<string[]>([]);
  const [q, setQ] = useState<string>("");

  // URL / localStorage -> estado inicial
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const urlC = (sp.get("c") || "") as Continent | "";
    const urlCountries = (sp.get("countries") || "").split(",").map(s=>s.trim()).filter(Boolean);
    const urlPortals = (sp.get("portals") || "").split("|").map(s=>s.trim()).filter(Boolean);
    const urlQ = sp.get("q") || "";
    const urlLang = (sp.get("lang") || "") as "en" | "ar";
    const urlLimit = Number(sp.get("limit") || "") || 0;

    if (urlC || urlCountries.length || urlPortals.length || urlQ || urlLang || urlLimit) {
      setContinent(urlC || "");
      setCountriesSel(urlCountries);
      setPortalsSel(urlPortals);
      if (urlQ) setQ(urlQ);
      if (urlLang) setLang(urlLang);
      if (urlLimit) setLimit(urlLimit);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (saved) {
        setContinent(saved.continent || "");
        setCountriesSel(saved.countriesSel || []);
        setPortalsSel(saved.portalsSel || []);
        setQ(saved.q || "");
      }
    } catch {/* noop */}
  }, []);

  // Estado -> URL + localStorage
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (continent) sp.set("c", continent); else sp.delete("c");
    if (countriesSel.length) sp.set("countries", countriesSel.join(",")); else sp.delete("countries");
    if (portalsSel.length) sp.set("portals", portalsSel.join("|")); else sp.delete("portals");
    if (q.trim()) sp.set("q", q.trim()); else sp.delete("q");
    sp.set("lang", lang);
    sp.set("limit", String(limit));
    const url = `${window.location.pathname}?${sp.toString()}`;
    window.history.replaceState(null, "", url);
    localStorage.setItem(LS_KEY, JSON.stringify({ continent, countriesSel, portalsSel, q }));
  }, [continent, countriesSel, portalsSel, q, lang, limit]);

  // Fetch
  useEffect(() => {
    let ok = true;
    (async () => {
      setState("loading");
      setError("");
      try {
        const p = new URLSearchParams({ lang, limit: String(limit) }).toString();
        const res = await fetch(`/api/news/saudiarabia?${p}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!ok) return;
        setItems(data?.items ?? []);
        setState("done");
      } catch (e: any) {
        if (!ok) return;
        setError(e?.message ?? "Failed to load feed");
        setState("error");
      }
    })();
    return () => { ok = false; };
  }, [lang, limit]);

  // Enriquecer
  const enriched = useMemo(() => {
    return items.map((a) => {
      const { countryCode, countryName } = inferCountryFromUrl(a.url);
      const portal = safeHost(a.url);
      const cont = getContinentForCountry(countryCode);
      return { ...a, countryCode, countryName, portal, continent: cont };
    });
  }, [items]);

  // Opções agregadas
  const { countriesAll, portalsAll }: { countriesAll: OptionCount[]; portalsAll: OptionCount[] } =
    useMemo(() => {
      const cCount = new Map<string, number>();
      const cLabel = new Map<string, string>();
      const pCount = new Map<string, number>();
      for (const it of enriched) {
        if (it.countryCode) {
          cCount.set(it.countryCode, (cCount.get(it.countryCode) || 0) + 1);
          cLabel.set(it.countryCode, it.countryName || it.countryCode);
        }
        if (it.portal) pCount.set(it.portal, (pCount.get(it.portal) || 0) + 1);
      }
      const countriesAll: OptionCount[] = Array.from(cCount.entries())
        .map(([id, count]) => ({ id, label: cLabel.get(id) || id, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
      const portalsAll: OptionCount[] = Array.from(pCount.entries())
        .map(([id, count]) => ({ id, label: id, count }))
        .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
      return { countriesAll, portalsAll };
    }, [enriched]);

  // Países do seletor respeitando continente
  const countryOptions = useMemo<OptionCount[]>(() => {
    if (!continent) return countriesAll;
    return countriesAll.filter((c) => getContinentForCountry(c.id) === continent);
  }, [countriesAll, continent]);

  // ===== wrappers com tracking imediato (garantem log no clique) =====
  const setContinentTracked = (val: Continent | "") => {
    setContinent(val);
    trackEvent("filters_change", { source: "home", field: "continent", value: val || "ALL" });
  };
  const setCountriesSelTracked = (arr: string[]) => {
    setCountriesSel(arr);
    trackEvent("filters_change", { source: "home", field: "countries", count: arr.length, sample: arr.slice(0, 5) });
  };
  const setPortalsSelTracked = (arr: string[]) => {
    setPortalsSel(arr);
    trackEvent("filters_change", { source: "home", field: "portals", count: arr.length, sample: arr.slice(0, 5) });
  };
  const setQTracked = (value: string) => {
    setQ(value);
    trackEvent("filters_change", { source: "home", field: "q", q_len: value.trim().length });
  };
  const setLangTracked = (v: "en" | "ar") => {
    setLang(v);
    trackEvent("filters_change", { source: "home", field: "lang", value: v });
  };
  const setLimitTracked = (n: number) => {
    setLimit(n);
    trackEvent("filters_change", { source: "home", field: "limit", value: n });
  };
  const resetTracked = () => {
    trackEvent("filters_change", {
      source: "home",
      field: "reset",
      continent_before: continent || "ALL",
      countries_count_before: countriesSel.length,
      portals_count_before: portalsSel.length,
      q_len_before: q.trim().length,
      lang_before: lang,
      limit_before: limit,
    });
    setContinent("");
    setCountriesSel([]);
    setPortalsSel([]);
    setQ("");
  };

  // ======= TRACKING agregado (debounced) =======
  const firstRunRef = useRef(true);
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    const t = setTimeout(() => {
      trackEvent("filters_update", {
        continent: continent || "ALL",
        countries_count: countriesSel.length,
        portals_count: portalsSel.length,
        q_len: q.trim().length || 0,
        lang,
        limit,
        source: "home",
      });
    }, 600);
    return () => clearTimeout(t);
  }, [continent, countriesSel, portalsSel, q, lang, limit]);
  // ============================================

  // Aplicar filtros + busca
  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    return enriched.filter((it: any) => {
      if (continent && it.continent !== continent) return false;
      if (countriesSel.length && !countriesSel.includes(it.countryCode)) return false;
      if (portalsSel.length && !portalsSel.includes(it.portal)) return false;
      if (qn) {
        const hay = `${it.title} ${it.portal}`.toLowerCase();
        if (!hay.includes(qn)) return false;
      }
      return true;
    });
  }, [enriched, continent, countriesSel, portalsSel, q]);

  return (
    <>
      <CompactFilterBar
        q={q} setQ={setQTracked}
        lang={lang} setLang={setLangTracked}
        limit={limit} setLimit={setLimitTracked}
        continent={continent} setContinent={setContinentTracked}
        countryOptions={countryOptions}
        selectedCountries={countriesSel} setSelectedCountries={setCountriesSelTracked}
        portalOptions={portalsAll}
        selectedPortals={portalsSel} setSelectedPortals={setPortalsSelTracked}
        onReset={resetTracked}
      />

      {state === "loading" && <div className="alert">Loading… fetching newsroom</div>}
      {state === "error" && <div className="alert alert--error">Error: {error || "Unknown error"}</div>}

      <div className={styles.grid}>
        {filtered.map((a) => <NewsCard key={a.url} article={a} />)}
      </div>

      {state === "done" && filtered.length === 0 && (
        <div className="alert">No results with current filters.</div>
      )}
    </>
  );
}

function safeHost(u: string): string {
  try { return new URL(u).hostname.toLowerCase(); } catch { return ""; }
}