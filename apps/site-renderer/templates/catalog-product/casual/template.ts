import type { CatalogProductTemplateDefinition } from "../types";

export const casualCatalogProductTemplate = {
  key: "catalog_product_casual",
  slug: "casual",
  name: "Katalog Produk Casual",
  description: "Template katalog produk casual — ceria, rounded, gradient biru-ungu-koral, mengikuti identitas visual Casual Company Profile.",
  slotComponents: {
    "home.hero": "CasualCatalogHomeHero",
    "home.category_showcase": "CasualCatalogHomeCategoryShowcase",
    "home.featured_products": "CasualCatalogHomeFeaturedProducts",
    "home.new_arrivals": "CasualCatalogHomeNewArrivals",
    "home.value_proposition": "CasualCatalogHomeValueProposition",
    "home.brand_trust": "CasualCatalogHomeBrandTrust",

    "products.breadcrumbs": "CasualCatalogProductsBreadcrumbs",
    "products.product_filter_sidebar": "CasualCatalogProductsFilterSidebar",
    "products.product_grid": "CasualCatalogProductsGrid",
    "products.product_pagination": "CasualCatalogProductsPagination",

    "product_detail.product_core_info": "CasualCatalogProductDetailCoreInfo",
    "product_detail.product_tabs": "CasualCatalogProductDetailTabs",
    "product_detail.product_recommendation": "CasualCatalogProductDetailRecommendation",
    "product_detail.product_reviews": "CasualCatalogProductDetailReviews",
    "product_detail.product_faq": "CasualCatalogProductDetailFaq",

    "faq.faq_hero_search": "CasualCatalogFaqHeroSearch",
    "faq.faq_accordion": "CasualCatalogFaqAccordion",
    "faq.faq_contact_cta": "CasualCatalogFaqContactCta",

    "articles.blog_hero": "CasualCatalogArticlesBlogHero",
    "articles.featured_post": "CasualCatalogArticlesFeaturedPost",
    "articles.article_category_filter": "CasualCatalogArticlesCategoryFilter",
    "articles.article_grid": "CasualCatalogArticlesGrid",
    "articles.article_pagination": "CasualCatalogArticlesPagination",

    "article_detail.article_header_meta": "CasualCatalogArticleDetailHeaderMeta",
    "article_detail.article_main_content": "CasualCatalogArticleDetailMainContent",
    "article_detail.product_contextual_cta": "CasualCatalogArticleDetailProductCta",
    "article_detail.related_articles": "CasualCatalogArticleDetailRelatedArticles",
    "article_detail.article_comments": "CasualCatalogArticleDetailComments",

    "contact.contact_info_cards": "CasualCatalogContactInfoCards",
    "contact.inquiry_form": "CasualCatalogContactInquiryForm",
    "contact.maps_location": "CasualCatalogContactMapsLocation",

    "global.navbar": "CasualCatalogGlobalNavbar",
    "global.footer": "CasualCatalogGlobalFooter",
    "global.whatsapp_fab": "CasualCatalogGlobalWhatsappFab"
  }
} satisfies CatalogProductTemplateDefinition;
