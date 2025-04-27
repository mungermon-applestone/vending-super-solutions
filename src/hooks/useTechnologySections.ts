
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSTechnology, CMSTechnologySection, CMSImage } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';

type UseTechnologySectionsOptions = {
  slug?: string;
  enableToasts?: boolean;
  refetchInterval?: number | false;
};

export function useTechnologySections(options: UseTechnologySectionsOptions = {}) {
  const { slug, enableToasts = false, refetchInterval = false } = options;
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['contentful', 'technology', slug].filter(Boolean),
    queryFn: async () => {
      console.log('[useTechnologySections] Fetching technology content from Contentful');
      
      try {
        const client = await getContentfulClient();
        const query = {
          content_type: 'technology',
          include: 2, // Include nested entries
          ...(slug ? { 'fields.slug': slug } : {})
        };

        console.log('[useTechnologySections] Query:', query);
        
        const entries = await client.getEntries(query);
        console.log(`[useTechnologySections] Found ${entries.items.length} technologies`);

        // Transform contentful response to our app format
        const technologies: CMSTechnology[] = entries.items.map(entry => {
          const fields = entry.fields as any;
          
          // Map sections if they exist
          const sections: CMSTechnologySection[] = fields.sections?.map((section: any, index: number) => {
            const sectionFields = section.fields;
            
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

          console.log(`[useTechnologySections] Processed ${sections.length} sections for technology "${fields.title}"`);

          // Create a proper CMSImage object for image
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

        if (slug) {
          const technology = technologies[0];
          console.log(`[useTechnologySections] Returning single technology with ${technology?.sections?.length || 0} sections`);
          return technology;
        }

        console.log(`[useTechnologySections] Returning ${technologies.length} technologies`);
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
