import React from "react";
import { Document } from "@contentful/rich-text-types";
import { renderRichText } from '@/utils/contentful/richTextRenderer';

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
      {renderRichText(limitedContent, { includedAssets })}
    </div>
  );
};

export default RichTextPreview;