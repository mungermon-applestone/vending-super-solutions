/**
 * Preview configuration for Contentful draft content
 */

// Generate a secure preview token (you can change this)
export const PREVIEW_TOKEN = 'ct-preview-2024-secure-token';

/**
 * Validates if a preview token is valid
 */
export function validatePreviewToken(token: string): boolean {
  return token === PREVIEW_TOKEN;
}

/**
 * Generates preview URLs for Contentful
 */
export function generatePreviewUrl(contentType: string, slug: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/preview/${contentType}/${slug}?token=${PREVIEW_TOKEN}`;
}