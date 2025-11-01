"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/filterbar.module.css";
import type { Continent } from "@/lib/geo";
import { trackEvent } from "@/lib/firebaseClient";

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

  // ===== Tracking helpers =====
  const debounceTimer = useRef<number | null>(null);
  const trackSearch = (value: string) => {
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      trackEvent("filter_search_input", {
        q_len: value.trim().length,
        q_sample: value.trim().slice(0, 40) || null,
      });
    }, 500);
  };

  const onChangeContinent = (val: Continent | "") => {
    setContinent(val);
    trackEvent("filter_continent_set", { value: val || "ALL" });
  };

  const toggleCountry = (id: string) => {
    const exists = selectedCountries.includes(id);
    const next = exists
      ? selectedCountries.filter(x => x !== id)
      : [...selectedCountries, id];
    setSelectedCountries(next);
    trackEvent("filter_country_toggle", {
      id,
      action: exists ? "remove" : "add",
      total: next.length,
    });
  };

  const togglePortal = (id: string) => {
    const exists = selectedPortals.includes(id);
    const next = exists
      ? selectedPortals.filter(x => x !== id)
      : [...selectedPortals, id];
    setSelectedPortals(next);
    trackEvent("filter_portal_toggle", {
      id,
      action: exists ? "remove" : "add",
      total: next.length,
    });
  };

  const onChangeLang = (v: "en" | "ar") => {
    setLang(v);
    trackEvent("filter_lang_set", { value: v });
  };

  const onChangeLimit = (n: number) => {
    setLimit(n);
    trackEvent("filter_limit_set", { value: n });
  };

  const onClickReset = () => {
    trackEvent("filter_reset", {
      continent_before: continent || "ALL",
      countries_count_before: selectedCountries.length,
      portals_count_before: selectedPortals.length,
      q_len_before: (props.q || "").trim().length,
    });
    onReset();
  };

  const onClickCountries = () => {
    const nextOpen = openKind === "countries" ? "none" : "countries";
    setOpenKind(nextOpen);
    trackEvent("filter_panel_toggle", { panel: "countries", state: nextOpen === "countries" ? "open" : "close" });
  };

  const onClickPortals = () => {
    const nextOpen = openKind === "portals" ? "none" : "portals";
    setOpenKind(nextOpen);
    trackEvent("filter_panel_toggle", { panel: "portals", state: nextOpen === "portals" ? "open" : "close" });
  };

  // contador de filtros ativos (continent + countries + portals)
  const activeCount = (continent ? 1 : 0) + selectedCountries.length + selectedPortals.length;

  // toggle de collapse no mobile
  const toggleMobile = () => {
    const willOpen = !mobileOpen;
    setMobileOpen(willOpen);
    if (!willOpen) setOpenKind("none"); // fechamos expanders quando colapsa
    trackEvent("filter_mobile_collapse", { state: willOpen ? "open" : "close" });
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
            onChange={(e) => { setQ(e.target.value); trackSearch(e.target.value); }}
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
              onChange={(e) => onChangeContinent((e.target.value || "") as Continent | "")}
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
              onChange={(e) => onChangeLang(e.target.value === "ar" ? "ar" : "en")}
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
              onChange={(e) => onChangeLimit(Number(e.target.value))}
              aria-label="Items"
            >
              {LIMITS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className={styles.item}>
            <button
              className={styles.btnGhost}
              onClick={onClickReset}
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
                    onClick={() => {
                      const all = countriesFiltered.map(c => c.id);
                      setSelectedCountries(all);
                      trackEvent("filter_country_bulk", { action: "select_all", total: all.length });
                    }}
                  >All</button>
                  <button
                    className={styles.btnMini}
                    onClick={() => {
                      setSelectedCountries([]);
                      trackEvent("filter_country_bulk", { action: "clear_all" });
                    }}
                  >Clear</button>
                </>
              ) : (
                <>
                  <button
                    className={styles.btnMini}
                    onClick={() => {
                      const all = portalsFiltered.map(p => p.id);
                      setSelectedPortals(all);
                      trackEvent("filter_portal_bulk", { action: "select_all", total: all.length });
                    }}
                  >All</button>
                  <button
                    className={styles.btnMini}
                    onClick={() => {
                      setSelectedPortals([]);
                      trackEvent("filter_portal_bulk", { action: "clear_all" });
                    }}
                  >Clear</button>
                </>
              )}
              <button
                className={styles.btnMini}
                onClick={() => {
                  setOpenKind("none");
                  trackEvent("filter_panel_toggle", { panel: openKind, state: "close" });
                }}
              >Close</button>
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
                    <label
                      key={c.id}
                      className={`${styles.option} ${active ? styles.optionActive : ""}`}
                      onClick={(e) => {
                        // permitir click no label inteiro
                        if ((e.target as HTMLElement).tagName.toLowerCase() !== "input") {
                          toggleCountry(c.id);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleCountry(c.id)}
                      />
                      <span className={styles.optionLabel} title={c.label}>{c.label}</span>
                      <span className={styles.count}>{c.count}</span>
                    </label>
                  );
                })
              : portalsFiltered.map(p => {
                  const active = selectedPortals.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`${styles.option} ${active ? styles.optionActive : ""}`}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).tagName.toLowerCase() !== "input") {
                          togglePortal(p.id);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => togglePortal(p.id)}
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