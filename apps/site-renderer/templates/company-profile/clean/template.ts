import { COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS } from "../slots";
import type { CompanyProfileTemplateDefinition } from "../types";

// Company Profile Clean adalah tema default/generik untuk Website Type Company Profile.
// Tema ini SELALU ada dan dipakai sebagai fallback otomatis untuk tema lain (Abstract,
// Casual, Premium, dst) yang belum punya kode visual sendiri hasil porting Google AI Studio.
// Pola folder ini (clean/template.ts berisi 33 slotComponents) adalah acuan yang harus
// direplikasi untuk Website Type baru (Catalog Product, Booking Inquiry, Community Website).
export const cleanCompanyProfileTemplate = {
  key: "company_profile_clean",
  slug: "clean",
  name: "Company Profile Clean",
  description:
    "Tema default/generik Company Profile. Dipakai otomatis sebagai fallback untuk tema lain (Abstract, Casual, Premium) yang belum punya kode visual sendiri dari Google AI Studio.",
  slotComponents: { ...COMPANY_PROFILE_DEFAULT_SLOT_COMPONENTS }
} satisfies CompanyProfileTemplateDefinition;
