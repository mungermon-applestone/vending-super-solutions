
import { CMSProductType } from "@/types/cms";
import { ProductFormData } from "@/types/forms";

/**
 * Input type for creating a product in the CMS
 */
export type ProductCreateInput = ProductFormData;

/**
 * Input type for updating a product in the CMS
 */
export type ProductUpdateInput = ProductFormData & {
  originalSlug?: string;
};

/**
 * Product adapter interface
 */
export type ProductAdapter = {
  getAll: (filters?: Record<string, any>) => Promise<CMSProductType[]>;
  getBySlug: (slug: string) => Promise<CMSProductType | null>;
  getById: (id: string) => Promise<CMSProductType | null>;
  create: (data: ProductCreateInput) => Promise<CMSProductType>;
  update: (id: string, data: ProductUpdateInput) => Promise<CMSProductType>;
  delete: (id: string) => Promise<boolean>;
  clone: (id: string) => Promise<CMSProductType>;
};
