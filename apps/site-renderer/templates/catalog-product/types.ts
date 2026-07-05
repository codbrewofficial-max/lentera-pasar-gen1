import { CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS } from "./slots";

export type CatalogProductTemplateKey = "catalog_product_clean" | "catalog_product_formal" | "catalog_product_casual" | "catalog_product_premium" | "catalog_product_abstract";

export type CatalogProductTemplateTheme = "clean" | "formal" | "casual" | "premium" | "abstract";

export type CatalogProductSlotComponentMap = Partial<Record<keyof typeof CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS, string>>;

export type CatalogProductTemplateDefinition = {
  key: CatalogProductTemplateKey;
  slug: CatalogProductTemplateTheme;
  name: string;
  description: string;
  slotComponents: CatalogProductSlotComponentMap;
};
