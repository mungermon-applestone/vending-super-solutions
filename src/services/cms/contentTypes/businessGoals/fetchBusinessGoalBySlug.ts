
import { CMSBusinessGoal } from '@/types/cms';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches a single business goal by its slug.
 * @param slug The slug of the business goal to fetch.
 * @returns A promise that resolves to the business goal or null if not found.
 */
export async function fetchBusinessGoalBySlug<T extends CMSBusinessGoal>(slug: string): Promise<T | null> {
  console.log(`[fetchBusinessGoalBySlug] Fetching business goal with slug: ${slug}`);

  try {
    if (!slug) {
      console.warn("[fetchBusinessGoalBySlug] Slug is empty or undefined.");
      return null;
    }

    // First query the main business goal
    const { data: goalData, error: goalError } = await supabase
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
        icon
      `)
      .eq('slug', slug)
      .single();

    if (goalError) {
      console.error("[fetchBusinessGoalBySlug] Error fetching business goal:", goalError);
      return null;
    }

    if (!goalData) {
      console.log("[fetchBusinessGoalBySlug] Business goal not found.");
      return null;
    }

    // Then query the features separately to avoid relation errors
    const { data: featuresData, error: featuresError } = await supabase
      .from('business_goal_features')
      .select(`
        id,
        title,
        description,
        icon,
        display_order
      `)
      .eq('business_goal_id', goalData.id);

    if (featuresError) {
      console.error("[fetchBusinessGoalBySlug] Error fetching features:", featuresError);
      // Continue without features
    }

    // Map the data to the CMSBusinessGoal interface
    const businessGoal: CMSBusinessGoal = {
      id: goalData.id,
      slug: goalData.slug,
      title: goalData.title,
      description: goalData.description,
      image: {
        id: `img-${Math.random().toString(36).substr(2, 9)}`,
        url: goalData.image_url || '',
        alt: goalData.image_alt || goalData.title
      },
      visible: goalData.visible,
      created_at: goalData.created_at,
      updated_at: goalData.updated_at,
      icon: goalData.icon,
      benefits: [], // Assuming benefits are not directly fetched here
      caseStudies: [], // Assuming caseStudies are not directly fetched here
      features: featuresData ? featuresData.map(feature => ({
        id: feature.id || `feature-${Math.random().toString(36).substr(2, 9)}`,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        display_order: feature.display_order
      })) : [],
    };

    console.log(`[fetchBusinessGoalBySlug] Successfully fetched business goal: ${businessGoal.title}`);
    return businessGoal as T;
  } catch (error) {
    console.error("[fetchBusinessGoalBySlug] Unexpected error:", error);
    return null;
  }
}
