import type { CompanyProfileTemplateDefinition } from "../types";

export const casualCompanyProfileTemplate = {
  key: "company_profile_casual",
  slug: "casual",
  name: "Company Profile Casual",
  description: "Template company profile ramah, ringan, dan mudah didekati berbasis output Google AI Studio, dipecah ke 8 halaman dan 37 section.",
  slotComponents: {
    "home.hero": "CasualHomeHero",
    "home.profile_summary": "CasualHomeProfileSummary",
    "home.service_preview": "CasualHomeServicePreview",
    "home.portfolio_preview": "CasualHomePortfolioPreview",
    "home.trust_proof": "CasualHomeTrustProof",
    "home.cta_contact": "CasualHomeCtaContact",

    "about.organization_profile": "CasualAboutOrganizationProfile",
    "about.history_timeline": "CasualAboutHistoryTimeline",
    "about.vision_mission": "CasualAboutVisionMission",
    "about.value_statement": "CasualAboutValueStatement",
    "about.team_highlight": "CasualAboutTeamHighlight",

    "services.service_hero": "CasualServicesHero",
    "services.service_grid": "CasualServicesGrid",
    "services.service_process": "CasualServicesProcess",
    "services.service_benefits": "CasualServicesBenefits",
    "services.service_faq": "CasualServicesFaq",

    "portfolio.portfolio_hero": "CasualPortfolioHero",
    "portfolio.portfolio_category": "CasualPortfolioCategory",
    "portfolio.portfolio_grid": "CasualPortfolioGrid",
    "portfolio.case_highlight": "CasualPortfolioCaseHighlight",
    "portfolio.portfolio_cta": "CasualPortfolioCta",

    "articles.article_hero": "CasualArticlesHero",
    "articles.featured_article": "CasualFeaturedArticle",
    "articles.article_preview": "CasualArticlePreview",

    "article_detail.article_content": "CasualArticleContent",
    "article_detail.related_articles": "CasualRelatedArticles",
    "article_detail.article_cta": "CasualArticleCta",

    "portfolio_detail.portfolio_detail_content": "CasualPortfolioDetailContent",
    "portfolio_detail.related_portfolios": "CasualRelatedPortfolios",
    "portfolio_detail.portfolio_detail_cta": "CasualPortfolioDetailCta",

    "contact.contact_hero": "CasualContactHero",
    "contact.contact_information": "CasualContactInformation",
    "contact.maps_location": "CasualMapsLocation",
    "contact.contact_faq": "CasualContactFaq",
    "contact.contact_cta": "CasualContactCta",
    "global.navbar": "CasualGlobalNavbar",
    "global.footer": "CasualGlobalFooter"
  }
} satisfies CompanyProfileTemplateDefinition;
