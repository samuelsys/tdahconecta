"use client";

// ANTES:
// import { CONTINENTS, Continent } from "@/lib/geo";

// DEPOIS:
import { CONTINENTS } from "@/lib/geo";
import type { Continent } from "@/lib/geo";

import { useMemo, useState } from "react";
export type OptionCount = { id: string; label: string; count: number };

type Props = {
  selectedContinent: Continent | "";
  setSelectedContinent: (c: Continent | "") => void;

  countries: OptionCount[];              // código ISO2 em id
  selectedCountries: string[];
  setSelectedCountries: (arr: string[]) => void;

  portals: OptionCount[];                // host em id
  selectedPortals: string[];
  setSelectedPortals: (arr: string[]) => void;

  onReset: () => void;
};

export default function FilterBar(props: Props) {
  const {
    selectedContinent, setSelectedContinent,
    countries, selectedCountries, setSelectedCountries,
    portals, selectedPortals, setSelectedPortals,
    onReset,
  } = props;

  const [portalQuery, setPortalQuery] = useState("");

  const filteredPortals = useMemo(() => {
    const q = portalQuery.trim().toLowerCase();
    if (!q) return portals;
    return portals.filter(p => p.id.toLowerCase().includes(q) || p.label.toLowerCase().includes(q));
  }, [portalQuery, portals]);

  const toggleCountry = (id: string) => {
    setSelectedCountries(
      selectedCountries.includes(id)
        ? selectedCountries.filter(c => c !== id)
        : [...selectedCountries, id]
    );
  };

  const togglePortal = (id: string) => {
    setSelectedPortals(
      selectedPortals.includes(id)
        ? selectedPortals.filter(p => p !== id)
        : [...selectedPortals, id]
    );
  };

  return (
    <div className="filters">
      {/* linha 1: continente + reset */}
      <div className="filters__row">
        <div className="filters__group">
          <label className="filters__label">Continent</label>
          <select
            className="select"
            value={selectedContinent}
            onChange={(e) => setSelectedContinent((e.target.value || "") as Continent | "")}
          >
            <option value="">All continents</option>
            {CONTINENTS.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-outline" onClick={onReset}>Reset filters</button>
      </div>

      {/* linha 2: países (multiselect pill) */}
      <div className="filters__group">
        <label className="filters__label">Countries</label>
        <div className="chips">
          {countries.map(c => {
            const active = selectedCountries.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCountry(c.id)}
                className={`chip ${active ? "chip--active" : ""}`}
                title={`${c.label} (${c.count})`}
              >
                {c.label} <span className="chip__count">{c.count}</span>
              </button>
            );
          })}
          {countries.length === 0 && <span className="filters__muted">No countries detected</span>}
        </div>
      </div>

      {/* linha 3: portals (multiselect com busca) */}
      <div className="filters__group">
        <label className="filters__label">Portals</label>
        <input
          className="select"
          placeholder="Search portal (host)…"
          value={portalQuery}
          onChange={(e) => setPortalQuery(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <div className="chips">
          {filteredPortals.map(p => {
            const active = selectedPortals.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePortal(p.id)}
                className={`chip ${active ? "chip--active" : ""}`}
                title={`${p.id} (${p.count})`}
              >
                {p.id} <span className="chip__count">{p.count}</span>
              </button>
            );
          })}
          {filteredPortals.length === 0 && <span className="filters__muted">No portals match</span>}
        </div>
      </div>
    </div>
  );
}