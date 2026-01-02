/**
 * Preview configuration for Contentful draft content
 * Token validation is performed server-side via Edge Function
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Validates a preview token via server-side Edge Function
 * Returns true if the token is valid, false otherwise
 */
export async function validatePreviewToken(token: string): Promise<boolean> {
  if (!token || typeof token !== 'string') {
    return false;
  }

  try {
    const { data, error } = await supabase.functions.invoke('validate-preview', {
      body: { token }
    });

    if (error) {
      console.error('Preview validation error:', error);
      return false;
    }

    return data?.valid === true;
  } catch (error) {
    console.error('Preview validation failed:', error);
    return false;
  }
}

/**
 * Generates preview URLs for Contentful
 * Note: Token must be obtained from authorized source, not hardcoded
 */
export function generatePreviewUrl(contentType: string, slug: string, token: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/preview/${contentType}/${slug}?token=${encodeURIComponent(token)}`;
}
