
/**
 * Machine type definition
 */
export interface Machine {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  featured: boolean;
  machineType: string;
  dimensions: {
    height: number;
    width: number;
    depth: number;
  };
  weight: number;
  capacity: number;
  priceRange: {
    low: number;
    high: number;
  };
  features: string[];
  compatibleProducts: string[];
  image: string;
  gallery: Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  specifications?: string[] | any[];
  technicalDetails?: string[] | any[];
}
