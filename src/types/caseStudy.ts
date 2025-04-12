
export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  industry: string;
  image_url?: string;
  image_alt?: string;
  solution?: string; // Added solution field
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyResult {
  id: string;
  case_study_id: string;
  text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyTestimonial {
  id: string;
  case_study_id: string;
  quote: string;
  author: string;
  company?: string;
  position?: string;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyWithRelations extends CaseStudy {
  results: CaseStudyResult[];
  testimonial?: CaseStudyTestimonial;
}

export interface CaseStudyFormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  industry: string;
  solution: string; // Added solution field
  image_url: string;
  image_alt: string;
  visible: boolean;
  results: { text: string }[];
  testimonial: {
    quote: string;
    author: string;
    company: string;
    position: string;
  };
}
