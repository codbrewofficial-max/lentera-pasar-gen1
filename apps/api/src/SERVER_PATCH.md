# server.ts Patch — Stage 9H

Ada 3 tempat yang perlu diedit di `apps/api/src/server.ts`.

---

## PATCH 1 — Tambah Zod schemas

Cari baris: `const brandBody = z.object({`
Tambahkan SETELAH closing `});` dari brandBody:

```typescript
const timelineBody = z.object({
  year: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});

const teamMemberBody = z.object({
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
```

---

## PATCH 2 — Public page data fetcher

Cari baris:
```
const [services, portfolios, testimonials, brands, articles, faqs, articleCategories, portfolioCategories] = await Promise.all([
```

Ganti destructuring-nya menjadi:
```
const [services, portfolios, testimonials, brands, articles, faqs, articleCategories, portfolioCategories, timelines, teamMembers] = await Promise.all([
```

Di dalam array Promise.all, tambahkan 2 item ini DI PALING AKHIR (sebelum `]);`):
```typescript
    prisma.businessTimeline.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.teamMember.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } })
```

Lalu cari blok `data: {` di dalam section `.map(...)`, tambahkan di dalamnya:
```typescript
            timelines,
            teamMembers,
```

---

## PATCH 3 — Register CRUD routes

Cari baris: `registerCrud("brand-partners", brandBody);`
Tambahkan SETELAH baris itu, paste kode dari file `SERVER_CRUD_SNIPPET.ts` di folder ini.
