import { useMemo } from 'react';
import { useBatchTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Hook for translating CMS content objects
 * Automatically translates all text fields in CMS content while preserving the original structure
 */
export function useTranslatedCMSContent<T extends Record<string, any>>(
  content: T | null | undefined,
  context: string = 'cms'
): {
  translatedContent: T | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { currentLanguage } = useLanguage();

  // Extract all translatable strings from the content
  const textsToTranslate = useMemo(() => {
    if (!content || currentLanguage === 'en') return [];
    
    const texts: string[] = [];
    
    const extractTexts = (obj: any, prefix = '') => {
      if (typeof obj === 'string' && obj.trim()) {
        texts.push(obj);
      } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        Object.entries(obj).forEach(([key, value]) => {
          extractTexts(value, prefix ? `${prefix}.${key}` : key);
        });
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          extractTexts(item, `${prefix}[${index}]`);
        });
      }
    };

    extractTexts(content);
    return texts;
  }, [content, currentLanguage]);

  const { translations, isLoading, error } = useBatchTranslation(textsToTranslate, {
    context,
    enabled: textsToTranslate.length > 0
  });

  // Reconstruct the content with translations
  const translatedContent = useMemo(() => {
    if (!content) return null;
    if (currentLanguage === 'en') return content;
    if (!translations || translations.length === 0) return content;

    let translationIndex = 0;
    
    const translateObject = (obj: any): any => {
      if (typeof obj === 'string' && obj.trim()) {
        return translations[translationIndex++] || obj;
      } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        const translated: any = {};
        Object.entries(obj).forEach(([key, value]) => {
          translated[key] = translateObject(value);
        });
        return translated;
      } else if (Array.isArray(obj)) {
        return obj.map(item => translateObject(item));
      }
      return obj;
    };

    return translateObject(content) as T;
  }, [content, translations, currentLanguage]);

  return {
    translatedContent,
    isLoading,
    error
  };
}

/**
 * Specialized hook for translating hero slide content
 */
export function useTranslatedHeroSlide(slide: any) {
  return useTranslatedCMSContent(slide, 'hero-slide');
}

/**
 * Specialized hook for translating feature content
 */
export function useTranslatedFeatures(features: any[]) {
  const { currentLanguage } = useLanguage();
  
  const allFeatureTexts = useMemo(() => {
    if (currentLanguage === 'en') return [];
    
    return features.flatMap(feature => [
      feature.title || '',
      feature.description || ''
    ].filter(text => text.trim()));
  }, [features, currentLanguage]);

  const { translations, isLoading, error } = useBatchTranslation(allFeatureTexts, {
    context: 'features'
  });

  const translatedFeatures = useMemo(() => {
    if (currentLanguage === 'en') return features;
    if (!translations || translations.length === 0) return features;

    let translationIndex = 0;
    return features.map(feature => ({
      ...feature,
      title: feature.title ? (translations[translationIndex++] || feature.title) : feature.title,
      description: feature.description ? (translations[translationIndex++] || feature.description) : feature.description
    }));
  }, [features, translations, currentLanguage]);

  return {
    translatedFeatures,
    isLoading,
    error
  };
}