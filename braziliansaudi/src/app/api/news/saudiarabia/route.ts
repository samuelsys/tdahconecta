import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "nodejs";            // precisamos de Node (cheerio)
export const dynamic = "force-dynamic";     // evita cache estático do build

type Lang = "en" | "ar";

type Article = {
  title: string;
  url: string;
  publishedAt?: string;        // ISO, quando disponível
  section?: string;            // ex.: News | Feature | Highlights | Video
  image?: string;              // og:image
  lang: Lang;
  source: "spl.com.sa";
};

const BASE = "https://www.spl.com.sa";
const NEWS_PATH: Record<Lang, string> = { en: "/en/news", ar: "/ar/news" };

// util: atraso “polido” entre requisições
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// util: torna URL absoluta
function absUrl(href: string) {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("/")) return BASE + href;
  return BASE + "/" + href.replace(/^\/+/, "");
}

// baixa HTML com cabeçalhos minimamente amigáveis
async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; SPLCrawler/1.0; +https://www.spl.com.sa)",
      "Accept-Language": "en;q=0.9,ar;q=0.8",
      Accept: "text/html,application/xhtml+xml",
    },
    // evite cache agressivo em runtime
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao buscar ${url}`);
  }
  return await res.text();
}

// extrai metadados de uma PÁGINA DE ARTIGO
function parseArticle(html: string, url: string, lang: Lang): Article {
  const $ = cheerio.load(html);

  // título
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").first().text().trim() ||
    url;

  // data publicada
  const publishedFromMeta =
    $('meta[property="article:published_time"]').attr("content") ||
    $('meta[name="pubdate"]').attr("content") ||
    $('meta[name="date"]').attr("content") ||
    undefined;

  // seção / tipo (News, Feature, Video…)
  const section =
    $('meta[property="article:section"]').attr("content") ||
    $('meta[name="section"]').attr("content") ||
    undefined;

  // imagem OG
  const image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    undefined;

  // tenta também JSON-LD (caso exista)
  try {
    $('script[type="application/ld+json"]').each((_, el) => {
      const raw = $(el).contents().text();
      if (!raw) return;
      const data = JSON.parse(raw);
      const ld = Array.isArray(data) ? data[0] : data;
      if (ld) {
        if (!section && typeof ld.articleSection === "string") {
          // @ts-ignore
          (ld.articleSection) && ( (ld.articleSection as string).length > 0 );
        }
        if (!image && ld.image) {
          const img = Array.isArray(ld.image) ? ld.image[0] : ld.image;
          if (typeof img === "string") (img && ( (img.length > 4) ));
        }
      }
    });
  } catch {
    // ignora erros de JSON malformado
  }

  return {
    title,
    url,
    publishedAt: publishedFromMeta,
    section,
    image,
    lang,
    source: "spl.com.sa",
  };
}

// da PÁGINA DE LISTA (/en/news ou /ar/news), coleta os links de artigos
function extractArticleLinksFromList(html: string, lang: Lang): string[] {
  const $ = cheerio.load(html);
  const set = new Set<string>();

  // 1) links claros com prefixo de notícia
  $(`a[href^="/${lang}/news/"]`).each((_, a) => {
    const href = $(a).attr("href");
    if (href) set.add(absUrl(href.split("?")[0]));
  });

  // 2) fallback: qualquer link que contenha "/news/"
  $('a[href*="/news/"]').each((_, a) => {
    const href = $(a).attr("href");
    if (!href) return;
    // garante idioma correto e evita duplicatas
    if (href.includes(`/${lang}/news/`)) {
      set.add(absUrl(href.split("?")[0]));
    }
  });

  return Array.from(set);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = (searchParams.get("lang") as Lang) || "en"; // "en" | "ar"
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "12", 10) || 12, 1),
      50
    );
    const delayMs = Math.min(
      Math.max(parseInt(searchParams.get("delayMs") || "150", 10) || 150, 0),
      2000
    );

    if (!["en", "ar"].includes(lang)) {
      return NextResponse.json(
        { error: 'param "lang" deve ser "en" ou "ar"' },
        { status: 400 }
      );
    }

    const listUrl = BASE + NEWS_PATH[lang as Lang];
    const listHtml = await fetchHtml(listUrl);
    const links = extractArticleLinksFromList(listHtml, lang as Lang).slice(
      0,
      limit
    );

    const results: Article[] = [];
    for (let i = 0; i < links.length; i++) {
      const u = links[i];
      try {
        // pequeno atraso “educado” entre as páginas
        if (i > 0 && delayMs > 0) await sleep(delayMs);
        const html = await fetchHtml(u);
        const parsed = parseArticle(html, u, lang as Lang);
        results.push(parsed);
      } catch (e) {
        console.warn("Falha ao processar artigo:", u, e);
      }
    }

    // ordena por data quando disponível
    results.sort((a, b) => {
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return tb - ta;
    });

    const res = NextResponse.json(
      {
        ok: true,
        count: results.length,
        lang,
        listUrl,
        items: results,
      },
      {
        status: 200,
      }
    );

    // cache CDN (ex.: Vercel) — 5 min
    res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
    return res;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err?.message || "erro desconhecido" },
      { status: 500 }
    );
  }
}
