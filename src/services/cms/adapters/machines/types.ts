
import { CMSMachine } from '@/types/cms';

/**
 * Input type for creating a machine in the CMS
 */
export type MachineCreateInput = {
  title: string;
  slug: string;
  type?: string;
  description?: string;
  temperature?: string;
  features?: string[];
  images?: any[];
  specs?: Record<string, string>;
};

/**
 * Input type for updating a machine in the CMS
 */
export type MachineUpdateInput = Partial<MachineCreateInput> & {
  id: string;
};

/**
 * Machine adapter interface
 */
export interface MachineAdapter {
  getAll: (filters?: Record<string, any>) => Promise<CMSMachine[]>;
  getBySlug: (slug: string) => Promise<CMSMachine | null>;
  getById: (id: string) => Promise<CMSMachine | null>;
  create: (data: MachineCreateInput) => Promise<CMSMachine>;
  update: (id: string, data: MachineUpdateInput) => Promise<CMSMachine>;
  delete: (id: string) => Promise<boolean>;
  clone?: (id: string) => Promise<CMSMachine>;
}

/**
 * Factory function type for getting a machine adapter
 */
export type MachineAdapterFactory = () => MachineAdapter;

