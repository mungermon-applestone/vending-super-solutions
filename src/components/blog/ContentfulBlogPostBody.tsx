
import React from "react";
import { Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import { Asset } from "contentful";

interface ContentfulBlogPostBodyProps {
  content?: Document;
  includedAssets?: Asset[];
}

/**
 * Renders Contentful rich text content
 */
const renderRichText = (document: Document, options: { includedAssets?: Asset[] }) => {
  if (!document) return null;
  
  try {
    return documentToReactComponents(document, {
      renderNode: {
        // Add custom renderers here if needed
      },
    });
  } catch (error) {
    console.error('[ContentfulBlogPostBody] Error rendering rich text:', error);
    return <p>Error rendering content. Please try again later.</p>;
  }
};

const ContentfulBlogPostBody: React.FC<ContentfulBlogPostBodyProps> = ({ 
  content, 
  includedAssets = [] 
}) => {
  return (
    <ContentfulErrorBoundary contentType="blog post content">
      <div className="prose max-w-none prose-slate mb-12">
        {content ? (
          renderRichText(content, { includedAssets })
        ) : (
          <p>No content available for this blog post.</p>
        )}
      </div>
    </ContentfulErrorBoundary>
  );
};

export default ContentfulBlogPostBody;
