
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { Entry, EntrySkeletonType } from 'contentful';
import { isContentfulEntry, isContentfulAsset } from '@/services/cms/utils/contentfulHelpers';
import { safeString, safeAssetToImage } from '@/services/cms/utils/safeTypeUtilities';
import { CMSBusinessGoal } from '@/types/cms';
import { transformBusinessGoal } from '@/hooks/cms/transformers/businessGoalTransformer';

// Helper function to transform Contentful entries
function transformBusinessGoalBasic(entry: Entry<EntrySkeletonType, undefined, string>): CMSBusinessGoal | null {
  if (!isContentfulEntry(entry)) {
    console.error('[useContentfulBusinessGoals] Entry is not a valid Contentful entry:', entry);
    return null;
  }
  
  // Get the ID and fields
  const id = entry.sys.id;
  const fields = entry.fields;
  
  let imageData = undefined;
  if (fields.image && isContentfulAsset(fields.image)) {
    imageData = {
      id: fields.image.sys.id,
      url: `https:${fields.image.fields.file.url}`,
      alt: safeString(fields.image.fields.title) || ''
    };
  }
  
  // Transform contentful format to our app format
  return {
    id,
    title: safeString(fields.title || ''),
    slug: safeString(fields.slug || ''),
    description: safeString(fields.description || ''),
    icon: safeString(fields.icon || ''),
    benefits: Array.isArray(fields.benefits) ? fields.benefits.map(benefit => safeString(benefit)) : [],
    visible: fields.visible === true,
    image: imageData,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt
  };
}

export function useContentfulBusinessGoals(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['contentful', 'businessGoals', filters],
    queryFn: async () => {
      try {
        // Fetch business goals from Contentful
        const entries = await fetchContentfulEntries('businessGoal', {
          order: 'fields.title',
          ...(filters || {})
        });
        
        if (!entries || !Array.isArray(entries)) {
          console.log('[useContentfulBusinessGoals] No entries returned or invalid response');
          return [];
        }
        
        // Map entries to our application format
        return entries
          .map(transformBusinessGoalBasic)
          .filter(Boolean) as CMSBusinessGoal[];
      } catch (error) {
        console.error('[useContentfulBusinessGoals] Error fetching business goals:', error);
        throw error;
      }
    }
  });
}

export function useContentfulBusinessGoalBySlug(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'businessGoal', slug],
    queryFn: async () => {
      try {
        // Only proceed if we have a slug
        if (!slug) {
          console.log('[useContentfulBusinessGoalBySlug] No slug provided');
          return null;
        }
        
        // Fetch entries with matching slug
        const entries = await fetchContentfulEntries('businessGoal', {
          'fields.slug': slug
        });
        
        // Check if we got a valid entry
        if (!entries || !Array.isArray(entries) || entries.length === 0) {
          console.log(`[useContentfulBusinessGoalBySlug] No entry found for slug: ${slug}`);
          return null;
        }
        
        const entry = entries[0];
        return transformBusinessGoal(entry);
      } catch (error) {
        console.error(`[useContentfulBusinessGoalBySlug] Error fetching business goal with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug
  });
}
