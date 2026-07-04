export const COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS = {
  "home.hero": "CompanyProfileCleanHomeHero",
  "home.profile_summary": "CompanyProfileCleanHomeProfileSummary",
  "home.service_preview": "CompanyProfileCleanHomeServicePreview",
  "home.portfolio_preview": "CompanyProfileCleanHomePortfolioPreview",
  "home.trust_proof": "CompanyProfileCleanHomeTrustProof",
  "home.cta_contact": "CompanyProfileCleanHomeCtaContact",

  "about.organization_profile": "CompanyProfileCleanAboutOrganizationProfile",
  "about.history_timeline": "CompanyProfileCleanAboutHistoryTimeline",
  "about.vision_mission": "CompanyProfileCleanAboutVisionMission",
  "about.value_statement": "CompanyProfileCleanAboutValueStatement",
  "about.team_highlight": "CompanyProfileCleanAboutTeamHighlight",

  "services.service_hero": "CompanyProfileCleanServicesHero",
  "services.service_grid": "CompanyProfileCleanServicesGrid",
  "services.service_process": "CompanyProfileCleanServicesProcess",
  "services.service_benefits": "CompanyProfileCleanServicesBenefits",
  "services.service_faq": "CompanyProfileCleanServicesFaq",

  "portfolio.portfolio_hero": "CompanyProfileCleanPortfolioHero",
  "portfolio.portfolio_category": "CompanyProfileCleanPortfolioCategory",
  "portfolio.portfolio_grid": "CompanyProfileCleanPortfolioGrid",
  "portfolio.case_highlight": "CompanyProfileCleanPortfolioCaseHighlight",
  "portfolio.portfolio_cta": "CompanyProfileCleanPortfolioCta",

  "articles.article_hero": "CompanyProfileCleanArticlesHero",
  "articles.featured_article": "CompanyProfileCleanFeaturedArticle",
  "articles.article_preview": "CompanyProfileCleanArticlePreview",

  "article_detail.article_content": "CompanyProfileCleanArticleContent",
  "article_detail.related_articles": "CompanyProfileCleanRelatedArticles",
  "article_detail.article_cta": "CompanyProfileCleanArticleCta",

  "portfolio_detail.portfolio_detail_content": "CompanyProfileCleanPortfolioDetailContent",
  "portfolio_detail.related_portfolios": "CompanyProfileCleanRelatedPortfolios",
  "portfolio_detail.portfolio_detail_cta": "CompanyProfileCleanPortfolioDetailCta",

  "contact.contact_hero": "CompanyProfileCleanContactHero",
  "contact.contact_information": "CompanyProfileCleanContactInformation",
  "contact.maps_location": "CompanyProfileCleanMapsLocation",
  "contact.contact_faq": "CompanyProfileCleanContactFaq",
  "contact.contact_cta": "CompanyProfileCleanContactCta",

  "global.navbar": "FormalGlobalNavbar",
  "global.footer": "FormalGlobalFooter"
} as const;

export type CompanyProfileSlotKey = keyof typeof COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS;
export type CompanyProfileComponentName = (typeof COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS)[CompanyProfileSlotKey];