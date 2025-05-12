
import React from "react";
import { Document } from "@contentful/rich-text-types";
import ContentfulRichText from "@/components/contentful/ContentfulRichText";
import { ContentfulAsset } from "@/types/contentful";

interface ContentfulBlogPostBodyProps {
  content?: Document;
  includedAssets?: ContentfulAsset[];
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
    <div className="mb-12">
      {content ? (
        <ContentfulRichText 
          content={content} 
          includedAssets={includedAssets}
          className="prose max-w-none prose-slate"
        />
      ) : (
        <p>No content available for this blog post.</p>
      )}
    </div>
  );
};

export default ContentfulBlogPostBody;
