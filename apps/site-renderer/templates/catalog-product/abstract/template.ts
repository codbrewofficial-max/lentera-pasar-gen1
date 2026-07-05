import type { CatalogProductTemplateDefinition } from "../types";

export const abstractCatalogProductTemplate = {
  key: "catalog_product_abstract",
  slug: "abstract",
  name: "Katalog Produk Abstract",
  description: "Template katalog produk abstract — gelap/terang bergantian, gradient blob, font-mono lowercase, mengikuti identitas visual Abstract Company Profile.",
  slotComponents: {
    "home.hero": "AbstractCatalogHomeHero",
    "home.category_showcase": "AbstractCatalogHomeCategoryShowcase",
    "home.featured_products": "AbstractCatalogHomeFeaturedProducts",
    "home.new_arrivals": "AbstractCatalogHomeNewArrivals",
    "home.value_proposition": "AbstractCatalogHomeValueProposition",
    "home.brand_trust": "AbstractCatalogHomeBrandTrust",

    "products.breadcrumbs": "AbstractCatalogProductsBreadcrumbs",
    "products.product_filter_sidebar": "AbstractCatalogProductsFilterSidebar",
    "products.product_grid": "AbstractCatalogProductsGrid",
    "products.product_pagination": "AbstractCatalogProductsPagination",

    "product_detail.product_core_info": "AbstractCatalogProductDetailCoreInfo",
    "product_detail.product_tabs": "AbstractCatalogProductDetailTabs",
    "product_detail.product_recommendation": "AbstractCatalogProductDetailRecommendation",
    "product_detail.product_reviews": "AbstractCatalogProductDetailReviews",
    "product_detail.product_faq": "AbstractCatalogProductDetailFaq",

    "faq.faq_hero_search": "AbstractCatalogFaqHeroSearch",
    "faq.faq_accordion": "AbstractCatalogFaqAccordion",
    "faq.faq_contact_cta": "AbstractCatalogFaqContactCta",

    "articles.blog_hero": "AbstractCatalogArticlesBlogHero",
    "articles.featured_post": "AbstractCatalogArticlesFeaturedPost",
    "articles.article_category_filter": "AbstractCatalogArticlesCategoryFilter",
    "articles.article_grid": "AbstractCatalogArticlesGrid",
    "articles.article_pagination": "AbstractCatalogArticlesPagination",

    "article_detail.article_header_meta": "AbstractCatalogArticleDetailHeaderMeta",
    "article_detail.article_main_content": "AbstractCatalogArticleDetailMainContent",
    "article_detail.product_contextual_cta": "AbstractCatalogArticleDetailProductCta",
    "article_detail.related_articles": "AbstractCatalogArticleDetailRelatedArticles",
    "article_detail.article_comments": "AbstractCatalogArticleDetailComments",

    "contact.contact_info_cards": "AbstractCatalogContactInfoCards",
    "contact.inquiry_form": "AbstractCatalogContactInquiryForm",
    "contact.maps_location": "AbstractCatalogContactMapsLocation",

    "global.navbar": "AbstractCatalogGlobalNavbar",
    "global.footer": "AbstractCatalogGlobalFooter",
    "global.whatsapp_fab": "AbstractCatalogGlobalWhatsappFab"
  }
} satisfies CatalogProductTemplateDefinition;
