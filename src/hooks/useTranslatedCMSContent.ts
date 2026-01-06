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
    
    // Fields that should not be translated (URLs, IDs, technical fields)
    const skipFields = new Set([
      'url', 'src', 'href', 'id', 'slug', 'sys', 'contentType',
      'createdAt', 'updatedAt', 'publishedAt', 'revision',
      'imageUrl', 'thumbnailUrl', 'videoUrl', 'audioUrl',
      'link', 'linkUrl', 'buttonUrl', 'ctaUrl'
    ]);
    
    // Check if a string looks like a URL
    const isUrl = (str: string): boolean => {
      return /^https?:\/\//.test(str) || 
             /^\/\//.test(str) || 
             str.includes('ctfassets.net') ||
             str.includes('images.unsplash.com');
    };
    
    // Check if a field key suggests it contains technical data
    const isTechnicalField = (key: string): boolean => {
      const lowerKey = key.toLowerCase();
      return skipFields.has(lowerKey) || 
             lowerKey.includes('url') || 
             lowerKey.includes('id') ||
             lowerKey.endsWith('_id') ||
             lowerKey.startsWith('sys');
    };
    
    const extractTexts = (obj: any, prefix = '', parentKey = '') => {
      if (typeof obj === 'string' && obj.trim()) {
        // Skip if this looks like a URL or technical field
        if (!isUrl(obj) && !isTechnicalField(parentKey)) {
          texts.push(obj);
        }
      } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        Object.entries(obj).forEach(([key, value]) => {
          extractTexts(value, prefix ? `${prefix}.${key}` : key, key);
        });
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          extractTexts(item, `${prefix}[${index}]`, parentKey);
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
    
    // Same field checking logic as extraction
    const skipFields = new Set([
      'url', 'src', 'href', 'id', 'slug', 'sys', 'contentType',
      'createdAt', 'updatedAt', 'publishedAt', 'revision',
      'imageUrl', 'thumbnailUrl', 'videoUrl', 'audioUrl',
      'link', 'linkUrl', 'buttonUrl', 'ctaUrl'
    ]);
    
    const isUrl = (str: string): boolean => {
      return /^https?:\/\//.test(str) || 
             /^\/\//.test(str) || 
             str.includes('ctfassets.net') ||
             str.includes('images.unsplash.com');
    };
    
    const isTechnicalField = (key: string): boolean => {
      const lowerKey = key.toLowerCase();
      return skipFields.has(lowerKey) || 
             lowerKey.includes('url') || 
             lowerKey.includes('id') ||
             lowerKey.endsWith('_id') ||
             lowerKey.startsWith('sys');
    };
    
    const translateObject = (obj: any, parentKey = ''): any => {
      if (typeof obj === 'string' && obj.trim()) {
        // Skip translation if this looks like a URL or technical field
        if (isUrl(obj) || isTechnicalField(parentKey)) {
          return obj; // Return original value
        }
        return translations[translationIndex++] || obj;
      } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        const translated: any = {};
        Object.entries(obj).forEach(([key, value]) => {
          translated[key] = translateObject(value, key);
        });
        return translated;
      } else if (Array.isArray(obj)) {
        return obj.map(item => translateObject(item, parentKey));
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
 * Handles featureItems array and badgeText with proper translation contexts
 */
export function useTranslatedHeroSlide(slide: any) {
  const { currentLanguage } = useLanguage();
  
  // Extract texts to translate: featureItems + badgeText + other text fields
  const textsToTranslate = useMemo(() => {
    if (!slide || currentLanguage === 'en') return [];
    
    const texts: string[] = [];
    
    // Add feature items
    if (slide.featureItems?.length) {
      texts.push(...slide.featureItems.filter((item: string) => item?.trim()));
    }
    
    // Add badge text
    if (slide.badgeText?.trim()) {
      texts.push(slide.badgeText);
    }
    
    // Add title and subtitle
    if (slide.title?.trim()) texts.push(slide.title);
    if (slide.subtitle?.trim()) texts.push(slide.subtitle);
    if (slide.primaryButtonText?.trim()) texts.push(slide.primaryButtonText);
    if (slide.secondaryButtonText?.trim()) texts.push(slide.secondaryButtonText);
    
    return texts;
  }, [slide, currentLanguage]);

  const { translations, isLoading, error } = useBatchTranslation(textsToTranslate, {
    context: 'hero-slide',
    enabled: textsToTranslate.length > 0
  });

  // Reconstruct the slide with translations
  const translatedContent = useMemo(() => {
    if (!slide) return null;
    if (currentLanguage === 'en') return slide;
    if (!translations || translations.length === 0) return slide;

    let index = 0;
    const translated = { ...slide };

    // Translate feature items
    if (slide.featureItems?.length) {
      translated.featureItems = slide.featureItems.map((item: string) => {
        if (item?.trim()) {
          return translations[index++] || item;
        }
        return item;
      });
    }

    // Translate badge text
    if (slide.badgeText?.trim()) {
      translated.badgeText = translations[index++] || slide.badgeText;
    }

    // Translate other fields
    if (slide.title?.trim()) {
      translated.title = translations[index++] || slide.title;
    }
    if (slide.subtitle?.trim()) {
      translated.subtitle = translations[index++] || slide.subtitle;
    }
    if (slide.primaryButtonText?.trim()) {
      translated.primaryButtonText = translations[index++] || slide.primaryButtonText;
    }
    if (slide.secondaryButtonText?.trim()) {
      translated.secondaryButtonText = translations[index++] || slide.secondaryButtonText;
    }

    return translated;
  }, [slide, translations, currentLanguage]);

  return {
    translatedContent,
    isLoading,
    error
  };
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