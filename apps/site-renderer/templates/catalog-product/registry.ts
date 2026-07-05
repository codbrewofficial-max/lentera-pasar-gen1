import type { PublicSection } from "@/lib/types";
import { cleanCatalogProductTemplate } from "./clean/template";
import { formalCatalogProductTemplate } from "./formal/template";
import { casualCatalogProductTemplate } from "./casual/template";
import { premiumCatalogProductTemplate } from "./premium/template";
import { abstractCatalogProductTemplate } from "./abstract/template";
import { CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS } from "./slots";
import type { CatalogProductTemplateDefinition, CatalogProductTemplateKey } from "./types";

const TEMPLATE_KEY_ALIASES: Record<string, CatalogProductTemplateKey> = {
  catalog_product_clean: "catalog_product_clean",
  "catalog-product-clean": "catalog_product_clean",
  clean: "catalog_product_clean",

  catalog_product_formal: "catalog_product_formal",
  "catalog-product-formal": "catalog_product_formal",
  formal: "catalog_product_formal",

  catalog_product_casual: "catalog_product_casual",
  "catalog-product-casual": "catalog_product_casual",
  casual: "catalog_product_casual",

  catalog_product_premium: "catalog_product_premium",
  "catalog-product-premium": "catalog_product_premium",
  premium: "catalog_product_premium",

  catalog_product_abstract: "catalog_product_abstract",
  "catalog-product-abstract": "catalog_product_abstract",
  abstract: "catalog_product_abstract"
};

export const catalogProductTemplateRegistry: Record<CatalogProductTemplateKey, CatalogProductTemplateDefinition> = {
  catalog_product_clean: cleanCatalogProductTemplate,
  catalog_product_formal: formalCatalogProductTemplate,
  catalog_product_casual: casualCatalogProductTemplate,
  catalog_product_premium: premiumCatalogProductTemplate,
  catalog_product_abstract: abstractCatalogProductTemplate
};

// Template Pack ZIP boleh diimpor dengan templatePackKey berversi (mis. "catalog_product_formal_v1"),
// sama seperti company-profile/registry.ts — suffix versi dilepas dulu sebelum dicocokkan ke alias map.
function stripVersionSuffix(value: string): string {
  return value.replace(/[_-]v\d+(\.\d+)*$/i, "");
}

function normalizeTemplateKey(value?: string | null): CatalogProductTemplateKey | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  return TEMPLATE_KEY_ALIASES[normalized] || TEMPLATE_KEY_ALIASES[stripVersionSuffix(normalized)] || null;
}

function inferTemplateKeyFromSectionKey(sectionKey?: string | null): CatalogProductTemplateKey | null {
  if (!sectionKey) return null;
  const normalized = sectionKey.trim().toLowerCase();
  const firstSegment = stripVersionSuffix(normalized.split(".")[0]);
  for (const key of Object.keys(catalogProductTemplateRegistry) as CatalogProductTemplateKey[]) {
    if (normalized === key || normalized.startsWith(`${key}.`) || firstSegment === key) return key;
  }
  return null;
}

export function getCatalogProductTemplateDefinition(section: PublicSection) {
  const templateKey =
    normalizeTemplateKey(section.templateKey) ||
    normalizeTemplateKey(section.templateTheme) ||
    inferTemplateKeyFromSectionKey(section.sectionKey);

  return templateKey ? catalogProductTemplateRegistry[templateKey] : null;
}

export function resolveCatalogProductSectionComponentName(section: PublicSection) {
  const template = getCatalogProductTemplateDefinition(section);
  const slotKey = section.slotKey as keyof typeof CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS;

  return (
    template?.slotComponents?.[slotKey] ||
    section.component ||
    CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS[slotKey] ||
    null
  );
}

export function getCatalogProductTemplateDebugLabel(section: PublicSection) {
  const template = getCatalogProductTemplateDefinition(section);
  if (!template) return section.templateKey || section.templateTheme || section.sectionKey || "default";
  return `${template.name} (${template.key})`;
}
