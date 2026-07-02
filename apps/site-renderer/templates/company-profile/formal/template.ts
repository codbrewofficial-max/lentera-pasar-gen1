import type { CompanyProfileTemplateDefinition } from "../types";

export const formalCompanyProfileTemplate = {
  key: "company_profile_formal",
  slug: "formal",
  name: "Company Profile Formal",
  description: "Template company profile formal berbasis output Google AI Studio yang sudah dipecah ke 8 halaman dan 37 section.",
  slotComponents: {
    "home.hero": "FormalHomeHero",
    "home.profile_summary": "FormalHomeProfileSummary",
    "home.service_preview": "FormalHomeServicePreview",
    "home.portfolio_preview": "FormalHomePortfolioPreview",
    "home.trust_proof": "FormalHomeTrustProof",
    "home.cta_contact": "FormalHomeCtaContact",

    "about.organization_profile": "FormalAboutOrganizationProfile",
    "about.history_timeline": "FormalAboutHistoryTimeline",
    "about.vision_mission": "FormalAboutVisionMission",
    "about.value_statement": "FormalAboutValueStatement",
    "about.team_highlight": "FormalAboutTeamHighlight",

    "services.service_hero": "FormalServicesHero",
    "services.service_grid": "FormalServicesGrid",
    "services.service_process": "FormalServicesProcess",
    "services.service_benefits": "FormalServicesBenefits",
    "services.service_faq": "FormalServicesFaq",

    "portfolio.portfolio_hero": "FormalPortfolioHero",
    "portfolio.portfolio_category": "FormalPortfolioCategory",
    "portfolio.portfolio_grid": "FormalPortfolioGrid",
    "portfolio.case_highlight": "FormalPortfolioCaseHighlight",
    "portfolio.portfolio_cta": "FormalPortfolioCta",

    "articles.article_hero": "FormalArticlesHero",
    "articles.featured_article": "FormalFeaturedArticle",
    "articles.article_preview": "FormalArticlePreview",

    "article_detail.article_detail_hero": "FormalArticleDetailHero",
    "article_detail.article_content": "FormalArticleContent",
    "article_detail.related_articles": "FormalRelatedArticles",
    "article_detail.article_cta": "FormalArticleCta",

    "portfolio_detail.portfolio_detail_hero": "FormalPortfolioDetailHero",
    "portfolio_detail.portfolio_detail_content": "FormalPortfolioDetailContent",
    "portfolio_detail.related_portfolios": "FormalRelatedPortfolios",
    "portfolio_detail.portfolio_detail_cta": "FormalPortfolioDetailCta",

    "contact.contact_hero": "FormalContactHero",
    "contact.contact_information": "FormalContactInformation",
    "contact.maps_location": "FormalMapsLocation",
    "contact.contact_faq": "FormalContactFaq",
    "contact.contact_cta": "FormalContactCta"
  }
} satisfies CompanyProfileTemplateDefinition;
