
export interface ContentfulTestimonialSection {
  sys?: {
    id: string;
  };
  fields?: {
    title?: string;
    subtitle?: string;
    testimonials?: ContentfulTestimonial[];
    pageKey?: string;
  };
  title?: string;
  subtitle?: string;
  testimonials?: ContentfulTestimonial[];
  id?: string;
}

export interface ContentfulTestimonial {
  sys?: {
    id: string;
  };
  fields?: {
    quote?: string;
    author?: string;
    position?: string;
    company?: string;
    rating?: number;
    image?: {
      sys?: {
        id: string;
      };
      fields?: {
        file?: {
          url?: string;
        };
        title?: string;
      };
    };
    pageKey?: string;
    visible?: boolean;
  };
  id?: string;
  quote?: string;
  authorName?: string;
  authorTitle?: string;
  rating?: number;
  authorImage?: {
    url?: string;
  };
}
