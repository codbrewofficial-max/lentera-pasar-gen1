# Company Profile Template Renderer Architecture

Folder ini adalah resolver resmi untuk template Company Profile.

## Contract

Template Pack JSON mendaftarkan section melalui:

```json
{
  "templateKey": "company_profile_formal",
  "sectionKey": "company_profile_formal.home.hero",
  "slotKey": "home.hero",
  "component": "HeroSection",
  "variant": "default"
}
```

Kode visual tetap berada dan dibuild di `apps/site-renderer`.
ZIP Template Pack tidak membawa kode React/Next.js; ZIP hanya membawa config JSON.

## Resolver

Runtime renderer memakai urutan resolve berikut:

```text
section.templateKey / section.templateTheme / section.sectionKey
→ companyProfileTemplateRegistry
→ slotComponents[slotKey]
→ section.component
→ default slot component
→ fallback empty section
```

## 4 template resmi

```text
company_profile_formal
company_profile_abstract
company_profile_casual
company_profile_premium
```

Stage 9G.1 belum membuat desain final per tema. Semua template sementara diarahkan ke component stabil lama.
Stage 9G.2+ boleh mengganti mapping per slot ke component hasil pecahan Google AI Studio.
