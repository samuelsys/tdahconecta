"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/filterbar.module.css";
import type { Continent } from "@/lib/geo";

// tipo local só aqui
type FilterOption = { id: string; label: string; count: number };

type Props = {
  q: string; setQ: (v: string) => void;

  lang: "en" | "ar"; setLang: (v: "en" | "ar") => void;
  limit: number; setLimit: (n: number) => void;

  continent: Continent | ""; setContinent: (c: Continent | "") => void;

  countryOptions: FilterOption[];
  selectedCountries: string[]; setSelectedCountries: (arr: string[]) => void;

  portalOptions: FilterOption[];
  selectedPortals: string[]; setSelectedPortals: (arr: string[]) => void;

  onReset: () => void;
};

const LIMITS = [6, 12, 18, 24];
const CONTINENT_LABEL: Record<string, string> = {
  "": "All", AS: "Asia", EU: "Europe", NA: "North America",
  SA: "South America", AF: "Africa", OC: "Oceania",
};

type OpenKind = "none" | "countries" | "portals";

export default function CompactFilterBar(props: Props) {
  const {
    q, setQ, lang, setLang, limit, setLimit,
    continent, setContinent,
    countryOptions, selectedCountries, setSelectedCountries,
    portalOptions, selectedPortals, setSelectedPortals,
    onReset,
  } = props;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [openKind, setOpenKind] = useState<OpenKind>("none");

  // mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 768px)");

    const apply = (src?: MediaQueryListEvent | MediaQueryList) => {
      const matches = src && "matches" in src ? (src as MediaQueryListEvent).matches : mq.matches;
      const mobile = Boolean(matches);
      setIsMobile(mobile);
      setMobileOpen(!mobile); // desktop: aberto; mobile: fechado por padrão
      if (!mobile) setOpenKind("none"); // fecha expanders ao sair do mobile
    };

    // estado inicial
    apply(mq);

    // handler para mudanças
    const handler = (e: MediaQueryListEvent) => apply(e);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else if (typeof (mq as any).addListener === "function") {
      (mq as any).addListener(handler);
      return () => (mq as any).removeListener(handler);
    }

    return () => {};
  }, []);

  // buscas locais nos expanders
  const [qCountry, setQCountry] = useState("");
  const [qPortal, setQPortal] = useState("");

  // ESC fecha expanders
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenKind("none"); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  // listas filtradas
  const countriesFiltered = useMemo(() => {
    const n = qCountry.trim().toLowerCase();
    return n ? countryOptions.filter(c =>
      c.label.toLowerCase().includes(n) || c.id.toLowerCase().includes(n)
    ) : countryOptions;
  }, [qCountry, countryOptions]);

  const portalsFiltered = useMemo(() => {
    const n = qPortal.trim().toLowerCase();
    return n ? portalOptions.filter(p =>
      p.id.toLowerCase().includes(n) || p.label.toLowerCase().includes(n)
    ) : portalOptions;
  }, [qPortal, portalOptions]);

  const toggleId = (arr: string[], id: string, set: (a: string[]) => void) => {
    set(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  };

  const onClickCountries = () => setOpenKind(k => k === "countries" ? "none" : "countries");
  const onClickPortals  = () => setOpenKind(k => k === "portals"  ? "none" : "portals");

  // contador de filtros ativos (continent + countries + portals)
  const activeCount = (continent ? 1 : 0) + selectedCountries.length + selectedPortals.length;

  // toggle de collapse no mobile
  const toggleMobile = () => {
    const willOpen = !mobileOpen;
    setMobileOpen(willOpen);
    if (!willOpen) setOpenKind("none"); // fechamos expanders quando colapsa
  };

  return (
    <div ref={wrapRef} className={styles.wrap}>
      {/* --- BARRA (com botão de collapse no mobile) --- */}
      <div className={styles.bar} role="region" aria-label="Filters">
        <div className={styles.itemGrow}>
          <input
            className={styles.input}
            placeholder="Search title/portal…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search"
            autoComplete="off"
          />
        </div>

        {/* Botão Collapse (só aparece no mobile) */}
        <div className={styles.item}>
          <button
            className={styles.mobileToggle}
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="filters-stack"
          >
            Filters
            {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
            <span className={`${styles.caret} ${mobileOpen ? styles.caretUp : styles.caretDown}`} aria-hidden />
          </button>
        </div>

        {/* Pilha de filtros: desktop sempre visível; mobile controlado pelo collapse */}
        <div
          id="filters-stack"
          className={`${styles.stack} ${
            isMobile ? (mobileOpen ? styles.stackOpen : styles.stackClosed) : styles.stackOpen
          }`}
        >
          <div className={styles.item}>
            <select
              className={styles.select}
              value={continent}
              onChange={(e) => setContinent((e.target.value || "") as Continent | "")}
              aria-label="Continent"
            >
              <option value="">{CONTINENT_LABEL[""]}</option>
              <option value="AS">{CONTINENT_LABEL.AS}</option>
              <option value="EU">{CONTINENT_LABEL.EU}</option>
              <option value="NA">{CONTINENT_LABEL.NA}</option>
              <option value="SA">{CONTINENT_LABEL.SA}</option>
              <option value="AF">{CONTINENT_LABEL.AF}</option>
              <option value="OC">{CONTINENT_LABEL.OC}</option>
            </select>
          </div>

          <div className={styles.itemWrap}>
            <button
              className={`${styles.trigger} ${openKind === "countries" ? styles.triggerActive : ""}`}
              onClick={onClickCountries}
              aria-controls="expander-countries"
              aria-expanded={openKind === "countries"}
            >
              Countries {selectedCountries.length ? <span className={styles.badge}>{selectedCountries.length}</span> : null}
            </button>
          </div>

          <div className={styles.itemWrap}>
            <button
              className={`${styles.trigger} ${openKind === "portals" ? styles.triggerActive : ""}`}
              onClick={onClickPortals}
              aria-controls="expander-portals"
              aria-expanded={openKind === "portals"}
            >
              Portals {selectedPortals.length ? <span className={styles.badge}>{selectedPortals.length}</span> : null}
            </button>
          </div>

          <div className={styles.item}>
            <select
              className={styles.select}
              value={lang}
              onChange={(e) => (e.target.value === "ar" ? setLang("ar") : setLang("en"))}
              aria-label="Source language"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>

          <div className={styles.item}>
            <select
              className={styles.select}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              aria-label="Items"
            >
              {LIMITS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className={styles.item}>
            <button
              className={styles.btnGhost}
              onClick={() => { onReset(); setOpenKind("none"); }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* --- EXPANDERS (aparecem logo abaixo e só se a pilha estiver aberta no mobile) --- */}
      {(!isMobile || mobileOpen) && openKind !== "none" && (
        <div
          className={styles.expander}
          id={openKind === "countries" ? "expander-countries" : "expander-portals"}
        >
          <div className={styles.expanderHead}>
            <strong>{openKind === "countries" ? "Countries" : "Portals"}</strong>
            <div className={styles.panelRow}>
              {openKind === "countries" ? (
                <>
                  <button
                    className={styles.btnMini}
                    onClick={() => props.setSelectedCountries(countriesFiltered.map(c => c.id))}
                  >All</button>
                  <button className={styles.btnMini} onClick={() => props.setSelectedCountries([])}>Clear</button>
                </>
              ) : (
                <>
                  <button
                    className={styles.btnMini}
                    onClick={() => props.setSelectedPortals(portalsFiltered.map(p => p.id))}
                  >All</button>
                  <button className={styles.btnMini} onClick={() => props.setSelectedPortals([])}>Clear</button>
                </>
              )}
              <button className={styles.btnMini} onClick={() => setOpenKind("none")}>Close</button>
            </div>
          </div>

          <div className={styles.expanderTools}>
            {openKind === "countries" ? (
              <input
                className={styles.input}
                placeholder="Search countries…"
                value={qCountry}
                onChange={(e) => setQCountry(e.target.value)}
              />
            ) : (
              <input
                className={styles.input}
                placeholder="Search portals…"
                value={qPortal}
                onChange={(e) => setQPortal(e.target.value)}
              />
            )}
          </div>

          <div className={styles.list}>
            {openKind === "countries"
              ? countriesFiltered.map(c => {
                  const active = selectedCountries.includes(c.id);
                  return (
                    <label key={c.id} className={`${styles.option} ${active ? styles.optionActive : ""}`}>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleId(selectedCountries, c.id, setSelectedCountries)}
                      />
                      <span className={styles.optionLabel} title={c.label}>{c.label}</span>
                      <span className={styles.count}>{c.count}</span>
                    </label>
                  );
                })
              : portalsFiltered.map(p => {
                  const active = selectedPortals.includes(p.id);
                  return (
                    <label key={p.id} className={`${styles.option} ${active ? styles.optionActive : ""}`}>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleId(selectedPortals, p.id, setSelectedPortals)}
                      />
                      <span className={styles.optionLabel} title={p.id}>{p.id}</span>
                      <span className={styles.count}>{p.count}</span>
                    </label>
                  );
                })
            }

            {(openKind === "countries" && countriesFiltered.length === 0) && (
              <div className={styles.empty}>No countries.</div>
            )}
            {(openKind === "portals" && portalsFiltered.length === 0) && (
              <div className={styles.empty}>No portals.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}