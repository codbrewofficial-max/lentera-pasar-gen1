import type { CompanyProfileTemplateDefinition } from "../types";

export const premiumCompanyProfileTemplate = {
  key: "company_profile_premium",
  slug: "premium",
  name: "Company Profile Premium",
  description: "Template company profile elegan dan eksklusif berbasis output Google AI Studio, dipecah ke 7 halaman dan 33 section.",
  slotComponents: {
    "home.hero": "PremiumHomeHero",
    "home.profile_summary": "PremiumHomeProfileSummary",
    "home.service_preview": "PremiumHomeServicePreview",
    "home.portfolio_preview": "PremiumHomePortfolioPreview",
    "home.trust_proof": "PremiumHomeTrustProof",
    "home.cta_contact": "PremiumHomeCtaContact",

    "about.organization_profile": "PremiumAboutOrganizationProfile",
    "about.history_timeline": "PremiumAboutHistoryTimeline",
    "about.vision_mission": "PremiumAboutVisionMission",
    "about.value_statement": "PremiumAboutValueStatement",
    "about.team_highlight": "PremiumAboutTeamHighlight",

    "services.service_hero": "PremiumServicesHero",
    "services.service_grid": "PremiumServicesGrid",
    "services.service_process": "PremiumServicesProcess",
    "services.service_benefits": "PremiumServicesBenefits",
    "services.service_faq": "PremiumServicesFaq",

    "portfolio.portfolio_hero": "PremiumPortfolioHero",
    "portfolio.portfolio_category": "PremiumPortfolioCategory",
    "portfolio.portfolio_grid": "PremiumPortfolioGrid",
    "portfolio.case_highlight": "PremiumPortfolioCaseHighlight",
    "portfolio.portfolio_cta": "PremiumPortfolioCta",

    "articles.article_hero": "PremiumArticlesHero",
    "articles.featured_article": "PremiumFeaturedArticle",
    "articles.article_preview": "PremiumArticlePreview",

    "article_detail.article_detail_hero": "PremiumArticleDetailHero",
    "article_detail.article_content": "PremiumArticleContent",
    "article_detail.related_articles": "PremiumRelatedArticles",
    "article_detail.article_cta": "PremiumArticleCta",

    "contact.contact_hero": "PremiumContactHero",
    "contact.contact_information": "PremiumContactInformation",
    "contact.maps_location": "PremiumMapsLocation",
    "contact.contact_faq": "PremiumContactFaq",
    "contact.contact_cta": "PremiumContactCta"
  }
} satisfies CompanyProfileTemplateDefinition;
