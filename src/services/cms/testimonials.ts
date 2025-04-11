
import { CMSTestimonial } from '@/types/cms';
import { fetchFromCMS } from './fetchFromCMS';

/**
 * Get all testimonials
 */
export async function getTestimonials(): Promise<CMSTestimonial[]> {
  return await fetchFromCMS<CMSTestimonial>('testimonials');
}
