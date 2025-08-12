# Contentful Preview Setup Guide

## Overview
This implementation provides secure preview URLs for Contentful draft content without requiring authentication or Supabase integration.

## How It Works

### 1. Token-Based Security
- Preview URLs require a secure token parameter: `?token=ct-preview-2024-secure-token`
- Invalid or missing tokens show an access denied page
- Token validation happens client-side for simplicity

### 2. Preview API Integration
- Uses Contentful's Preview API (`preview.contentful.com`) to access draft content
- Separate adapter (`contentfulProductPreviewAdapter`) handles draft content fetching
- Preview client requires the `CONTENTFUL_PREVIEW_TOKEN` environment variable

### 3. URL Structure
Preview URLs follow this pattern:
```
https://applestonesolutions.com/preview/products/[slug]?token=ct-preview-2024-secure-token
```

## Configuration for Contentful

### 1. Add Preview URLs in Contentful Settings
In your Contentful space settings:
1. Go to Settings → Content preview
2. Add preview URLs for each content type:

**Product Types:**
```
Name: Product Preview
URL: https://applestonesolutions.com/preview/products/{entry.fields.slug}?token=ct-preview-2024-secure-token
```

### 2. Environment Variables Required
Add to your environment configuration:
```bash
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_api_token_here
```

The preview token can be found in Contentful under Settings → API keys → Content preview tokens.

## Security Considerations

### Token Security
- **Change the default token** in `src/config/preview.ts` before production use
- Consider implementing token rotation for enhanced security
- Tokens are validated client-side - consider server-side validation for higher security

### Access Control
- Preview content is protected by the token requirement
- No authentication system needed - perfect for client previews
- Content is only accessible with the correct token

## Usage

### For Content Editors
1. In Contentful, navigate to any content entry
2. Click the "Open preview" button
3. Content will open in preview mode with draft changes visible

### For Developers
Preview URLs can be generated programmatically:
```typescript
import { generatePreviewUrl } from '@/config/preview';

const previewUrl = generatePreviewUrl('products', 'my-product-slug');
// Returns: https://yourdomain.com/preview/products/my-product-slug?token=ct-preview-2024-secure-token
```

## Adding New Content Types

To add preview support for other content types:

1. **Create Preview Adapter**
   ```typescript
   // src/services/cms/adapters/[type]/contentful[Type]PreviewAdapter.ts
   export const contentful[Type]PreviewAdapter = {
     // Implement getAll, getBySlug, getById using contentfulPreviewClient
   };
   ```

2. **Create Preview Page Component**
   ```typescript
   // src/pages/preview/[Type]Preview.tsx
   export function [Type]Preview() {
     // Use PreviewWrapper and preview adapter
   }
   ```

3. **Add Route**
   ```typescript
   // In src/routes.tsx
   {
     path: "/preview/[type]/:slug",
     element: <[Type]Preview />,
   }
   ```

4. **Configure in Contentful**
   Add the preview URL in Contentful settings for the new content type.

## Testing

### Test Preview Access
1. Visit a preview URL without the token - should show access denied
2. Visit with correct token - should show preview with banner
3. Verify draft content appears (unpublished changes)

### Debug Information
Preview pages include debug information showing:
- Content ID and timestamps
- Whether content is draft/published
- API response details

## Troubleshooting

### Common Issues

**"Access Denied" Error:**
- Check token parameter in URL
- Verify token matches the one in `src/config/preview.ts`

**"Preview Error" Message:**
- Check `CONTENTFUL_PREVIEW_TOKEN` environment variable
- Verify the token has preview access permissions
- Check network tab for API errors

**Content Not Updating:**
- Ensure using Preview API, not Delivery API
- Check that draft content exists in Contentful
- Verify preview client configuration

### Environment Variable Check
The preview system validates that `CONTENTFUL_PREVIEW_TOKEN` is configured. Check the browser console for configuration errors.

## Best Practices

1. **Security**: Change the default preview token before production
2. **Performance**: Preview content is not cached - consider caching for production
3. **SEO**: Preview URLs include noindex meta tags automatically
4. **Monitoring**: Monitor preview URL usage in analytics

## Future Enhancements

Potential improvements for enhanced security:
- Server-side token validation
- Time-limited preview tokens
- IP-based access restrictions
- Integration with Contentful's webhook system for real-time updates