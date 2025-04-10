
import { CMSBusinessGoal } from '@/types/cms';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches all business goals from the database.
 * @returns A promise that resolves to an array of CMSBusinessGoal objects.
 */
export const fetchBusinessGoals = async (): Promise<CMSBusinessGoal[]> => {
  try {
    // First, fetch all business goals
    const { data: goalsData, error: goalsError } = await supabase
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
      `);

    if (goalsError) {
      console.error("Error fetching business goals:", goalsError);
      throw new Error(`Failed to fetch business goals: ${goalsError.message}`);
    }

    if (!goalsData || goalsData.length === 0) {
      console.warn("No business goals found.");
      return [];
    }

    // Create a map of business goals for easier lookup when adding features
    const businessGoals = goalsData.map((goal: any) => ({
      id: goal.id,
      slug: goal.slug,
      title: goal.title,
      description: goal.description,
      visible: goal.visible,
      created_at: goal.created_at,
      updated_at: goal.updated_at,
      icon: goal.icon,
      image: goal.image_url ? {
        id: `img-${Math.random().toString(36).substr(2, 9)}`,
        url: goal.image_url,
        alt: goal.image_alt || goal.title
      } : undefined,
      benefits: [],
      features: [],
      caseStudies: []
    }));

    // Fetch features for all business goals
    const { data: featuresData, error: featuresError } = await supabase
      .from('business_goal_features')
      .select(`
        id,
        business_goal_id,
        title,
        description,
        icon,
        display_order
      `);

    if (featuresError) {
      console.error("Error fetching business goal features:", featuresError);
      // We'll continue without features rather than failing completely
    }

    // If we have features, fetch their screenshots
    if (featuresData && featuresData.length > 0) {
      // Fetch screenshots for features
      const { data: screenshotsData, error: screenshotsError } = await supabase
        .from('business_goal_feature_images')
        .select(`
          id,
          feature_id,
          url,
          alt,
          width,
          height
        `);

      if (screenshotsError) {
        console.error("Error fetching feature screenshots:", screenshotsError);
        // Continue without screenshots
      }

      // Create a map of screenshots by feature_id for easier lookup
      const screenshotsByFeatureId = screenshotsData ? 
        screenshotsData.reduce((acc: Record<string, any>, screenshot: any) => {
          acc[screenshot.feature_id] = {
            id: screenshot.id,
            url: screenshot.url,
            alt: screenshot.alt,
            width: screenshot.width,
            height: screenshot.height
          };
          return acc;
        }, {}) : {};

      // Add features to their respective business goals
      for (const feature of featuresData) {
        const businessGoal = businessGoals.find(goal => goal.id === feature.business_goal_id);
        if (businessGoal) {
          const screenshot = screenshotsByFeatureId[feature.id];
          businessGoal.features.push({
            id: feature.id,
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
            display_order: feature.display_order,
            ...(screenshot && {
              screenshot: {
                id: screenshot.id,
                url: screenshot.url,
                alt: screenshot.alt,
                width: screenshot.width,
                height: screenshot.height
              }
            })
          });
        }
      }
    }

    // Fetch benefits for all business goals
    const { data: benefitsData, error: benefitsError } = await supabase
      .from('business_goal_benefits')
      .select(`
        business_goal_id,
        benefit,
        display_order
      `);

    if (benefitsError) {
      console.error("Error fetching business goal benefits:", benefitsError);
      // Continue without benefits
    } else if (benefitsData) {
      // Add benefits to their respective business goals
      for (const benefit of benefitsData) {
        const businessGoal = businessGoals.find(goal => goal.id === benefit.business_goal_id);
        if (businessGoal) {
          businessGoal.benefits.push(benefit.benefit);
        }
      }
    }

    console.log("Successfully fetched business goals:", businessGoals);
    return businessGoals;
  } catch (error: any) {
    console.error("Error in fetchBusinessGoals:", error);
    throw new Error(`Failed to fetch business goals: ${error.message}`);
  }
};
