// src/lib/uploadImage.ts
import { getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Aceita Blob/File, faz upload para `avatars/{uid}/{timestamp}-{nome}`
export async function uploadImageFile(
  file: File,
  uid: string,
  folder = 'avatars'
): Promise<string> {
  const app = getApp(); // já existe seu client Firebase
  const storage = getStorage(app);

  const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
  const path = `${folder}/${uid}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  return await getDownloadURL(snapshot.ref);
}