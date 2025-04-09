import { CMSBusinessGoal } from '@/types/cms';
import { supabase } from '@/config/supabase';

/**
 * Fetches all business goals from the database.
 * @returns A promise that resolves to an array of CMSBusinessGoal objects.
 */
export const fetchBusinessGoals = async (): Promise<CMSBusinessGoal[]> => {
  try {
    const { data, error } = await supabase
      .from('business_goals')
      .select(`
        id,
        slug,
        title,
        description,
        image_url,
        image_alt,
        visible,
        created_at,
        updated_at,
        icon,
        features (
          id,
          title,
          description,
          icon,
          display_order,
          screenshot_url,
          screenshot_alt
        )
      `);

    if (error) {
      console.error("Error fetching business goals:", error);
      throw new Error(`Failed to fetch business goals: ${error.message}`);
    }

    if (!data) {
      console.warn("No business goals found.");
      return [];
    }

    // Map the data to the CMSBusinessGoal interface
    const businessGoals: CMSBusinessGoal[] = data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      visible: item.visible,
      created_at: item.created_at,
      updated_at: item.updated_at,
      icon: item.icon,
      image: {
        id: `img-${Math.random().toString(36).substr(2, 9)}`,
        url: item.image_url || '',
        alt: item.image_alt || item.title
      },
      benefits: [], // Assuming benefits are not directly fetched here
      features: item.features?.map(f => ({
        id: f.id || `feature-${Math.random().toString(36).substr(2, 9)}`,
        title: f.title,
        description: f.description,
        icon: f.icon,
        display_order: f.display_order,
        ...(f.screenshot_url && {
          screenshot: {
            id: `screenshot-${Math.random().toString(36).substr(2, 9)}`,
            url: f.screenshot_url,
            alt: f.screenshot_alt || f.title
          }
        })
      })) || [],
      caseStudies: [] // Assuming caseStudies are not directly fetched here
    }));

    console.log("Successfully fetched business goals:", businessGoals);
    return businessGoals;
  } catch (error: any) {
    console.error("Error in fetchBusinessGoals:", error);
    throw new Error(`Failed to fetch business goals: ${error.message}`);
  }
};
