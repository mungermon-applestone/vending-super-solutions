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

// Deep-clone and apply translations to text nodes of a Rich Text document
const applyTranslationsToDocument = (doc: Document, translationMap: Map<string, string>): Document => {
  const deepClone = (node: any): any => {
    if (!node) return node;
    const cloned: any = { ...node };

    if (node.nodeType === 'text' && typeof node.value === 'string') {
      const originalValue: string = node.value;
      const trimmed = originalValue.trim();
      const translated = translationMap.get(trimmed);
      if (translated && translated !== trimmed) {
        // Preserve leading/trailing whitespace around the trimmed segment
        const leadingIndex = originalValue.indexOf(trimmed);
        const leading = leadingIndex >= 0 ? originalValue.slice(0, leadingIndex) : '';
        const trailing = leadingIndex >= 0 ? originalValue.slice(leadingIndex + trimmed.length) : '';
        cloned.value = `${leading}${translated}${trailing}`;
      }
    }

    if (Array.isArray(node.content)) {
      cloned.content = node.content.map(deepClone);
    }
    if (node.data) {
      try {
        cloned.data = JSON.parse(JSON.stringify(node.data));
      } catch {
        // noop
      }
    }
    return cloned;
  };

  return deepClone(doc);
};

const TranslatedRichText: React.FC<TranslatedRichTextProps> = ({ 
  content, 
  includedAssets = [],
  context = 'blog-richtext' 
}) => {
  // Determine content validity but do NOT return early to keep hook order stable
  const isValidContent = !!(content && content.content && Array.isArray(content.content));

  const textNodes = React.useMemo(() => (isValidContent ? extractAllText(content) : []), [content, isValidContent]);
  
  const { translations, isLoading } = useBatchTranslation(textNodes, { context, enabled: isValidContent && textNodes.length > 0 });
  
  // Debug: verify stable path between renders
  console.debug('[TranslatedRichText]', { isValidContent, textCount: textNodes.length, enabled: isValidContent && textNodes.length > 0 });
  
  // Show loading state for longer content
  const totalLength = React.useMemo(() => textNodes.reduce((acc, t) => acc + t.length + 1, 0), [textNodes]);
  if (isLoading && totalLength > 20) {
    return <div className="animate-pulse bg-muted h-16 rounded w-full" />;
  }
  
  // Guard: if content is invalid, render nothing after hooks have executed
  if (!isValidContent) {
    return null;
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
  
  // Prepare a translated document by applying the map to text nodes
  const translatedContent = React.useMemo(() => {
    if (!isValidContent) return null;
    try {
      if (!translationMap || translationMap.size === 0) return content;
      return applyTranslationsToDocument(content as Document, translationMap);
    } catch (e) {
      console.warn('[TranslatedRichText] Failed to apply translations to document:', e);
      return content;
    }
  }, [content, isValidContent, translationMap]);
  
  // Get base render options
  const renderOptions = getRichTextRenderOptions({ includedAssets });

  try {
    return <>{documentToReactComponents((translatedContent as Document) || content, renderOptions)}</>;
  } catch (error) {
    console.error('[TranslatedRichText] Rendering error:', error);
    return <div className="text-muted-foreground text-sm">Failed to render content.</div>;
  }
};

export default TranslatedRichText;
