import { NextResponse } from 'next/server';

// Exemplo didático – em produção troque por S3/Cloud Storage
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'FILE_REQUIRED' }, { status: 400 });

    // salva temporariamente em /tmp e expõe via /public? Aqui, para simplificar,
    // convertemos em Data URL. Troque por um provedor real.
    const buf = Buffer.from(await file.arrayBuffer());
    const b64 = buf.toString('base64');
    const mime = file.type || 'image/jpeg';
    const dataUrl = `data:${mime};base64,${b64}`;

    return NextResponse.json({ url: dataUrl }, { status: 200 });
  } catch (e) {
    console.error('upload error', e);
    return NextResponse.json({ error: 'UPLOAD_FAILED' }, { status: 500 });
  }
}