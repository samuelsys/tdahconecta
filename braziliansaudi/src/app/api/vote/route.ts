import { NextResponse } from "next/server";

// Stub endpoint: recebe o voto e retorna OK.
// Integre depois com seu DB (ex.: Prisma + Postgres) para persistir.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, verdict, source, publishedAt } = body || {};
    if (!url || !verdict) {
      return NextResponse.json({ ok: false, error: "url and verdict are required" }, { status: 400 });
    }

    // eslint-disable-next-line no-console
    console.log("[vote] =>", { url, verdict, source, publishedAt, at: new Date().toISOString() });

    // Dica: aqui você gravaria em: votes(id, url, verdict, userId?, createdAt)
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown error" }, { status: 500 });
  }
}
