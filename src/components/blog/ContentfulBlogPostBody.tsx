
import React from "react";
import { Document } from "@contentful/rich-text-types";
import TranslatedRichText from './TranslatedRichText';
import TranslatableText from '@/components/translation/TranslatableText';

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
        <TranslatedRichText content={content} includedAssets={includedAssets} />
      ) : (
        <p><TranslatableText context="blog-article">No content available for this blog post.</TranslatableText></p>
      )}
    </div>
  );
};

export default ContentfulBlogPostBody;
