
import { CMSTechnology } from "@/types/cms";

/**
 * Input type for creating a technology in the CMS
 */
export type TechnologyCreateInput = {
  title: string;
  slug: string;
  description: string;
  image?: {
    url?: string;
    alt?: string;
  };
  sections?: Array<{
    title: string;
    description?: string;
    type: string;
    features?: Array<{
      title?: string;
      description?: string;
      icon?: string;
      items?: string[];
    }>;
  }>;
  visible?: boolean;
};

/**
 * Input type for updating a technology in the CMS
 */
export type TechnologyUpdateInput = TechnologyCreateInput & {
  originalSlug?: string;
};

/**
 * Technology adapter interface
 */
export interface TechnologyAdapter {
  getAll: () => Promise<CMSTechnology[]>;
  getBySlug: (slug: string) => Promise<CMSTechnology | null>;
  getById: (id: string) => Promise<CMSTechnology | null>;
  create: (data: TechnologyCreateInput) => Promise<CMSTechnology>;
  update: (id: string, data: TechnologyUpdateInput) => Promise<CMSTechnology>;
  delete: (id: string) => Promise<boolean>;
  clone: (id: string) => Promise<CMSTechnology | null>;
}
