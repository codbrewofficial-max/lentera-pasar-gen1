import type { CatalogProductTemplateDefinition } from "../types";

export const premiumCatalogProductTemplate = {
  key: "catalog_product_premium",
  slug: "premium",
  name: "Katalog Produk Premium",
  description: "Template katalog produk premium — gelap, serif, elegan, mengikuti identitas visual Premium Company Profile.",
  slotComponents: {
    "home.hero": "PremiumCatalogHomeHero",
    "home.category_showcase": "PremiumCatalogHomeCategoryShowcase",
    "home.featured_products": "PremiumCatalogHomeFeaturedProducts",
    "home.new_arrivals": "PremiumCatalogHomeNewArrivals",
    "home.value_proposition": "PremiumCatalogHomeValueProposition",
    "home.brand_trust": "PremiumCatalogHomeBrandTrust",

    "products.breadcrumbs": "PremiumCatalogProductsBreadcrumbs",
    "products.product_filter_sidebar": "PremiumCatalogProductsFilterSidebar",
    "products.product_grid": "PremiumCatalogProductsGrid",
    "products.product_pagination": "PremiumCatalogProductsPagination",

    "product_detail.product_core_info": "PremiumCatalogProductDetailCoreInfo",
    "product_detail.product_tabs": "PremiumCatalogProductDetailTabs",
    "product_detail.product_recommendation": "PremiumCatalogProductDetailRecommendation",
    "product_detail.product_reviews": "PremiumCatalogProductDetailReviews",
    "product_detail.product_faq": "PremiumCatalogProductDetailFaq",

    "faq.faq_hero_search": "PremiumCatalogFaqHeroSearch",
    "faq.faq_accordion": "PremiumCatalogFaqAccordion",
    "faq.faq_contact_cta": "PremiumCatalogFaqContactCta",

    "articles.blog_hero": "PremiumCatalogArticlesBlogHero",
    "articles.featured_post": "PremiumCatalogArticlesFeaturedPost",
    "articles.article_category_filter": "PremiumCatalogArticlesCategoryFilter",
    "articles.article_grid": "PremiumCatalogArticlesGrid",
    "articles.article_pagination": "PremiumCatalogArticlesPagination",

    "article_detail.article_header_meta": "PremiumCatalogArticleDetailHeaderMeta",
    "article_detail.article_main_content": "PremiumCatalogArticleDetailMainContent",
    "article_detail.product_contextual_cta": "PremiumCatalogArticleDetailProductCta",
    "article_detail.related_articles": "PremiumCatalogArticleDetailRelatedArticles",
    "article_detail.article_comments": "PremiumCatalogArticleDetailComments",

    "contact.contact_info_cards": "PremiumCatalogContactInfoCards",
    "contact.inquiry_form": "PremiumCatalogContactInquiryForm",
    "contact.maps_location": "PremiumCatalogContactMapsLocation",

    "global.navbar": "PremiumCatalogGlobalNavbar",
    "global.footer": "PremiumCatalogGlobalFooter",
    "global.whatsapp_fab": "PremiumCatalogGlobalWhatsappFab"
  }
} satisfies CatalogProductTemplateDefinition;
