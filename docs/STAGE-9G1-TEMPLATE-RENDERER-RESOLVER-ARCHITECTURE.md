# Stage 9G.1 — Template Renderer Resolver Architecture

Stage ini menyiapkan arsitektur renderer agar Template Pack JSON bisa menunjuk ke kode visual Next.js yang sudah dibuild di `apps/site-renderer`.

## Prinsip

- Kode visual React/Next.js tetap berada di `apps/site-renderer`.
- ZIP Template Pack tetap berisi JSON config saja.
- Owner tetap memilih section per slot.
- Public renderer membaca `templateKey`, `sectionKey`, `slotKey`, dan `component` dari payload.
- Renderer resolve ke component yang sudah terdaftar.

## Template resmi Company Profile

```text
company_profile_formal
company_profile_abstract
company_profile_casual
company_profile_premium
```

## Runtime resolver

```text
section.templateKey / section.templateTheme / section.sectionKey
→ templates/company-profile/registry.ts
→ slotComponents[slotKey]
→ section.component
→ default slot component
→ fallback empty section
```

## API payload section

Setiap section public sekarang membawa metadata:

```json
{
  "slotKey": "home.hero",
  "sectionKey": "company_profile_formal.home.hero",
  "templateKey": "company_profile_formal",
  "templateName": "Company Profile Formal",
  "templateTheme": "formal",
  "component": "HeroSection",
  "variant": "default"
}
```

## Template Pack JSON

Section JSON boleh menambahkan `templateKey`. Kalau ada, nilainya harus sama dengan `manifest.templatePackKey`.

```json
{
  "templateKey": "company_profile_formal",
  "sectionKey": "company_profile_formal.home.hero",
  "websiteType": "company_profile",
  "pageKey": "home",
  "slotKey": "home.hero",
  "name": "Hero Formal",
  "component": "HeroSection",
  "variant": "default",
  "schema": [],
  "defaultContent": {}
}
```

## Catatan penting

Stage 9G.1 belum membuat desain Formal/Premium/Casual/Abstract final. Semua template sementara masih diarahkan ke component stabil lama. Stage berikutnya membuat template visual satu per satu dari output Google AI Studio.
