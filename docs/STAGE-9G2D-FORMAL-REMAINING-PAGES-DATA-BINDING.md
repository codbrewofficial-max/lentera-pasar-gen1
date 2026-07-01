# Stage 9G.2D — Formal Remaining Pages Data Binding

Stage ini mengikat template Formal hasil Google AI Studio ke data owner untuk halaman selain Home.

## Prinsip

- Desain Google AI Studio tetap dipertahankan.
- Yang diubah adalah sumber data: dummy data diganti payload owner/site-renderer.
- Home tetap mengikuti patch 9G.2C.
- Contact form Formal sekarang submit ke endpoint contact Lentera Pasar.

## Halaman/section yang di-bind

About:
- about.organization_profile
- about.history_timeline
- about.vision_mission
- about.value_statement
- about.team_highlight

Services:
- services.service_hero
- services.service_grid
- services.service_process
- services.service_benefits
- services.service_faq

Portfolio:
- portfolio.portfolio_hero
- portfolio.portfolio_category
- portfolio.portfolio_grid
- portfolio.case_highlight
- portfolio.portfolio_cta

Articles:
- articles.article_hero
- articles.featured_article
- articles.article_preview

Article Detail:
- article_detail.article_detail_hero
- article_detail.article_content
- article_detail.related_articles
- article_detail.article_cta

Contact:
- contact.contact_hero
- contact.contact_information
- contact.maps_location
- contact.contact_faq
- contact.contact_cta

## Batasan

Beberapa field advanced seperti `team`, `timeline`, `values`, `steps`, dan `benefits` akan membaca array dari `section.content` jika ada. Kalau belum ada dari dashboard, renderer memakai fallback owner-friendly dari business profile.
