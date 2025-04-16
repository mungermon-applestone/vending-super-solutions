
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSTechnology } from '@/types/cms';
import { toast } from 'sonner';

export function useContentfulTechnology() {
  return useQuery({
    queryKey: ['contentful', 'technology'],
    queryFn: async () => {
      console.log('[useContentfulTechnology] Fetching technology data from Contentful');
      
      let client;
      try {
        client = await getContentfulClient();
      } catch (clientError) {
        console.error('[useContentfulTechnology] Failed to initialize Contentful client, trying refresh', clientError);
        // Try refreshing the client
        try {
          client = await refreshContentfulClient();
        } catch (refreshError) {
          console.error('[useContentfulTechnology] Failed to refresh Contentful client', refreshError);
          throw new Error(`Failed to initialize Contentful client: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
        }
      }
      
      if (!client) {
        console.error('[useContentfulTechnology] Failed to initialize Contentful client after retry');
        throw new Error('Failed to initialize Contentful client');
      }
      
      console.log('[useContentfulTechnology] Querying Contentful for technology content type');
      
      const entries = await client.getEntries({
        content_type: 'technology',
        include: 3 // Include more levels of nested entries
      });
      
      if (!entries.items.length) {
        console.warn('[useContentfulTechnology] No technology entries found in Contentful');
        return [];
      }
      
      console.log(`[useContentfulTechnology] Found ${entries.items.length} technology entries`);
      
      // Transform entries to our app format
      const technologies = entries.items.map(entry => {
        const fields = entry.fields;
        const technologyId = entry.sys.id;
        
        console.log(`[useContentfulTechnology] Processing technology entry:`, {
          id: technologyId,
          title: fields.title,
          hasSections: Array.isArray(fields.sections) ? fields.sections.length : 0
        });
        
        // Process sections if they exist
        const sections = fields.sections ? (fields.sections as any[]).map((section, index) => {
          const sectionFields = section.fields;
          const sectionId = section.sys.id;
          
          // Process features if they exist for this section
          const features = sectionFields.features ? 
            (sectionFields.features as any[]).map(feature => {
              const featureFields = feature.fields;
              
              return {
                id: feature.sys.id,
                section_id: sectionId,
                title: featureFields.title,
                description: featureFields.description,
                icon: featureFields.icon || undefined,
                display_order: featureFields.displayOrder || index,
                image: featureFields.image ? {
                  id: (featureFields.image as any).sys.id,
                  url: `https:${(featureFields.image as any).fields.file.url}`,
                  alt: featureFields.imageAlt || featureFields.title
                } : undefined
              };
            }) : [];
          
          // Create a section object that matches the CMSTechnologySection type
          return {
            id: sectionId,
            technology_id: technologyId,
            title: sectionFields.title,
            subtitle: sectionFields.subtitle || '',
            description: sectionFields.description || '',
            summary: sectionFields.summary || '',
            section_type: sectionFields.sectionType || 'feature',
            display_order: sectionFields.displayOrder || index,
            features: features,
            images: [],
            bulletPoints: sectionFields.bulletPoints || [],
            image: sectionFields.image ? {
              id: (sectionFields.image as any).sys.id,
              url: `https:${(sectionFields.image as any).fields.file.url}`,
              alt: sectionFields.imageAlt || sectionFields.title
            } : undefined,
            sectionImage: sectionFields.sectionImage ? {
              url: `https:${(sectionFields.sectionImage as any).fields.file.url}`,
              alt: sectionFields.imageAlt || sectionFields.title
            } : undefined
          };
        }) : [];
        
        // Create the technology object based on our app's data structure
        return {
          id: technologyId,
          title: fields.title as string,
          subtitle: fields.subtitle as string || '',
          description: fields.description as string || '',
          slug: (fields.slug as string) || ((fields.title as string)?.toLowerCase().replace(/\s+/g, '-') || ''),
          visible: typeof fields.visible === 'boolean' ? fields.visible : true,
          image: fields.heroImage ? {
            id: (fields.heroImage as any).sys.id,
            url: `https:${(fields.heroImage as any).fields.file.url}`,
            alt: (fields.heroImage as any).fields.title || fields.title,
          } : undefined,
          sections: sections,
          primaryButtonText: fields.primaryButtonText as string || 'Contact Us',
          primaryButtonUrl: fields.primaryButtonUrl as string || '/contact',
          secondaryButtonText: fields.secondaryButtonText as string || 'Learn More',
          secondaryButtonUrl: fields.secondaryButtonUrl as string || '/technology/details',
        } as CMSTechnology;
      });
      
      console.log(`[useContentfulTechnology] Successfully processed ${technologies.length} technology entries`);
      return technologies;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading technology data from Contentful: ${error.message}`);
        console.error('[useContentfulTechnology] Error:', error);
      }
    }
  });
}
