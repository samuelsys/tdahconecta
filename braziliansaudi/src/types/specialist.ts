// src/types/specialist.ts
import { z } from 'zod';

export type Specialist = {
  fullName: string;
  profession: 'Psicologia' | 'Psiquiatria' | 'Neuropsicologia' | 'Terapia Ocupacional' | 'Outros';
  crp?: string;
  yearsExperience?: number;
  avatarUrl?: string;

  primaryCondition?: string;
  tags: string[];
  languages: string[];
  bio?: string;

  modality?: 'online' | 'presencial' | 'híbrido';
  priceFrom?: number | null;
  city?: string;
  state?: string;
  acceptsInsurance?: boolean;

  whatsapp?: string;
  website?: string;
  instagram?: string;
  bookingUrl?: string;

  rating: number;
  reviewsCount: number;
  sessionsCount: number;

  createdAt: number;
  updatedAt: number;

  // úteis no Firestore
  id?: string;     // doc id
  userId?: string; // dono do cadastro
};

export const SpecialistSchema = z.object({
  fullName: z.string().min(1).trim(),
  profession: z.enum(['Psicologia','Psiquiatria','Neuropsicologia','Terapia Ocupacional','Outros']),
  crp: z.string().trim().optional(),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  avatarUrl: z.string().url().optional(),

  primaryCondition: z.string().trim().optional(),
  tags: z.array(z.string().trim()).default([]),
  languages: z.array(z.string().trim()).default(['Português']),
  bio: z.string().optional(),

  modality: z.enum(['online','presencial','híbrido']).optional(),
  priceFrom: z.coerce.number().min(0).nullable().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  acceptsInsurance: z.boolean().optional(),

  // aceita só dígitos (10–14) – ex.: 5548999998888
  whatsapp: z.string().regex(/^\d{10,14}$/, 'Informe somente números (DDD+número)').optional(),

  // permitem vazio quando não preenchidos no form
  website: z.union([z.string().url(), z.literal('')]).optional(),
  instagram: z.string().trim().optional(), // pode ser @handle ou URL, validar depois se quiser
  bookingUrl: z.union([z.string().url(), z.literal('')]).optional(),

  rating: z.number().default(0),
  reviewsCount: z.number().default(0),
  sessionsCount: z.number().default(0),

  createdAt: z.number().int(), // Date.now()
  updatedAt: z.number().int(),

  id: z.string().optional(),
  userId: z.string().optional(),
});

export type SpecialistInput = z.infer<typeof SpecialistSchema>;