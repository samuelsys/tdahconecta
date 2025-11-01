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

    const payload = {
      fullName: (body.fullName ?? '').trim(),
      birthDate: body.birthDate || '',
      avatarUrl: body.avatarUrl || '',
      city: body.city || '',
      state: body.state || '',
      modality: body.modality || 'online',
      goals: body.goals || '',
      conditions: body.conditions || '',
      languages: body.languages || 'Português',
      whatsapp: body.whatsapp || '',
      email: body.email || '',
      notes: body.notes || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _serverCreatedAt: serverTimestamp(),
      _serverUpdatedAt: serverTimestamp(),
    };

    if (!payload.fullName) {
      return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
    }

    const colRef = collection(firestore, 'users', user.uid, 'patients');
    const ref = await addDoc(colRef, payload);

    return NextResponse.json({ id: ref.id }, { status: 200 });
  } catch (err) {
    console.error('create patient error', err);
    return NextResponse.json({ error: 'INTERNAL' }, { status: 500 });
  }
}