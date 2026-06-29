# AI Catalog Assistant Stage 7 — Manual Testing Guide

## Windows + Laragon

Masuk ke folder Stage 7:

```bat
cd /d D:\Work\DOCUMENT\LAB.KERKOM.IT\FILE_FILE\WEBSITE\PROJECT\ai-catalog-assistant-stage7
```

## Setup env

```bat
copy .env.example .env
copy .env apps\api\.env
```

Edit `apps\api\.env`, pastikan:

```env
DATABASE_URL="postgresql://postgres:password_kamu@localhost:5432/ai_catalog_assistant?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=4000
JWT_SECRET=dev_jwt_secret_change_me
SIMULATOR_PROCESSING_MODE=sync
AI_PROVIDER=mock
WHATSAPP_ENABLED=false
```

## Setup database

Buat database PostgreSQL:

```sql
CREATE DATABASE ai_catalog_assistant;
```

Lalu:

```bat
npm install --no-audit --no-fund
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev:api
```

## Akun demo

```txt
tenant_slug: jaya-motor
email: owner@jayamotor.test
password: password
```

## Postman

Import file JSON collection dan environment dari ZIP ini.

Pilih environment:

```txt
AI Catalog Assistant Stage 7 - Local
```

Jalankan:

1. Health
2. Login - Jaya Motor
3. Me
4. Get Tenant Profile
5. List Catalog Items
6. List FAQs
7. Simulator - Produk Tidak Ada / Handoff
8. List Conversations
9. Get Conversation Messages
10. Get Conversation AI Runs
11. List Open Handoffs
12. Report Overview
