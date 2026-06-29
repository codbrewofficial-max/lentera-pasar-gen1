import { COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS } from "./slots";

export type CompanyProfileTemplateKey =
  | "company_profile_formal"
  | "company_profile_abstract"
  | "company_profile_casual"
  | "company_profile_premium";

export type CompanyProfileTemplateTheme = "formal" | "abstract" | "casual" | "premium";

export type CompanyProfileSlotComponentMap = Partial<Record<keyof typeof COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS, string>>;

export type CompanyProfileTemplateDefinition = {
  key: CompanyProfileTemplateKey;
  slug: CompanyProfileTemplateTheme;
  name: string;
  description: string;
  slotComponents: CompanyProfileSlotComponentMap;
};
