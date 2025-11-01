// src/app/api/auth/me/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { admin } from '@/firebase/admin';

export async function GET() {
  try {
    const c = await cookies();
    const session = c.get('session')?.value || '';
    if (!session) return NextResponse.json({ user: null }, { status: 200 });

    const decoded = await admin.auth().verifySessionCookie(session, true);

    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: decoded.email ?? null,
        emailVerified: decoded.email_verified ?? false,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}