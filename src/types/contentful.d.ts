
export interface ContentfulAsset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    file: {
      url: string;
      details?: {
        size?: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName?: string;
      contentType?: string;
    };
  };
}

export interface ContentfulFeature {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description: string;
    icon?: string;
    screenshot?: ContentfulAsset;
  };
}

export interface ContentfulBusinessGoal {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    icon?: string;
    image?: ContentfulAsset;
    benefits?: string[];
    features?: ContentfulFeature[];
    visible?: boolean;
  };
}
