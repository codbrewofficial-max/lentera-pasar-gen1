import { CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS } from "../slots";
import type { CatalogProductTemplateDefinition } from "../types";

// Katalog Produk Clean adalah tema default/generik untuk Website Type Katalog Produk,
// niru persis pola company-profile/clean/template.ts. Tema ini SELALU ada dan dipakai
// sebagai fallback otomatis untuk tema lain (Formal, dst) yang belum punya kode visual
// sendiri untuk sebagian/semua slot.
export const cleanCatalogProductTemplate = {
  key: "catalog_product_clean",
  slug: "clean",
  name: "Katalog Produk Clean",
  description:
    "Tema default/generik Katalog Produk. Dipakai otomatis sebagai fallback untuk tema lain (Formal, dst) yang belum punya kode visual sendiri.",
  slotComponents: { ...CATALOG_PRODUCT_DEFAULT_SLOT_COMPONENTS }
} satisfies CatalogProductTemplateDefinition;
