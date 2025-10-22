// src/app/api/auth/session/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { admin } from '@/firebase/admin';

export async function POST(req: Request) {
  try {
    const { idToken } = (await req.json()) as { idToken?: string };
    if (!idToken) return NextResponse.json({ ok: false }, { status: 400 });

    const expiresInMs = 60 * 60 * 24 * 5 * 1000; // 5 dias
    const decoded = await admin.auth().verifyIdToken(idToken, true);
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: expiresInMs });

    cookies().set('session', sessionCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresInMs / 1000,
    });

    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (_err) { // <- evita o warning
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}