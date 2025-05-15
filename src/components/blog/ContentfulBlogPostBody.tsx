
import React from "react";
import { Document } from "@contentful/rich-text-types";
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';

interface ContentfulBlogPostBodyProps {
  content?: Document;
  includedAssets?: any[];
}

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
