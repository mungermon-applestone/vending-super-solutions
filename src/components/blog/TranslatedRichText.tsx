import React from "react";
import { Document } from "@contentful/rich-text-types";
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import { useBatchTranslation } from '@/hooks/useTranslation';
import TranslatableText from '@/components/translation/TranslatableText';

interface TranslatedRichTextProps {
  content: Document;
  includedAssets?: any[];
  context?: string;
}

// Extract all text content from rich text for batch translation
const extractAllText = (content: Document): string => {
  const texts: string[] = [];
  
  const traverse = (node: any) => {
    if (node.nodeType === 'text' && node.value?.trim()) {
      texts.push(node.value.trim());
    }
    
    if (node.content) {
      node.content.forEach(traverse);
    }
  };
  
  if (content?.content) {
    content.content.forEach(traverse);
  }
  
  return texts.join(' ');
};

const TranslatedRichText: React.FC<TranslatedRichTextProps> = ({ 
  content, 
  includedAssets = [],
  context = 'blog-richtext' 
}) => {
  const fullText = React.useMemo(() => extractAllText(content), [content]);
  
  const { translations, isLoading } = useBatchTranslation([fullText], { context });
  
  // If we have translations, we need to render a simpler version
  // For now, let's just render the content normally and translate key text elements
  if (isLoading && fullText.length > 20) {
    return <div className="animate-pulse bg-gray-100 h-16 rounded w-full" />;
  }
  
  // For now, render normally - the individual text nodes will be handled by
  // the parent components wrapping specific elements with TranslatableText
  return <>{renderRichText(content, { includedAssets })}</>;
};

export default TranslatedRichText;