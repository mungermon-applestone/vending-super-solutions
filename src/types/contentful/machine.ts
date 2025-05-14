
import { CMSMachine, CMSImage } from '@/types/cms';

export interface ContentfulEntry {
  sys?: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  };
  id?: string;
  title?: string;
  slug?: string;
  type?: string;
  description?: string;
  shortDescription?: string;
  temperature?: string;
  features?: string[];
  fields?: {
    title?: string;
    slug?: string;
    type?: string;
    description?: string;
    shortDescription?: string;
    temperature?: string;
    features?: string[];
    images?: Array<{
      sys?: {
        id: string;
      };
      fields?: {
        file?: {
          url?: string;
          details?: {
            image?: {
              width?: number;
              height?: number;
            };
          };
        };
        title?: string;
      };
    }>;
    thumbnail?: {
      sys?: {
        id: string;
      };
      fields?: {
        file?: {
          url?: string;
          details?: {
            image?: {
              width?: number;
              height?: number;
            };
          };
        };
        title?: string;
      };
    };
    dimensions?: string;
    weight?: string;
    capacity?: string;
    powerRequirements?: string;
    paymentOptions?: string;
    connectivity?: string;
    manufacturer?: string;
    warranty?: string;
    specs?: {
      dimensions?: string;
      weight?: string;
      capacity?: string;
      powerRequirements?: string;
      paymentOptions?: string;
      connectivity?: string;
      manufacturer?: string;
      warranty?: string;
      temperature?: string;
      [key: string]: string | undefined;
    };
  };
  images?: Array<{
    sys?: {
      id: string;
    };
    fields?: {
      file?: {
        url?: string;
        details?: {
          image?: {
            width?: number;
            height?: number;
          };
        };
      };
      title?: string;
    };
  }>;
  thumbnail?: {
    sys?: {
      id: string;
    };
    fields?: {
      file?: {
        url?: string;
        details?: {
          image?: {
            width?: number;
            height?: number;
          };
        };
      };
      title?: string;
    };
  };
  dimensions?: string;
  weight?: string;
  capacity?: string;
  powerRequirements?: string;
  paymentOptions?: string;
  connectivity?: string;
  manufacturer?: string;
  warranty?: string;
  specs?: {
    dimensions?: string;
    weight?: string;
    capacity?: string;
    powerRequirements?: string;
    paymentOptions?: string;
    connectivity?: string;
    manufacturer?: string;
    warranty?: string;
    temperature?: string;
    [key: string]: string | undefined;
  };
  visible?: boolean;
  featured?: boolean;
}
