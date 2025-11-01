export type Continent = "AF" | "AS" | "EU" | "NA" | "SA" | "OC" | "UN";
export const CONTINENTS: { code: Continent; name: string }[] = [
  { code: "EU", name: "Europe" },
  { code: "SA", name: "South America" },
  { code: "NA", name: "North America" },
  { code: "AF", name: "Africa" },
  { code: "AS", name: "Asia" },
  { code: "OC", name: "Oceania" },
];

const COUNTRY_TO_CONTINENT: Record<string, Continent> = {
  SA: "AS",
  GB: "EU",
  FR: "EU",
  IT: "EU",
  ES: "EU",
  DE: "EU",
  PT: "EU",
  BR: "SA",
  AR: "SA",
  US: "NA",
  CA: "NA",
  MX: "NA",
  // fallback:
};

export function getContinentForCountry(code: string | undefined): Continent {
  if (!code) return "UN";
  const cc = code.toUpperCase();
  return COUNTRY_TO_CONTINENT[cc] ?? "UN";
}