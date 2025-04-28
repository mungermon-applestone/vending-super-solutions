
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSTechnology, CMSTechnologySection, CMSImage } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';
import { useContentfulConfig } from '@/hooks/useContentfulConfig';

type UseTechnologySectionsOptions = {
  slug?: string;
  enableToasts?: boolean;
  refetchInterval?: number | false;
};

export function useTechnologySections(options: UseTechnologySectionsOptions = {}) {
  const { slug, enableToasts = false, refetchInterval = false } = options;
  const { toast } = useToast();
  const { isValid: isConfigValid } = useContentfulConfig();

  const query = useQuery({
    queryKey: ['contentful', 'technology', slug].filter(Boolean),
    queryFn: async () => {
      console.log('[useTechnologySections] Starting technology fetch, config valid:', isConfigValid);
      
      if (!isConfigValid) {
        console.error('[useTechnologySections] Invalid Contentful configuration');
        throw new Error('Invalid Contentful configuration');
      }
      
      try {
        const client = await getContentfulClient();
        console.log('[useTechnologySections] Client initialized successfully');
        
        const query = {
          content_type: 'technology',
          include: 2,
          ...(slug ? { 'fields.slug': slug } : {})
        };

        console.log('[useTechnologySections] Fetching with query:', query);
        
        const entries = await client.getEntries(query);
        console.log(`[useTechnologySections] Received ${entries.items.length} technologies from Contentful`);

        const technologies: CMSTechnology[] = entries.items.map(entry => {
          const fields = entry.fields as any;
          console.log(`[useTechnologySections] Processing technology: ${fields.title}`);
          
          const sections: CMSTechnologySection[] = fields.sections?.map((section: any, index: number) => {
            const sectionFields = section.fields;
            console.log(`[useTechnologySections] Processing section: ${sectionFields.title}`);
            
            return {
              id: section.sys.id,
              technology_id: entry.sys.id,
              title: sectionFields.title,
              summary: sectionFields.summary || '',
              description: sectionFields.description || '',
              section_type: sectionFields.sectionType || 'default',
              display_order: sectionFields.displayOrder || index,
              bulletPoints: sectionFields.bulletPoints || [],
              sectionImage: sectionFields.sectionImage ? {
                id: sectionFields.sectionImage.sys.id,
                url: `https:${sectionFields.sectionImage.fields.file.url}`,
                alt: sectionFields.title
              } : undefined,
              features: []
            };
          }) || [];

          console.log(`[useTechnologySections] Processed ${sections.length} sections for "${fields.title}"`);

          let technologyImage: CMSImage | undefined;
          if (fields.image) {
            technologyImage = {
              id: fields.image.sys.id,
              url: `https:${fields.image.fields.file.url}`,
              alt: fields.title || 'Technology image'
            };
          }

          return {
            id: entry.sys.id,
            title: fields.title,
            slug: fields.slug,
            description: fields.description,
            sections: sections,
            visible: fields.visible !== false,
            image: technologyImage
          };
        });

        if (technologies.length === 0) {
          console.warn('[useTechnologySections] No technologies found in response');
          if (enableToasts) {
            toast({
              title: "No Technologies Found",
              description: "No technology data is currently available.",
              variant: "default",
            });
          }
        }

        if (slug) {
          console.log(`[useTechnologySections] Returning single technology with ${technologies[0]?.sections?.length || 0} sections`);
          return technologies[0];
        }

        return technologies;
      } catch (error) {
        console.error('[useTechnologySections] Error fetching technologies:', error);
        if (enableToasts) {
          toast({
            title: "Error Loading Technologies",
            description: error instanceof Error ? error.message : "Failed to load technology data",
            variant: "destructive",
          });
        }
        throw error;
      }
    },
    enabled: isConfigValid,
    refetchInterval
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    technologies: Array.isArray(query.data) ? query.data : query.data ? [query.data] : []
  };
}

export default useTechnologySections;
