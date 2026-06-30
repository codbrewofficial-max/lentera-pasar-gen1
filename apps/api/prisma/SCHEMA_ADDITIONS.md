# Schema Additions — Stage 9H

Tambahkan dua model berikut ke `apps/api/prisma/schema.prisma`.

## 1. Tambahkan relasi di model Website (setelah baris `faqs Faq[]`)

```prisma
  timelines       BusinessTimeline[]
  teamMembers     TeamMember[]
```

## 2. Tambahkan dua model baru (di bagian bawah file, sebelum model Lead)

```prisma
model BusinessTimeline {
  id          String   @id @default(cuid())
  websiteId   String
  website     Website  @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  year        String
  title       String
  description String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([websiteId, sortOrder])
  @@index([websiteId, isActive])
}

model TeamMember {
  id          String   @id @default(cuid())
  websiteId   String
  website     Website  @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  name        String
  role        String?
  bio         String?
  imageUrl    String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([websiteId, sortOrder])
  @@index([websiteId, isActive])
}
```

Setelah edit, jalankan:
```bash
corepack pnpm prisma:generate
corepack pnpm prisma:migrate
```
