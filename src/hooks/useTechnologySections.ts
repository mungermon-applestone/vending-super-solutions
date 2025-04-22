
import { useQuery } from '@tanstack/react-query';
import { CMSTechnologySection } from '@/types/cms';
import * as technologyService from '@/services/cms/technology';

interface TechnologySection {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  displayOrder?: number;
  bulletPoints?: string[];
  sectionImage?: {
    url: string;
    alt?: string;
  };
}

export const useTechnologySections = () => {
  return useQuery<TechnologySection[], Error>({
    queryKey: ['technology-sections'],
    queryFn: async () => {
      try {
        // Create mock sections for demonstration
        const mockSections: TechnologySection[] = [
          {
            id: 'section-1',
            title: 'Advanced Technology Features',
            summary: 'Our technology platform offers cutting-edge features.',
            displayOrder: 1,
            bulletPoints: [
              'Cloud-based infrastructure',
              'Real-time analytics',
              'Secure data processing'
            ],
            sectionImage: {
              url: '/images/technology/cloud-platform.jpg',
              alt: 'Cloud platform'
            }
          },
          {
            id: 'section-2',
            title: 'Integration Capabilities',
            summary: 'Seamlessly connect with your existing systems.',
            displayOrder: 2,
            bulletPoints: [
              'API-first architecture',
              'Custom webhooks',
              'Third-party app connections'
            ],
            sectionImage: {
              url: '/images/technology/integration.jpg',
              alt: 'Integration diagram'
            }
          }
        ];
        
        return mockSections;
      } catch (error) {
        console.error('Error fetching technology sections:', error);
        throw new Error('Failed to load technology sections');
      }
    },
  });
};

export const useTestimonialSection = (sectionType: string) => {
  return useQuery({
    queryKey: ['testimonial-section', sectionType],
    queryFn: async () => {
      // Return mock testimonial section
      return {
        title: 'What Our Clients Say',
        subtitle: 'Hear from businesses using our platform',
        testimonials: [
          {
            id: '1',
            quote: 'The technology platform has transformed how we operate.',
            authorName: 'Jane Smith',
            authorTitle: 'CTO, TechCorp',
            rating: 5
          },
          {
            id: '2',
            quote: 'Implementation was smooth and the results are outstanding.',
            authorName: 'John Doe',
            authorTitle: 'Operations Manager, InnovateCo',
            rating: 4
          }
        ]
      };
    }
  });
};
