export function inferCountryFromUrl(url: string): { countryName: string; countryCode: string } {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    const domainMap: Record<string, { name: string; code: string }> = {
      "spl.com.sa": { name: "Saudi Arabia", code: "SA" },
      "reuters.com": { name: "International", code: "UN" },
      "apnews.com": { name: "International", code: "UN" },
      "bbc.co.uk": { name: "United Kingdom", code: "GB" },
      "skysports.com": { name: "United Kingdom", code: "GB" },
      "lequipe.fr": { name: "France", code: "FR" },
      "gazzetta.it": { name: "Italy", code: "IT" },
      "as.com": { name: "Spain", code: "ES" },
      "kicker.de": { name: "Germany", code: "DE" },
      "espn.com": { name: "United States", code: "US" },
      "espn.com.br": { name: "Brazil", code: "BR" },
      "ge.globo.com": { name: "Brazil", code: "BR" },
      "ole.com.ar": { name: "Argentina", code: "AR" },
      "tycsports.com": { name: "Argentina", code: "AR" },
    };
    if (domainMap[host]) return { countryName: domainMap[host].name, countryCode: domainMap[host].code };

    const tld = host.split(".").slice(-1)[0];
    const tldCountry: Record<string, { name: string; code: string }> = {
      sa: { name: "Saudi Arabia", code: "SA" },
      uk: { name: "United Kingdom", code: "GB" },
      fr: { name: "France", code: "FR" },
      it: { name: "Italy", code: "IT" },
      es: { name: "Spain", code: "ES" },
      de: { name: "Germany", code: "DE" },
      br: { name: "Brazil", code: "BR" },
      ar: { name: "Argentina", code: "AR" },
      us: { name: "United States", code: "US" },
      ca: { name: "Canada", code: "CA" },
      mx: { name: "Mexico", code: "MX" },
      pt: { name: "Portugal", code: "PT" },
    };
    if (tldCountry[tld]) return { countryName: tldCountry[tld].name, countryCode: tldCountry[tld].code };

    return { countryName: "International", countryCode: "UN" };
  } catch {
    return { countryName: "International", countryCode: "UN" };
  }
}

export function flagEmoji(code: string): string {
  if (!code || code.length < 2 || code.toUpperCase() === "UN") return "🌐";
  const A = 0x1f1e6;
  const chars = code
    .toUpperCase()
    .slice(0, 2)
    .split("")
    .map((c) => A + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...chars);
}