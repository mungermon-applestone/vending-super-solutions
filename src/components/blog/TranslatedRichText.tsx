import React from "react";
import { Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { getRichTextRenderOptions } from '@/utils/contentful/richTextRenderer';
import { useBatchTranslation } from '@/hooks/useTranslation';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';

interface TranslatedRichTextProps {
  content: Document;
  includedAssets?: any[];
  context?: string;
}

// Extract all unique text content from rich text for batch translation
const extractAllText = (content: Document): string[] => {
  // Early return for invalid content to ensure stable array
  if (!content?.content || !Array.isArray(content.content)) {
    return [];
  }

  const texts: string[] = [];
  const seenTexts = new Set<string>();
  
  const traverse = (node: any) => {
    if (!node) return;
    
    if (node.nodeType === 'text' && node.value?.trim()) {
      const text = node.value.trim();
      if (!seenTexts.has(text) && text.length > 0) {
        seenTexts.add(text);
        texts.push(text);
      }
    }
    
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  };
  
  try {
    content.content.forEach(traverse);
  } catch (error) {
    console.warn('[TranslatedRichText] Error extracting text:', error);
    return [];
  }
  
  return texts;
};

const TranslatedRichText: React.FC<TranslatedRichTextProps> = ({ 
  content, 
  includedAssets = [],
  context = 'blog-richtext' 
}) => {
  // Early return for invalid content to maintain consistent hook calls
  if (!content || !content.content || !Array.isArray(content.content)) {
    return null;
  }

  const textNodes = React.useMemo(() => extractAllText(content), [content]);
  
  const { translations, isLoading } = useBatchTranslation(textNodes, { context });
  
  // Show loading state for longer content
  if (isLoading && textNodes.join(' ').length > 20) {
    return <div className="animate-pulse bg-muted h-16 rounded w-full" />;
  }
  
  // Create a mapping from original text to translated text
  const translationMap = React.useMemo(() => {
    const map = new Map<string, string>();
    textNodes.forEach((originalText, index) => {
      const translatedText = translations?.[index];
      if (translatedText && translatedText !== originalText) {
        map.set(originalText, translatedText);
      }
    });
    return map;
  }, [textNodes, translations]);
  
  // Get base render options and override the text renderer
  const baseOptions = getRichTextRenderOptions({ includedAssets });
  
  const renderOptions = {
    ...baseOptions,
    renderText: (text: string) => {
      const trimmedText = text.trim();
      return translationMap.get(trimmedText) || text;
    }
  };
  
  return <>{documentToReactComponents(content, renderOptions)}</>;
};

export default TranslatedRichText;