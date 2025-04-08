
import { supabase } from '@/integrations/supabase/client';
import { CMSBusinessGoal } from '@/types/cms';
import { normalizeSlug } from '../utils/slugMatching';

/**
 * Fetch business goals from the database
 */
export async function fetchBusinessGoals<T>(): Promise<T[]> {
  console.log('[fetchBusinessGoals] Fetching business goals from database');
  
  try {
    // Fetch business goals
    const { data: goals, error: goalsError } = await supabase
      .from('business_goals')
      .select('*')
      .order('title');
      
    if (goalsError) {
      console.error('[fetchBusinessGoals] Error fetching business goals:', goalsError);
      throw goalsError;
    }
    
    if (!goals || goals.length === 0) {
      console.log('[fetchBusinessGoals] No business goals found');
      return [] as T[];
    }
    
    const enhancedGoals: CMSBusinessGoal[] = [];
    
    // For each business goal, fetch associated data
    for (const goal of goals) {
      // Fetch benefits
      const { data: benefits, error: benefitsError } = await supabase
        .from('business_goal_benefits')
        .select('benefit')
        .eq('business_goal_id', goal.id)
        .order('display_order');
        
      if (benefitsError) {
        console.error(`[fetchBusinessGoals] Error fetching benefits for goal ${goal.id}:`, benefitsError);
        // Continue with the next goal
        continue;
      }
      
      // Fetch features
      const { data: features, error: featuresError } = await supabase
        .from('business_goal_features')
        .select(`
          id, title, description, icon, display_order
        `)
        .eq('business_goal_id', goal.id)
        .order('display_order');
        
      if (featuresError) {
        console.error(`[fetchBusinessGoals] Error fetching features for goal ${goal.id}:`, featuresError);
        // Continue with the next goal
        continue;
      }
      
      // Enhance features with their screenshots
      const enhancedFeatures = await Promise.all(
        (features || []).map(async (feature) => {
          // Fetch feature image
          const { data: screenshot, error: screenshotError } = await supabase
            .from('business_goal_feature_images')
            .select('url, alt')
            .eq('feature_id', feature.id)
            .maybeSingle();
            
          if (screenshotError) {
            console.error(`[fetchBusinessGoals] Error fetching screenshot for feature ${feature.id}:`, screenshotError);
          }
          
          return {
            ...feature,
            screenshot: screenshot ? {
              url: screenshot.url,
              alt: screenshot.alt
            } : undefined
          };
        })
      );
      
      // Create the enhanced business goal object
      const enhancedGoal: CMSBusinessGoal = {
        id: goal.id,
        slug: goal.slug,
        title: goal.title,
        description: goal.description,
        icon: goal.icon,
        image: {
          url: goal.image_url || '',
          alt: goal.image_alt || goal.title
        },
        benefits: (benefits || []).map(b => b.benefit),
        features: enhancedFeatures,
        caseStudies: [] // We'll need to implement this if case studies become a requirement
      };
      
      enhancedGoals.push(enhancedGoal);
    }
    
    console.log(`[fetchBusinessGoals] Returning ${enhancedGoals.length} business goals`);
    return enhancedGoals as unknown as T[];
  } catch (error) {
    console.error('[fetchBusinessGoals] Error in fetchBusinessGoals:', error);
    throw error;
  }
}

/**
 * Fetch a business goal by slug
 */
export async function fetchBusinessGoalBySlug<T>(slug: string): Promise<T | null> {
  console.log(`[fetchBusinessGoalBySlug] Fetching business goal with slug "${slug}"`);
  
  const normalizedSlug = normalizeSlug(slug);
  
  try {
    // Fetch the business goal
    const { data: goal, error: goalError } = await supabase
      .from('business_goals')
      .select('*')
      .eq('slug', normalizedSlug)
      .maybeSingle();
      
    if (goalError) {
      console.error(`[fetchBusinessGoalBySlug] Error fetching business goal with slug "${normalizedSlug}":`, goalError);
      throw goalError;
    }
    
    if (!goal) {
      console.log(`[fetchBusinessGoalBySlug] No business goal found with slug "${normalizedSlug}"`);
      return null;
    }
    
    // Fetch benefits
    const { data: benefits, error: benefitsError } = await supabase
      .from('business_goal_benefits')
      .select('benefit')
      .eq('business_goal_id', goal.id)
      .order('display_order');
      
    if (benefitsError) {
      console.error(`[fetchBusinessGoalBySlug] Error fetching benefits for goal ${goal.id}:`, benefitsError);
      // Continue anyway
    }
    
    // Fetch features
    const { data: features, error: featuresError } = await supabase
      .from('business_goal_features')
      .select(`
        id, title, description, icon, display_order
      `)
      .eq('business_goal_id', goal.id)
      .order('display_order');
      
    if (featuresError) {
      console.error(`[fetchBusinessGoalBySlug] Error fetching features for goal ${goal.id}:`, featuresError);
      // Continue anyway
    }
    
    // Enhance features with their screenshots
    const enhancedFeatures = await Promise.all(
      (features || []).map(async (feature) => {
        // Fetch feature image
        const { data: screenshot, error: screenshotError } = await supabase
          .from('business_goal_feature_images')
          .select('url, alt')
          .eq('feature_id', feature.id)
          .maybeSingle();
          
        if (screenshotError) {
          console.error(`[fetchBusinessGoalBySlug] Error fetching screenshot for feature ${feature.id}:`, screenshotError);
        }
        
        return {
          ...feature,
          screenshot: screenshot ? {
            url: screenshot.url,
            alt: screenshot.alt
          } : undefined
        };
      })
    );
    
    // Create the enhanced business goal object
    const enhancedGoal: CMSBusinessGoal = {
      id: goal.id,
      slug: goal.slug,
      title: goal.title,
      description: goal.description,
      icon: goal.icon,
      image: {
        url: goal.image_url || '',
        alt: goal.image_alt || goal.title
      },
      benefits: (benefits || []).map(b => b.benefit),
      features: enhancedFeatures,
      caseStudies: [] // We'll need to implement this if case studies become a requirement
    };
    
    console.log(`[fetchBusinessGoalBySlug] Returning business goal: ${goal.title}`);
    return enhancedGoal as unknown as T;
  } catch (error) {
    console.error(`[fetchBusinessGoalBySlug] Error fetching business goal with slug "${slug}":`, error);
    throw error;
  }
}
