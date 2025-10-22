// src/app/api/auth/session/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { admin } from '@/firebase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idToken = String(body?.idToken || '');

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // 5 dias
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const c = await cookies();
    c.set('session', sessionCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}