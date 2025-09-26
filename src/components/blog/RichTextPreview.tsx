import React from "react";
import { Document } from "@contentful/rich-text-types";
import TranslatedRichText from './TranslatedRichText';

interface RichTextPreviewProps {
  content?: Document;
  includedAssets?: any[];
  maxParagraphs?: number;
}

const RichTextPreview: React.FC<RichTextPreviewProps> = ({ 
  content, 
  includedAssets = [],
  maxParagraphs = 3
}) => {
  if (!content || !content.content) {
    return null;
  }

  // Extract only the first few paragraphs/blocks
  const limitedContent: Document = {
    ...content,
    content: content.content.slice(0, maxParagraphs)
  };

  return (
    <div className="prose prose-slate max-w-none [&>*:last-child]:mb-0">
      <TranslatedRichText content={limitedContent} includedAssets={includedAssets} context="blog-preview" />
    </div>
  );
};

export default RichTextPreview;