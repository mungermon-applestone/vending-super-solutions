
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
          screenshot_id,
          screenshot:screenshot_id (
            url,
            alt
          )
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("[fetchBusinessGoalBySlug] Error fetching business goal:", error);
      return null;
    }

    if (!data) {
      console.log("[fetchBusinessGoalBySlug] Business goal not found.");
      return null;
    }

    // Map the data to the CMSBusinessGoal interface
    const businessGoal: CMSBusinessGoal = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      image: {
        id: `img-${Math.random().toString(36).substr(2, 9)}`,
        url: data.image_url || '',
        alt: data.image_alt || data.title
      },
      visible: data.visible,
      created_at: data.created_at,
      updated_at: data.updated_at,
      icon: data.icon,
      benefits: [], // Assuming benefits are not directly fetched here
      caseStudies: [], // Assuming caseStudies are not directly fetched here
      features: data.features?.map(f => ({
        id: f.id || `feature-${Math.random().toString(36).substr(2, 9)}`,
        title: f.title,
        description: f.description,
        icon: f.icon,
        display_order: f.display_order,
        ...(f.screenshot && {
          screenshot: {
            id: `screenshot-${Math.random().toString(36).substr(2, 9)}`,
            url: f.screenshot.url,
            alt: f.screenshot.alt || f.title
          }
        })
      })) || [],
    };

    console.log(`[fetchBusinessGoalBySlug] Successfully fetched business goal: ${businessGoal.title}`);
    return businessGoal as T;
  } catch (error) {
    console.error("[fetchBusinessGoalBySlug] Unexpected error:", error);
    return null;
  }
}
