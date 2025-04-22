
import { ContentProviderType } from '../../providerConfig';

export interface BusinessGoalAdapter {
  fetchAll: () => Promise<any[]>;
  fetchBySlug: (slug: string) => Promise<any | null>;
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<boolean>;
}

export const createBusinessGoalAdapter = (providerType: ContentProviderType): BusinessGoalAdapter => {
  console.log(`Creating business goal adapter for provider: ${providerType}`);
  
  return {
    fetchAll: () => Promise.resolve([]),
    fetchBySlug: () => Promise.resolve(null),
    create: (data) => Promise.resolve(data),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true)
  };
};
