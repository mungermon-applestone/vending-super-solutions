
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

export interface ContentfulTechnologyFeature {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description: string;
    icon?: string;
    displayOrder?: number;
    items?: string[];
  };
}

export interface ContentfulTechnologySection {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description?: string;
    sectionType: string;
    displayOrder?: number;
    features?: ContentfulTechnologyFeature[];
  };
}

export interface ContentfulTechnology {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    visible?: boolean;
    image?: ContentfulAsset;
    sections?: ContentfulTechnologySection[];
  };
}
