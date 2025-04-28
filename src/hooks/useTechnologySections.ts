
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSTechnology, CMSTechnologySection, CMSImage } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';
import { useContentfulConfig } from '@/hooks/useContentfulConfig';

type UseTechnologySectionsOptions = {
  slug?: string;
  enableToasts?: boolean;
  refetchInterval?: number | false;
  debug?: boolean;
  fallbackToEmptyArray?: boolean;
};

export function useTechnologySections(options: UseTechnologySectionsOptions = {}) {
  const { 
    slug, 
    enableToasts = false, 
    refetchInterval = false, 
    debug = false,
    fallbackToEmptyArray = true 
  } = options;
  const { toast } = useToast();
  const { isValid, error: configError, config } = useContentfulConfig();

  // Log configuration details when component mounts
  console.log('[useTechnologySections] Initial config state:', { 
    isValid, 
    hasError: !!configError,
    configErrorMessage: configError || 'No error',
    configValues: {
      hasSpaceId: !!config?.SPACE_ID,
      spaceIdLength: config?.SPACE_ID?.length || 0,
      hasDeliveryToken: !!config?.DELIVERY_TOKEN,
      tokenLength: config?.DELIVERY_TOKEN?.length || 0,
      environment: config?.ENVIRONMENT_ID || 'not set'
    },
    windowEnv: typeof window !== 'undefined' && window.env ? {
      hasSpaceId: !!window.env.VITE_CONTENTFUL_SPACE_ID,
      hasDeliveryToken: !!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
      hasEnvId: !!window.env.VITE_CONTENTFUL_ENVIRONMENT_ID
    } : 'No window.env available'
  });

  const query = useQuery({
    queryKey: ['contentful', 'technology', slug].filter(Boolean),
    queryFn: async () => {
      console.log('[useTechnologySections] Starting technology fetch with debug:', debug);
      console.log('[useTechnologySections] Config validation:', { isValid, configError });
      
      if (!isValid || !config) {
        console.error('[useTechnologySections] Invalid Contentful configuration:', configError);
        throw new Error(configError || 'Invalid Contentful configuration');
      }
      
      try {
        const client = await getContentfulClient();
        console.log('[useTechnologySections] Client initialized successfully');
        
        // First verify the content type exists
        const contentTypes = await client.getContentTypes();
        const technologyType = contentTypes.items.find(type => type.sys.id === 'technology');
        
        if (!technologyType) {
          const error = 'Technology content type not found in Contentful space';
          console.error('[useTechnologySections]', error);
          if (debug) {
            console.log('[useTechnologySections] Available content types:', 
              contentTypes.items.map(type => type.sys.id)
            );
          }
          throw new Error(error);
        }
        
        console.log('[useTechnologySections] Content type found:', {
          id: technologyType.sys.id,
          name: technologyType.name,
          description: technologyType.description,
          fields: technologyType.fields.map(f => f.id)
        });

        // Fetch technology entries
        const query = {
          content_type: 'technology',
          include: 2,
          ...(slug ? { 'fields.slug': slug } : {})
        };

        console.log('[useTechnologySections] Fetching with query:', query);
        
        const entries = await client.getEntries(query);
        
        if (debug) {
          console.log('[useTechnologySections] Raw Contentful response:', JSON.stringify(entries, null, 2));
        }
        
        console.log(`[useTechnologySections] Received ${entries.items.length} technologies`);

        if (entries.items.length === 0) {
          const message = slug 
            ? `No technology found with slug: ${slug}`
            : "No technologies found";
            
          console.warn('[useTechnologySections]', message);
          
          if (enableToasts) {
            toast({
              title: "No Technologies Found",
              description: message,
              variant: "default",
            });
          }
          
          return [];
        }

        return entries.items.map(entry => {
          const fields = entry.fields as any;
          
          if (debug) {
            console.log('[useTechnologySections] Processing technology:', {
              id: entry.sys.id,
              title: fields.title,
              hasImage: !!fields.image,
              hasSections: Array.isArray(fields.sections),
              sections: fields.sections?.length || 0
            });
          }
          
          return {
            id: entry.sys.id,
            title: fields.title,
            slug: fields.slug,
            description: fields.description,
            sections: fields.sections?.map((section: any) => ({
              id: section.sys.id,
              technology_id: entry.sys.id,
              title: section.fields.title,
              summary: section.fields.summary || '',
              description: section.fields.description || '',
              section_type: section.fields.sectionType || 'default',
              display_order: section.fields.displayOrder || 0,
              bulletPoints: section.fields.bulletPoints || [],
              sectionImage: section.fields.sectionImage ? {
                id: section.fields.sectionImage.sys.id,
                url: `https:${section.fields.sectionImage.fields.file.url}`,
                alt: section.fields.title
              } : undefined,
              features: section.fields.features?.map((feature: any) => ({
                id: feature.sys.id,
                title: feature.fields.title,
                description: feature.fields.description,
                icon: feature.fields.icon
              })) || []
            })) || [],
            visible: fields.visible ?? true,
            image: fields.image ? {
              id: fields.image.sys.id,
              url: `https:${fields.image.fields.file.url}`,
              alt: fields.title || 'Technology image'
            } : undefined
          };
        });
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
    enabled: isValid,
    refetchInterval,
    retry: 2
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
