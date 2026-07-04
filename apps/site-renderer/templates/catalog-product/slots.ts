export const CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS = {
  "home.hero": "CatalogProductCleanHomeHero",
  "home.category_showcase": "CatalogProductCleanHomeCategoryShowcase",
  "home.featured_products": "CatalogProductCleanHomeFeaturedProducts",
  "home.new_arrivals": "CatalogProductCleanHomeNewArrivals",
  "home.value_proposition": "CatalogProductCleanHomeValueProposition",
  "home.brand_trust": "CatalogProductCleanHomeBrandTrust",

  "products.breadcrumbs": "CatalogProductCleanProductsBreadcrumbs",
  "products.product_filter_sidebar": "CatalogProductCleanProductsFilterSidebar",
  "products.product_grid": "CatalogProductCleanProductsGrid",
  "products.product_pagination": "CatalogProductCleanProductsPagination",

  "product_detail.product_core_info": "CatalogProductCleanProductDetailCoreInfo",
  "product_detail.product_tabs": "CatalogProductCleanProductDetailTabs",
  "product_detail.product_recommendation": "CatalogProductCleanProductDetailRecommendation",
  "product_detail.product_reviews": "CatalogProductCleanProductDetailReviews",
  "product_detail.product_faq": "CatalogProductCleanProductDetailFaq",

  "faq.faq_hero_search": "CatalogProductCleanFaqHeroSearch",
  "faq.faq_accordion": "CatalogProductCleanFaqAccordion",
  "faq.faq_contact_cta": "CatalogProductCleanFaqContactCta",

  "articles.blog_hero": "CatalogProductCleanArticlesBlogHero",
  "articles.featured_post": "CatalogProductCleanArticlesFeaturedPost",
  "articles.article_category_filter": "CatalogProductCleanArticlesCategoryFilter",
  "articles.article_grid": "CatalogProductCleanArticlesGrid",
  "articles.article_pagination": "CatalogProductCleanArticlesPagination",

  "article_detail.article_header_meta": "CatalogProductCleanArticleDetailHeaderMeta",
  "article_detail.article_main_content": "CatalogProductCleanArticleDetailMainContent",
  "article_detail.product_contextual_cta": "CatalogProductCleanArticleDetailProductCta",
  "article_detail.related_articles": "CatalogProductCleanArticleDetailRelatedArticles",
  "article_detail.article_comments": "CatalogProductCleanArticleDetailComments",

  "contact.contact_info_cards": "CatalogProductCleanContactInfoCards",
  "contact.inquiry_form": "CatalogProductCleanContactInquiryForm",
  "contact.maps_location": "CatalogProductCleanContactMapsLocation",

  // Navbar/Footer/WhatsApp FAB pakai pola yang sama dengan company-profile/slots.ts:
  // default langsung menunjuk ke komponen Formal (dibangun di Round terakhir) supaya begitu
  // Formal selesai, semua tema lain otomatis punya chrome yang berfungsi tanpa nunggu tema
  // "clean" punya navbar/footer sendiri.
  "global.navbar": "FormalCatalogGlobalNavbar",
  "global.footer": "FormalCatalogGlobalFooter",
  "global.whatsapp_fab": "FormalCatalogGlobalWhatsappFab"
} as const;

export type CatalogProductSlotKey = keyof typeof CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS;
export type CatalogProductComponentName = (typeof CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS)[CatalogProductSlotKey];
