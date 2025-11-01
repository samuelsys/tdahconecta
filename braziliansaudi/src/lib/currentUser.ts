// src/lib/currentUser.ts
import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebaseAdmin';

type CurrentUser =
  | { uid: string; email: string | null }
  | null;

export async function currentUser(): Promise<CurrentUser> {
  // 👇 no Next 15 use await
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}