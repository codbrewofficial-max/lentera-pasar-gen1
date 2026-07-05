import type { CatalogProductTemplateDefinition } from "../types";

// Diisi bertahap: Round Home -> Products+Detail -> FAQ -> Articles+Detail -> Contact+Global.
// Slot yang belum ada entrinya di sini otomatis fallback ke CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS
// (lewat resolveCatalogProductSectionComponentName di registry.ts) dan tampil sebagai
// "Template section belum tersedia" sampai komponennya dibangun.
export const formalCatalogProductTemplate = {
  key: "catalog_product_formal",
  slug: "formal",
  name: "Katalog Produk Formal",
  description: "Template katalog produk formal, dibangun section demi section mengikuti pola Company Profile Formal.",
  slotComponents: {
    "home.hero": "FormalCatalogHomeHero",
    "home.category_showcase": "FormalCatalogHomeCategoryShowcase",
    "home.featured_products": "FormalCatalogHomeFeaturedProducts",
    "home.new_arrivals": "FormalCatalogHomeNewArrivals",
    "home.value_proposition": "FormalCatalogHomeValueProposition",
    "home.brand_trust": "FormalCatalogHomeBrandTrust",

    "products.breadcrumbs": "FormalCatalogProductsBreadcrumbs",
    "products.product_filter_sidebar": "FormalCatalogProductsFilterSidebar",
    "products.product_grid": "FormalCatalogProductsGrid",
    "products.product_pagination": "FormalCatalogProductsPagination",

    "product_detail.product_core_info": "FormalCatalogProductDetailCoreInfo",
    "product_detail.product_tabs": "FormalCatalogProductDetailTabs",
    "product_detail.product_recommendation": "FormalCatalogProductDetailRecommendation",
    "product_detail.product_reviews": "FormalCatalogProductDetailReviews",
    "product_detail.product_faq": "FormalCatalogProductDetailFaq",

    "faq.faq_hero_search": "FormalCatalogFaqHeroSearch",
    "faq.faq_accordion": "FormalCatalogFaqAccordion",
    "faq.faq_contact_cta": "FormalCatalogFaqContactCta",

    "articles.blog_hero": "FormalCatalogArticlesBlogHero",
    "articles.featured_post": "FormalCatalogArticlesFeaturedPost",
    "articles.article_category_filter": "FormalCatalogArticlesCategoryFilter",
    "articles.article_grid": "FormalCatalogArticlesGrid",
    "articles.article_pagination": "FormalCatalogArticlesPagination",

    "article_detail.article_header_meta": "FormalCatalogArticleDetailHeaderMeta",
    "article_detail.article_main_content": "FormalCatalogArticleDetailMainContent",
    "article_detail.product_contextual_cta": "FormalCatalogArticleDetailProductCta",
    "article_detail.related_articles": "FormalCatalogArticleDetailRelatedArticles",
    "article_detail.article_comments": "FormalCatalogArticleDetailComments",

    "contact.contact_info_cards": "FormalCatalogContactInfoCards",
    "contact.inquiry_form": "FormalCatalogContactInquiryForm",
    "contact.maps_location": "FormalCatalogContactMapsLocation",

    "global.navbar": "FormalCatalogGlobalNavbar",
    "global.footer": "FormalCatalogGlobalFooter",
    "global.whatsapp_fab": "FormalCatalogGlobalWhatsappFab"
  }
} satisfies CatalogProductTemplateDefinition;
