import type { CompanyProfileTemplateDefinition } from "../types";

export const abstractCompanyProfileTemplate = {
  key: "company_profile_abstract",
  slug: "abstract",
  name: "Company Profile Abstract",
  description: "Template company profile kreatif, eksperimental, dan ekspresif berbasis output Google AI Studio, dipecah ke 8 halaman dan 37 section.",
  slotComponents: {
    "home.hero": "AbstractHomeHero",
    "home.profile_summary": "AbstractHomeProfileSummary",
    "home.service_preview": "AbstractHomeServicePreview",
    "home.portfolio_preview": "AbstractHomePortfolioPreview",
    "home.trust_proof": "AbstractHomeTrustProof",
    "home.cta_contact": "AbstractHomeCtaContact",

    "about.organization_profile": "AbstractAboutOrganizationProfile",
    "about.history_timeline": "AbstractAboutHistoryTimeline",
    "about.vision_mission": "AbstractAboutVisionMission",
    "about.value_statement": "AbstractAboutValueStatement",
    "about.team_highlight": "AbstractAboutTeamHighlight",

    "services.service_hero": "AbstractServicesHero",
    "services.service_grid": "AbstractServicesGrid",
    "services.service_process": "AbstractServicesProcess",
    "services.service_benefits": "AbstractServicesBenefits",
    "services.service_faq": "AbstractServicesFaq",

    "portfolio.portfolio_hero": "AbstractPortfolioHero",
    "portfolio.portfolio_category": "AbstractPortfolioCategory",
    "portfolio.portfolio_grid": "AbstractPortfolioGrid",
    "portfolio.case_highlight": "AbstractPortfolioCaseHighlight",
    "portfolio.portfolio_cta": "AbstractPortfolioCta",

    "articles.article_hero": "AbstractArticlesHero",
    "articles.featured_article": "AbstractFeaturedArticle",
    "articles.article_preview": "AbstractArticlePreview",

    "article_detail.article_content": "AbstractArticleContent",
    "article_detail.related_articles": "AbstractRelatedArticles",
    "article_detail.article_cta": "AbstractArticleCta",

    "portfolio_detail.portfolio_detail_content": "AbstractPortfolioDetailContent",
    "portfolio_detail.related_portfolios": "AbstractRelatedPortfolios",
    "portfolio_detail.portfolio_detail_cta": "AbstractPortfolioDetailCta",

    "contact.contact_hero": "AbstractContactHero",
    "contact.contact_information": "AbstractContactInformation",
    "contact.maps_location": "AbstractMapsLocation",
    "contact.contact_faq": "AbstractContactFaq",
    "contact.contact_cta": "AbstractContactCta",
    "global.navbar": "AbstractGlobalNavbar",
    "global.footer": "AbstractGlobalFooter"
  }
} satisfies CompanyProfileTemplateDefinition;
