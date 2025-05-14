
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMSBusinessGoal } from '@/types/cms';

// Types for Contentful response objects
interface ContentfulVideo {
  sys: {
    id: string;
  };
  fields: {
    title?: string;
    file?: {
      url: string;
      contentType: string;
    };
  };
}

interface ContentfulBusinessGoal {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    icon?: string;
    image?: any;
    benefits?: string[];
    features?: any[];
    visible?: boolean;
    video?: ContentfulVideo;
    recommendedMachines?: any[];
    showOnHomepage?: boolean;
    homepageOrder?: number;
    displayOrder?: number;
  };
}

export function useContentfulBusinessGoals(options?: {
  showOnHomepage?: boolean;
  sort?: 'homepageOrder' | 'displayOrder';
}) {
  return useQuery({
    queryKey: ['contentful', 'businessGoals', options],
    queryFn: async () => {
      console.log('[useContentfulBusinessGoals] Fetching all business goals with options:', options);
      try {
        // Build query params
        const queryParams: Record<string, any> = {};
        
        if (options?.showOnHomepage !== undefined) {
          queryParams['fields.showOnHomepage'] = options.showOnHomepage;
        }
        
        // Determine sorting
        let orderField = 'sys.createdAt';
        if (options?.sort === 'homepageOrder' && options?.showOnHomepage) {
          orderField = 'fields.homepageOrder';
        } else if (options?.sort === 'displayOrder' || !options?.sort) {
          orderField = 'fields.displayOrder';
        }
        
        queryParams['order'] = orderField;
        
        const entries = await fetchContentfulEntries('businessGoal', queryParams);
        
        console.log('[useContentfulBusinessGoals] Raw entries:', entries);
        
        if (!entries || entries.length === 0) {
          console.log('[useContentfulBusinessGoals] No entries found, returning empty array');
          return [];
        }
        
        const mappedEntries = entries.map(entry => {
          // Detailed logging for video asset
          if (entry.fields.video) {
            const videoAsset = entry.fields.video;
            console.log(`[useContentfulBusinessGoals] Business goal ${entry.fields.title} video details:`, {
              id: videoAsset.sys?.id,
              type: videoAsset.sys?.type,
              hasFields: !!videoAsset.fields,
              hasFile: videoAsset.fields && !!videoAsset.fields.file,
              url: videoAsset.fields?.file?.url,
              fileContentType: videoAsset.fields?.file?.contentType
            });
          } else {
            console.log(`[useContentfulBusinessGoals] Business goal ${entry.fields.title} has no video`);
          }
          
          // Map the entry to our CMS model
          return {
            id: entry.sys?.id,
            title: entry.fields.title,
            slug: entry.fields.slug,
            description: entry.fields.description,
            icon: entry.fields.icon,
            visible: entry.fields.visible ?? true,
            image: entry.fields.image ? {
              id: entry.fields.image.sys?.id,
              url: `https:${entry.fields.image.fields?.file?.url}`,
              alt: entry.fields.image.fields?.title || entry.fields.title
            } : undefined,
            benefits: (entry.fields.benefits || []).map(benefit => String(benefit)),
            features: (entry.fields.features || []).map((feature: any) => {
              // Add null checks to prevent undefined errors
              if (!feature || !feature.fields) {
                console.warn(`[useContentfulBusinessGoals] Invalid feature found in ${entry.fields.title}`);
                return {
                  id: 'invalid-feature',
                  title: 'Unavailable Feature',
                  description: 'This feature is not available',
                  icon: undefined,
                  screenshot: undefined
                };
              }
              
              return {
                id: feature.sys?.id || `feature-${Math.random().toString(36).substring(7)}`,
                title: feature.fields?.title || 'Unnamed Feature',
                description: feature.fields?.description || '',
                icon: feature.fields?.icon,
                screenshot: feature.fields?.screenshot ? {
                  id: feature.fields.screenshot.sys?.id,
                  url: `https:${feature.fields.screenshot.fields?.file?.url}`,
                  alt: feature.fields.screenshot.fields?.title
                } : undefined
              };
            }),
            // Enhanced video mapping
            video: entry.fields.video ? {
              id: entry.fields.video.sys?.id,
              url: entry.fields.video.fields?.file?.url 
                ? `https:${entry.fields.video.fields.file.url}` 
                : null,
              title: entry.fields.video.fields?.title || entry.fields.title || 'Business Goal Video'
            } : undefined,
            recommendedMachines: (entry.fields.recommendedMachines || []).map((machine: any) => {
              // Add null checks for machines too
              if (!machine || !machine.fields) {
                console.warn(`[useContentfulBusinessGoals] Invalid machine found in ${entry.fields.title}`);
                return {
                  id: 'invalid-machine',
                  slug: 'unavailable',
                  title: 'Unavailable Machine',
                  description: 'This machine is not available',
                  image: undefined
                };
              }
              
              return {
                id: machine.sys?.id || `machine-${Math.random().toString(36).substring(7)}`,
                slug: machine.fields.slug || 'unavailable',
                title: machine.fields.title || 'Unnamed Machine',
                description: machine.fields.description || '',
                image: machine.fields.images?.[0] ? {
                  url: `https:${machine.fields.images[0].fields.file.url}`,
                  alt: machine.fields.images[0].fields.title || machine.fields.title
                } : undefined
              };
            })
          };
        }) as CMSBusinessGoal[];
        
        // Log the result of mapping
        console.log('[useContentfulBusinessGoals] Mapped entries:', 
          mappedEntries.map(entry => ({
            id: entry.id,
            title: entry.title,
            hasVideo: !!entry.video,
            videoUrl: entry.video?.url
          }))
        );
        
        return mappedEntries;
      } catch (error) {
        console.error('[useContentfulBusinessGoals] Error:', error);
        if (window.location.hostname.includes('lovable')) {
          console.log('[useContentfulBusinessGoals] Returning empty array for preview environment');
          return [];
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}

export function useContentfulBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'businessGoal', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      console.log(`[useContentfulBusinessGoal] Fetching business goal with slug: ${slug}`);
      try {
        const entries = await fetchContentfulEntries('businessGoal', {
          'fields.slug': slug
        });
        
        if (entries.length === 0) {
          console.log(`[useContentfulBusinessGoal] No business goal found with slug: ${slug}`);
          return null;
        }

        const entry = entries[0];
        console.log('[useContentfulBusinessGoal] Raw entry data:', JSON.stringify(entry, null, 2));
        
        // Detailed logging for video asset
        if (entry.fields.video) {
          const videoAsset = entry.fields.video;
          console.log('[useContentfulBusinessGoal] Raw video data:', {
            videoSysId: videoAsset.sys?.id,
            videoSysType: videoAsset.sys?.type,
            hasFields: !!videoAsset.fields,
            hasFileField: videoAsset.fields && !!videoAsset.fields.file,
            fileUrl: videoAsset.fields?.file?.url,
            fileContentType: videoAsset.fields?.file?.contentType,
            fileDetails: videoAsset.fields?.file?.details
          });
        } else {
          console.log('[useContentfulBusinessGoal] No video data found in entry');
        }
        
        // Map the entry to our CMS model with improved error handling
        const mappedEntry: CMSBusinessGoal = {
          id: entry.sys?.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          description: entry.fields.description,
          icon: entry.fields.icon,
          visible: entry.fields.visible ?? true,
          image: entry.fields.image ? {
            id: entry.fields.image.sys?.id,
            url: `https:${entry.fields.image.fields?.file?.url}`,
            alt: entry.fields.image.fields?.title || entry.fields.title
          } : undefined,
          benefits: entry.fields.benefits?.map(benefit => String(benefit)) || [],
          
          // Improved features mapping with null checks
          features: entry.fields.features && Array.isArray(entry.fields.features) 
            ? entry.fields.features.map(feature => {
                if (!feature || !feature.fields) {
                  console.warn(`[useContentfulBusinessGoal] Invalid feature found in ${entry.fields.title}`);
                  return {
                    id: 'invalid-feature',
                    title: 'Unavailable Feature',
                    description: 'This feature information is not available',
                    icon: undefined,
                    screenshot: undefined
                  };
                }
                
                return {
                  id: feature.sys?.id || `feature-${Math.random().toString(36).substring(7)}`,
                  title: feature.fields?.title || 'Unnamed Feature',
                  description: feature.fields?.description || '',
                  icon: feature.fields?.icon,
                  screenshot: feature.fields?.screenshot && feature.fields.screenshot.fields
                    ? {
                        id: feature.fields.screenshot.sys?.id,
                        url: `https:${feature.fields.screenshot.fields.file?.url}`,
                        alt: feature.fields.screenshot.fields.title
                      }
                    : undefined
                };
              })
            : [],
          
          // Enhanced video extraction with thorough null checking
          video: entry.fields.video && entry.fields.video.fields && entry.fields.video.fields.file ? {
            id: entry.fields.video.sys?.id || '',
            url: entry.fields.video.fields.file.url 
              ? `https:${entry.fields.video.fields.file.url}` 
              : null,
            title: entry.fields.video.fields.title || entry.fields.title || 'Business Goal Video'
          } : undefined,
          
          // Improved machine mapping with null checks
          recommendedMachines: entry.fields.recommendedMachines && Array.isArray(entry.fields.recommendedMachines)
            ? entry.fields.recommendedMachines.map(machine => {
                if (!machine || !machine.fields) {
                  console.warn(`[useContentfulBusinessGoal] Invalid recommended machine in ${entry.fields.title}`);
                  return {
                    id: 'invalid-machine',
                    slug: 'unavailable',
                    title: 'Unavailable Machine',
                    description: 'This machine is not available',
                    image: undefined
                  };
                }
                
                return {
                  id: machine.sys?.id || `machine-${Math.random().toString(36).substring(7)}`,
                  slug: machine.fields.slug || 'unavailable',
                  title: machine.fields.title || 'Unnamed Machine',
                  description: machine.fields.description || '',
                  image: machine.fields.images && Array.isArray(machine.fields.images) && machine.fields.images[0]
                    ? {
                        url: `https:${machine.fields.images[0].fields.file.url}`,
                        alt: machine.fields.images[0].fields.title || machine.fields.title
                      }
                    : undefined
                };
              })
            : []
        };

        // Log the mapped entry for debugging
        console.log('[useContentfulBusinessGoal] Mapped entry:', {
          id: mappedEntry.id,
          title: mappedEntry.title,
          slug: mappedEntry.slug, 
          hasVideo: !!mappedEntry.video,
          videoDetails: mappedEntry.video,
          featuresCount: mappedEntry.features?.length || 0,
          recommendedMachinesCount: mappedEntry.recommendedMachines?.length || 0
        });
        
        return mappedEntry;
      } catch (error) {
        console.error(`[useContentfulBusinessGoal] Error:`, error);
        return null;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}
