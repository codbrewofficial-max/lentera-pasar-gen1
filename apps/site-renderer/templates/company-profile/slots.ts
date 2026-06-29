export const COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS = {
  "home.hero": "HeroSection",
  "home.profile_summary": "ProfileSummarySection",
  "home.service_preview": "ServicePreviewSection",
  "home.portfolio_preview": "PortfolioPreviewSection",
  "home.trust_proof": "TrustProofSection",
  "home.cta_contact": "CtaContactSection",

  "about.organization_profile": "OrganizationProfileSection",
  "about.history_timeline": "HistoryTimelineSection",
  "about.vision_mission": "VisionMissionSection",
  "about.value_statement": "ValueStatementSection",
  "about.team_highlight": "TeamHighlightSection",

  "services.service_hero": "ServiceHeroSection",
  "services.service_grid": "ServiceGridSection",
  "services.service_process": "ServiceProcessSection",
  "services.service_benefits": "ServiceBenefitsSection",
  "services.service_faq": "ServiceFaqSection",

  "portfolio.portfolio_hero": "PortfolioHeroSection",
  "portfolio.portfolio_category": "PortfolioCategorySection",
  "portfolio.portfolio_grid": "PortfolioGridSection",
  "portfolio.case_highlight": "CaseHighlightSection",
  "portfolio.portfolio_cta": "PortfolioCtaSection",

  "articles.article_hero": "ArticleHeroSection",
  "articles.featured_article": "FeaturedArticleSection",
  "articles.article_preview": "ArticlePreviewSection",

  "article_detail.article_detail_hero": "ArticleDetailHeroSection",
  "article_detail.article_content": "ArticleContentSection",
  "article_detail.related_articles": "RelatedArticlesSection",
  "article_detail.article_cta": "ArticleCtaSection",

  "contact.contact_hero": "ContactHeroSection",
  "contact.contact_information": "ContactInformationSection",
  "contact.maps_location": "MapsLocationSection",
  "contact.contact_faq": "ContactFaqSection",
  "contact.contact_cta": "ContactCtaSection"
} as const;

export type CompanyProfileSlotKey = keyof typeof COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS;
export type CompanyProfileComponentName = (typeof COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS)[CompanyProfileSlotKey];
