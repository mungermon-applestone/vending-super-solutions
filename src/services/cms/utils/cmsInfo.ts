
import { supabase } from '@/integrations/supabase/client';

export const getContentfulConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('contentful_config')
      .select('*')
      .single();

    if (error) {
      console.error('[getContentfulConfig] Error fetching config:', error);
      return null;
    }

    console.log('[getContentfulConfig] Fetched configuration:', data);
    return data;
  } catch (error) {
    console.error('[getContentfulConfig] Unexpected error:', error);
    return null;
  }
};
