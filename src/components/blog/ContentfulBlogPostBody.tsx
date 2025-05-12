
import React from "react";
import { Document } from "@contentful/rich-text-types";
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import { ContentfulAsset } from '@/types/contentful';
import { Asset } from 'contentful';
import { logDeprecation } from '@/services/cms/utils/deprecation';

interface ContentfulBlogPostBodyProps {
  content?: Document;
  includedAssets?: any[];
}

// Helper function to normalize Contentful assets to our ContentfulAsset type
const normalizeAssets = (assets: any[]): ContentfulAsset[] => {
  if (!assets || !Array.isArray(assets)) return [];
  
  return assets.map(asset => {
    // Handle both our ContentfulAsset type and Contentful's Asset type
    if (asset?.fields) {
      // Return normalized asset structure
      return {
        sys: {
          id: asset.sys?.id || ''
        },
        fields: {
          title: asset.fields.title || '',
          file: {
            url: asset.fields.file?.url || '',
            details: asset.fields.file?.details,
            fileName: asset.fields.file?.fileName,
            contentType: asset.fields.file?.contentType
          }
        }
      };
    }
    return asset as ContentfulAsset;
  });
};

/**
 * Renders Contentful Rich Text content with embedded assets
 */
const ContentfulBlogPostBody: React.FC<ContentfulBlogPostBodyProps> = ({ 
  content, 
  includedAssets = [] 
}) => {
  // Log any missing content for debugging purposes
  React.useEffect(() => {
    if (!content) {
      logDeprecation('ContentfulBlogPostBody', 'Rendering without content');
    }
  }, [content]);

  // Normalize assets to ensure they match our ContentfulAsset type
  const normalizedAssets = normalizeAssets(includedAssets);

  return (
    <div className="prose max-w-none prose-slate mb-12">
      {content ? (
        renderRichText(content, { includedAssets: normalizedAssets })
      ) : (
        <p>No content available for this blog post.</p>
      )}
    </div>
  );
};

export default ContentfulBlogPostBody;
