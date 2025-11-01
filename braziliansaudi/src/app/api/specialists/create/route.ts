import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { admin } from '@/firebase/admin';
import { firestore } from '@/firebase/client';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const session = (await cookies()).get('session')?.value || '';
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const user = await admin.auth().verifySessionCookie(session, true);
    const body = await req.json();

    // sane defaults (rating etc)
    const payload = {
      fullName: body.fullName?.trim(),
      profession: body.profession || 'Psicologia',
      crp: body.crp || '',
      yearsExperience: Number(body.yearsExperience || 0),
      avatarUrl: body.avatarUrl || '',
      primaryCondition: body.primaryCondition || 'TDAH',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      languages: Array.isArray(body.languages) ? body.languages : ['Português'],
      bio: body.bio || '',
      modality: body.modality || 'online',
      priceFrom: body.priceFrom ? Number(body.priceFrom) : null,
      city: body.city || '',
      state: body.state || '',
      acceptsInsurance: Boolean(body.acceptsInsurance),
      whatsapp: body.whatsapp || '',
      website: body.website || '',
      instagram: body.instagram || '',
      bookingUrl: body.bookingUrl || '',
      rating: 0,
      reviewsCount: 0,
      sessionsCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      // serverTimestamp é opcional aqui, já que estamos em client SDK; mantido o Date.now para compat c/ legado
      _serverCreatedAt: serverTimestamp(),
      _serverUpdatedAt: serverTimestamp(),
    };

    if (!payload.fullName) {
      return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
    }

    const colRef = collection(firestore, 'users', user.uid, 'specialists');
    const ref = await addDoc(colRef, payload);

    return NextResponse.json({ id: ref.id }, { status: 200 });
  } catch (err) {
    console.error('create specialist error', err);
    return NextResponse.json({ error: 'INTERNAL' }, { status: 500 });
  }
}