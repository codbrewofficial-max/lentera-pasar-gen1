import type { PublicSection } from "@/lib/types";
import { abstractCompanyProfileTemplate } from "./abstract/template";
import { casualCompanyProfileTemplate } from "./casual/template";
import { cleanCompanyProfileTemplate } from "./clean/template";
import { formalCompanyProfileTemplate } from "./formal/template";
import { premiumCompanyProfileTemplate } from "./premium/template";
import { COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS } from "./slots";
import type { CompanyProfileTemplateDefinition, CompanyProfileTemplateKey } from "./types";

const TEMPLATE_KEY_ALIASES: Record<string, CompanyProfileTemplateKey> = {
  company_profile_clean: "company_profile_clean",
  "company-profile-clean": "company_profile_clean",
  clean: "company_profile_clean",

  company_profile_formal: "company_profile_formal",
  "company-profile-formal": "company_profile_formal",
  formal: "company_profile_formal",

  company_profile_abstract: "company_profile_abstract",
  "company-profile-abstract": "company_profile_abstract",
  abstract: "company_profile_abstract",

  company_profile_casual: "company_profile_casual",
  "company-profile-casual": "company_profile_casual",
  casual: "company_profile_casual",

  company_profile_premium: "company_profile_premium",
  "company-profile-premium": "company_profile_premium",
  premium: "company_profile_premium"
};

export const companyProfileTemplateRegistry: Record<CompanyProfileTemplateKey, CompanyProfileTemplateDefinition> = {
  company_profile_clean: cleanCompanyProfileTemplate,
  company_profile_formal: formalCompanyProfileTemplate,
  company_profile_abstract: abstractCompanyProfileTemplate,
  company_profile_casual: casualCompanyProfileTemplate,
  company_profile_premium: premiumCompanyProfileTemplate
};

function normalizeTemplateKey(value?: string | null): CompanyProfileTemplateKey | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  return TEMPLATE_KEY_ALIASES[normalized] || null;
}

function inferTemplateKeyFromSectionKey(sectionKey?: string | null): CompanyProfileTemplateKey | null {
  if (!sectionKey) return null;
  const normalized = sectionKey.trim().toLowerCase();
  for (const key of Object.keys(companyProfileTemplateRegistry) as CompanyProfileTemplateKey[]) {
    if (normalized === key || normalized.startsWith(`${key}.`)) return key;
  }
  return null;
}

export function getCompanyProfileTemplateDefinition(section: PublicSection) {
  const templateKey =
    normalizeTemplateKey(section.templateKey) ||
    normalizeTemplateKey(section.templateTheme) ||
    inferTemplateKeyFromSectionKey(section.sectionKey);

  return templateKey ? companyProfileTemplateRegistry[templateKey] : null;
}

export function resolveCompanyProfileSectionComponentName(section: PublicSection) {
  const template = getCompanyProfileTemplateDefinition(section);
  const slotKey = section.slotKey as keyof typeof COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS;

  return (
    template?.slotComponents?.[slotKey] ||
    section.component ||
    COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS[slotKey] ||
    null
  );
}

export function getCompanyProfileTemplateDebugLabel(section: PublicSection) {
  const template = getCompanyProfileTemplateDefinition(section);
  if (!template) return section.templateKey || section.templateTheme || section.sectionKey || "default";
  return `${template.name} (${template.key})`;
}
