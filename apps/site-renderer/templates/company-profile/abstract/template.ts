import { COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS } from "../slots";
import type { CompanyProfileTemplateDefinition } from "../types";

export const abstractCompanyProfileTemplate = {
  key: "company_profile_abstract",
  slug: "abstract",
  name: "Company Profile Abstract",
  description: "Template company profile modern, kreatif, dan visual.",
  // Stage 9G.1: semua slot sementara diarahkan ke component bawaan yang sudah stabil.
  // Stage 9G.2+ dapat mengganti value per slot ke component khusus hasil pecahan Google AI Studio.
  slotComponents: { ...COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS }
} satisfies CompanyProfileTemplateDefinition;
