import { NextResponse } from 'next/server';

type Specialist = {
  id: string;
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
  rating: number;
  reviewsCount: number;
  sessionsCount: number;
};
const MOCK: Specialist[] = Array.from({ length: 42 }).map((_, i) => ({
  id: String(i + 1),
  fullName: `Especialista ${i + 1}`,
  profession: (['Psicologia','Psiquiatria','Neuropsicologia','Terapia Ocupacional','Outros'] as const)[i % 5],
  crp: `CRP-12/${10000 + i}`,
  yearsExperience: (i % 15) + 1,
  avatarUrl: `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
  primaryCondition: ['TDAH','TEA','Ansiedade','Depressão','Transtornos de Aprendizagem'][i % 5],
  tags: ['Infanto-juvenil','Adultos','Casais','Orientação Parental','Neuropsico'].slice(0, (i % 5) + 1),
  languages: ['Português', ...(i % 3 === 0 ? ['Inglês'] : [])],
  bio: 'Atendimento humanizado, foco em evidências e plano terapêutico personalizado.',
  modality: (['online','presencial','híbrido'] as const)[i % 3],
  priceFrom: 150 + (i * 10),
  city: ['São Paulo','Rio de Janeiro','Belo Horizonte','Curitiba','Florianópolis'][i % 5],
  state: ['SP','RJ','MG','PR','SC'][i % 5],
  acceptsInsurance: i % 2 === 0,
  rating: 4 + ((i % 9) / 10),
  reviewsCount: 5 + (i % 20),
  sessionsCount: 15 + i * 2,
}));

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      name = '',
      profession = '',
      city = '',
      state = '',
      modality = '',
      acceptsInsurance,
      minPrice = 0,
      maxPrice = 10000,
      page = 1,
      pageSize = 12,
      language = '',
    } = body as {
      name?: string;
      profession?: string;
      city?: string;
      state?: string;
      modality?: string;
      acceptsInsurance?: boolean | '';
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      pageSize?: number;
      language?: string;
    };

    let data = [...MOCK];

    // filtros
    if (name) {
      const q = name.toLowerCase();
      data = data.filter(s =>
        s.fullName.toLowerCase().includes(q) ||
        (s.primaryCondition ?? '').toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (profession) data = data.filter(s => s.profession === profession);
    if (city) data = data.filter(s => (s.city ?? '').toLowerCase().includes(city.toLowerCase()));
    if (state) data = data.filter(s => (s.state ?? '').toLowerCase() === state.toLowerCase());
    if (modality) data = data.filter(s => s.modality === modality);
    if (language) data = data.filter(s => s.languages.map(l => l.toLowerCase()).includes(language.toLowerCase()));
    if (acceptsInsurance !== '' && acceptsInsurance !== undefined) {
      data = data.filter(s => Boolean(s.acceptsInsurance) === Boolean(acceptsInsurance));
    }
    data = data.filter(s => (s.priceFrom ?? 0) >= minPrice && (s.priceFrom ?? 0) <= maxPrice);

    // ordenação simples (ex: rating desc, depois preço)
    data.sort((a, b) => (b.rating - a.rating) || ((a.priceFrom ?? 0) - (b.priceFrom ?? 0)));

    // paginação
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const slice = data.slice(start, end);

    const hasPreviousPage = page > 1;
    const hasNextPage = end < data.length;

    return NextResponse.json({
      specialists: slice,
      total: data.length,
      page,
      pageSize,
      hasPreviousPage,
      hasNextPage,
    });
  } catch (e) {
    return NextResponse.json({ error: 'mock-failed' }, { status: 500 });
  }
}