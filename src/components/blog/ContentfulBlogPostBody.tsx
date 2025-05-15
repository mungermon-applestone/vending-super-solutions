
import React from "react";
import { Document } from "@contentful/rich-text-types";
import { renderRichText } from '@/utils/contentful/richTextRenderer';

interface ContentfulBlogPostBodyProps {
  content?: Document;
  includedAssets?: any[];
}

const ContentfulBlogPostBody: React.FC<ContentfulBlogPostBodyProps> = ({ 
  content, 
  includedAssets = [] 
}) => {
  // For debugging
  React.useEffect(() => {
    if (content) {
      console.log("Blog post rich text content structure:", JSON.stringify(content, null, 2));
      console.log("Available included assets:", includedAssets);
    }
  }, [content, includedAssets]);

  return (
    <div className="prose max-w-none prose-slate mb-12">
      {content ? (
        renderRichText(content, { includedAssets })
      ) : (
        <p>No content available for this blog post.</p>
      )}
    </div>
  );
};

export default ContentfulBlogPostBody;
