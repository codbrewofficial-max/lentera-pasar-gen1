# Stage 9A — Backend Security & Observability

Stage ini menyiapkan backend Lentera Pasar agar lebih siap dipakai untuk public testing.

## Mode Runtime

Backend mengenal mode berikut melalui `APP_MODE`:

- `development`: mode lokal, lebih longgar untuk debugging.
- `production`: mode runtime production, env wajib aman.
- `deployment`: mode pre-deploy/deployment, strict seperti production dan cocok untuk validasi env sebelum naik server.
- `test`: mode test.

Production dan deployment dianggap `production-like`, sehingga secret lemah dan CORS wildcard ditolak.

## Security yang Ditambahkan

- JWT secret wajib kuat di production/deployment.
- JWT expiry diatur via `JWT_EXPIRES_IN`.
- `IP_HASH_SECRET` dipakai untuk hashing IP tracking/contact.
- `INTERNAL_API_KEY` dipakai untuk endpoint server-to-server/deployment.
- CORS explicit origin dan tidak wildcard di production/deployment.
- Request body limit via `REQUEST_BODY_LIMIT_BYTES`.
- Template upload limit via `TEMPLATE_UPLOAD_MAX_BYTES`.
- Fastify `maxParamLength` tetap 500 agar slug artikel SEO panjang tetap bisa diakses.

## Rate Limiter

Rate limit dipisahkan per grup:

- Global API: `RATE_LIMIT_GLOBAL_MAX` per menit.
- Auth login/register: `RATE_LIMIT_AUTH_MAX` per 10 menit.
- Contact public form: `RATE_LIMIT_CONTACT_MAX` per 10 menit.
- Tracking public events: `RATE_LIMIT_TRACKING_MAX` per menit.
- Template upload: `RATE_LIMIT_TEMPLATE_UPLOAD_MAX` per jam.

## Observability

- Response membawa header `x-request-id`.
- Request selesai dicatat dengan method, URL, status code, response time, dan request id.
- Error dicatat di server log, tetapi response production tidak membocorkan stack trace.
- Authorization, cookie, API key, password, dan passwordHash di-redact dari log.

## Health Endpoints

Public/live:

```http
GET /api/v1/health
GET /api/v1/health/live
```

Protected readiness/deployment, wajib header `x-lentera-api-key`:

```http
GET /api/v1/health/ready
GET /api/v1/deployment/health
```

Contoh:

```bash
curl -H "x-lentera-api-key: $INTERNAL_API_KEY" http://localhost:4000/api/v1/health/ready
```

## Deployment Check

Jalankan:

```bash
corepack pnpm check:deployment
```

Script ini memvalidasi:

- `DATABASE_URL`
- `JWT_SECRET`
- `IP_HASH_SECRET`
- `CORS_ORIGIN`
- `INTERNAL_API_KEY`
- `JWT_EXPIRES_IN`

Untuk production/deployment, gunakan secret asli minimal 32 karakter dan CORS origin eksplisit.

## Contoh Production Env

```env
APP_MODE=production
NODE_ENV=production
DATABASE_URL="postgresql://..."
API_PORT=4000
JWT_SECRET="isi-dengan-random-strong-secret-minimal-32-karakter"
JWT_EXPIRES_IN="1d"
IP_HASH_SECRET="isi-dengan-random-strong-secret-minimal-32-karakter"
INTERNAL_API_KEY="isi-dengan-random-strong-api-key-minimal-32-karakter"
CORS_ORIGIN="https://admin.domain.com,https://website.domain.com"
LOG_LEVEL="info"
LOG_PRETTY="false"
REQUEST_BODY_LIMIT_BYTES=1048576
TEMPLATE_UPLOAD_MAX_BYTES=5242880
```

## Verifikasi

```bash
corepack pnpm prisma:validate
corepack pnpm prisma:generate
corepack pnpm build:api
corepack pnpm smoke:api
corepack pnpm check:deployment
```
