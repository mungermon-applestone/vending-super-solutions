
// Only adding the missing type
export interface CMSMachine {
  id: string;
  title: string;
  slug: string;
  type: string;
  description?: string;
  temperature?: 'ambient' | 'refrigerated' | 'frozen' | 'heated';
  mainImage?: CMSImage; // Adding this for backward compatibility
  thumbnail?: CMSImage;
  images?: CMSImage[];
  features?: string[];
  specs?: Record<string, string>;
  visible?: boolean;
  displayOrder?: number;
  // Support both naming conventions
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}
