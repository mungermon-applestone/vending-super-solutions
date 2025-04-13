
import { CMSBusinessGoal } from "@/types/cms";

/**
 * Input type for creating a business goal in the CMS
 */
export type BusinessGoalCreateInput = {
  title: string;
  slug: string;
  description: string;
  image?: {
    url?: string;
    alt?: string;
  };
  icon?: string;
  benefits?: string[];
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
    screenshot?: {
      url?: string;
      alt?: string;
    };
  }>;
  visible?: boolean;
};

/**
 * Input type for updating a business goal in the CMS
 */
export type BusinessGoalUpdateInput = BusinessGoalCreateInput & {
  originalSlug?: string;
};

/**
 * Business goal adapter interface
 */
export interface BusinessGoalAdapter {
  getAll: () => Promise<CMSBusinessGoal[]>;
  getBySlug: (slug: string) => Promise<CMSBusinessGoal | null>;
  getById: (id: string) => Promise<CMSBusinessGoal | null>;
  create: (data: BusinessGoalCreateInput) => Promise<CMSBusinessGoal>;
  update: (id: string, data: BusinessGoalUpdateInput) => Promise<CMSBusinessGoal>;
  delete: (id: string) => Promise<boolean>;
  clone: (id: string) => Promise<CMSBusinessGoal | null>;
}
