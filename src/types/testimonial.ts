
/**
 * Interface for Testimonial data
 */
export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  company?: string;
  position?: string;
  avatar?: string;
}

/**
 * Interface for a collection of testimonials
 */
export interface TestimonialCollection {
  items: Testimonial[];
  total: number;
}
