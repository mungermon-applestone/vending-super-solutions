import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';

interface BusinessGoalsPageContent {
  introTitle?: string;
  introDescription?: string;
  goalsSectionTitle?: string;
  goalsSectionDescription?: string;
  keyBenefitsTitle?: string;
  keyBenefitsDescription?: string;
  keyBenefits?: string[];
  customSolutionTitle?: string;
  customSolutionDescription?: string;
  customSolutionButtonText?: string;
  customSolutionButtonUrl?: string;
  inquiryBulletPoints?: string[];
}

export function useBusinessGoalsPageContent(contentId?: string) {
  return useQuery({
    queryKey: ['contentful', 'business-goals-page', contentId],
    queryFn: async (): Promise<BusinessGoalsPageContent | null> => {
      try {
        const client = await getContentfulClient();
        
        let query: any = {
          content_type: 'businessGoalsPage',
          include: 1,
          limit: 1
        };
        
        if (contentId) {
          // If contentId is provided, fetch by ID
          try {
            const entry = await client.getEntry(contentId, { include: 1 });
            if (!entry || !entry.fields) {
              return null;
            }
            
            return transformBusinessGoalsPageContent(entry);
          } catch (error) {
            console.error(`Error fetching business goals page content by ID "${contentId}":`, error);
            // Continue to search by content type
          }
        } 
        
        // Otherwise search by content type
        const response = await client.getEntries(query);
        
        if (!response.items || response.items.length === 0) {
          return null;
        }
        
        return transformBusinessGoalsPageContent(response.items[0]);
      } catch (error) {
        console.error('Error fetching business goals page content:', error);
        return null;
      }
    }
  });
}

function transformBusinessGoalsPageContent(entry: any): BusinessGoalsPageContent {
  if (!entry || !entry.fields) {
    return {};
  }
  
  const { fields } = entry;
  
  // Transform any array fields
  const keyBenefits = Array.isArray(fields.keyBenefits) ? 
    fields.keyBenefits.filter(Boolean) : 
    (fields.keyBenefits ? [fields.keyBenefits] : []);
  
  const inquiryBulletPoints = Array.isArray(fields.inquiryBulletPoints) ? 
    fields.inquiryBulletPoints.filter(Boolean) : 
    (fields.inquiryBulletPoints ? [fields.inquiryBulletPoints] : []);
  
  return {
    introTitle: fields.introTitle || '',
    introDescription: fields.introDescription || '',
    goalsSectionTitle: fields.goalsSectionTitle || '',
    goalsSectionDescription: fields.goalsSectionDescription || '',
    keyBenefitsTitle: fields.keyBenefitsTitle || '',
    keyBenefitsDescription: fields.keyBenefitsDescription || '',
    keyBenefits,
    customSolutionTitle: fields.customSolutionTitle || '',
    customSolutionDescription: fields.customSolutionDescription || '',
    customSolutionButtonText: fields.customSolutionButtonText || 'Contact Us',
    customSolutionButtonUrl: fields.customSolutionButtonUrl || '/contact',
    inquiryBulletPoints
  };
}

export type { BusinessGoalsPageContent };
