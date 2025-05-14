
import { CMSMachine, CMSTestimonial } from '@/types/cms';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

/**
 * Ensure machine has name property for backwards compatibility
 */
export function ensureMachineBackwardsCompatibility(machine: CMSMachine): CMSMachine {
  if (!machine) return machine;
  
  // Add name field if it doesn't exist
  if (!machine.name && machine.title) {
    machine.name = machine.title;
  }
  
  return machine;
}

/**
 * Convert raw testimonials to a section format for compatibility
 */
export function createTestimonialSection(
  testimonials: CMSTestimonial[] | any[],
  title: string = "What Our Clients Say",
  subtitle?: string
): ContentfulTestimonialSection {
  return {
    title,
    subtitle,
    testimonials: testimonials.map(item => ({
      id: item.id || item._id || `testimonial-${Math.random().toString(36).substring(7)}`,
      name: item.name || item.author || "Customer",
      title: item.title || item.position || "",
      company: item.company || item.organization || "",
      testimonial: item.testimonial || item.content || item.text || "",
      rating: item.rating || 5,
      image_url: item.image_url || item.imageUrl || ""
    })),
    background: "bg-gray-50",
    displayStyle: "carousel"
  };
}

/**
 * Convert blog post date fields between different naming conventions
 */
export function normalizeBlogPostDates(post: any): any {
  if (!post) return post;
  
  const normalizedPost = { ...post };
  
  // Handle published_at vs publishDate
  if (normalizedPost.published_at && !normalizedPost.publishDate) {
    normalizedPost.publishDate = normalizedPost.published_at;
  } else if (normalizedPost.publishDate && !normalizedPost.published_at) {
    normalizedPost.published_at = normalizedPost.publishDate;
  }
  
  // Handle created_at vs createdAt
  if (normalizedPost.created_at && !normalizedPost.createdAt) {
    normalizedPost.createdAt = normalizedPost.created_at;
  } else if (normalizedPost.createdAt && !normalizedPost.created_at) {
    normalizedPost.created_at = normalizedPost.createdAt;
  }
  
  // Handle updated_at vs updatedAt
  if (normalizedPost.updated_at && !normalizedPost.updatedAt) {
    normalizedPost.updatedAt = normalizedPost.updated_at;
  } else if (normalizedPost.updatedAt && !normalizedPost.updated_at) {
    normalizedPost.updated_at = normalizedPost.updatedAt;
  }
  
  return normalizedPost;
}
