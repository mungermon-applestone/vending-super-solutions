
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { Entry, EntrySkeletonType } from 'contentful';
import { ContentfulBusinessGoal } from '@/types/contentful';
import { isContentfulEntry, isContentfulAsset } from '@/services/cms/utils/contentfulHelpers';

// Helper function to transform Contentful entries
function transformBusinessGoal(entry: Entry<EntrySkeletonType, undefined, string>) {
  if (!isContentfulEntry(entry)) {
    console.error('[useContentfulBusinessGoals] Entry is not a valid Contentful entry:', entry);
    return null;
  }
  
  // Get the ID and fields
  const id = entry.sys.id;
  const fields = entry.fields;
  
  let imageData = undefined;
  if (fields.image && isContentfulEntry(fields.image) && fields.image.fields.file) {
    imageData = {
      id: fields.image.sys.id,
      url: `https:${fields.image.fields.file.url}`,
      alt: fields.image.fields.title || ''
    };
  }
  
  // Transform contentful format to our app format
  return {
    id,
    title: String(fields.title || ''),
    slug: String(fields.slug || ''),
    description: String(fields.description || ''),
    icon: String(fields.icon || ''),
    benefits: Array.isArray(fields.benefits) ? fields.benefits.map(benefit => String(benefit)) : [],
    visible: fields.visible === true,
    image: imageData
  };
}

export function useContentfulBusinessGoals() {
  return useQuery({
    queryKey: ['contentful', 'businessGoals'],
    queryFn: async () => {
      try {
        // Fetch business goals from Contentful
        const entries = await fetchContentfulEntries('businessGoal', {
          order: 'fields.title'
        });
        
        if (!entries || !Array.isArray(entries)) {
          console.log('[useContentfulBusinessGoals] No entries returned or invalid response');
          return [];
        }
        
        // Map entries to our application format
        return entries
          .map(transformBusinessGoal)
          .filter(Boolean);
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
