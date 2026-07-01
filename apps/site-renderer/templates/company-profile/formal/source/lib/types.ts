export interface StatItem {
  label: string;
  value: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  clientName: string;
  year: string;
  description: string;
  imageUrl: string;
  challenge: string;
  solution: string;
  result: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  logoUrl?: string;
}

export interface BrandItem {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface ValueItem {
  title: string;
  description: string;
  iconName: string;
}

export interface TeamItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  social: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  iconName: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleItem {
  slug: string;
  title: string;
  category: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  summary: string;
  content: string; // Markdown or rich-text format HTML
  coverImageUrl: string;
  readTime: string;
}

export interface CompanyData {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  establishedYear: string;
  founderName: string;
  aboutImage: string;
  vision: string;
  mission: string[];
  contact: {
    address: string;
    email: string;
    phone: string;
    whatsapp: string;
    workingHours: string;
    mapEmbedUrl: string;
  };
}
