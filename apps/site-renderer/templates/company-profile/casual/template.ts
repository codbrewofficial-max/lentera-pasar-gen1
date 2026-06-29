import { COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS } from "../slots";
import type { CompanyProfileTemplateDefinition } from "../types";

export const casualCompanyProfileTemplate = {
  key: "company_profile_casual",
  slug: "casual",
  name: "Company Profile Casual",
  description: "Template company profile ramah, ringan, dan mudah didekati.",
  // Stage 9G.1: semua slot sementara diarahkan ke component bawaan yang sudah stabil.
  // Stage 9G.2+ dapat mengganti value per slot ke component khusus hasil pecahan Google AI Studio.
  slotComponents: { ...COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS }
} satisfies CompanyProfileTemplateDefinition;
