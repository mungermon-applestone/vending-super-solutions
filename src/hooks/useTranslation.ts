import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslationOptions {
  context?: string;
  enabled?: boolean;
  fallbackToOriginal?: boolean;
}

interface TranslationResult {
  translated: string;
  isLoading: boolean;
  error: Error | null;
  isFromCache: boolean;
}

/**
 * Hook for translating individual text strings
 */
export function useTranslation(
  text: string, 
  options: TranslationOptions = {}
): TranslationResult {
  const { currentLanguage } = useLanguage();
  const { context, enabled = true, fallbackToOriginal = true } = options;

  const queryKey = ['translation', text, currentLanguage, context];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      // Return original text if target language is English
      if (currentLanguage === 'en') {
        return { translated: text, cached: false };
      }

      console.log(`[useTranslation] Translating: "${text.substring(0, 50)}..." to ${currentLanguage}`);

      const { data: result, error } = await supabase.functions.invoke('translate-content', {
        body: {
          texts: [text],
          targetLanguage: currentLanguage,
          context
        }
      });

      if (error) {
        console.error('[useTranslation] Translation error:', error);
        throw new Error(error.message);
      }

      if (!result?.translations?.[0]) {
        throw new Error('No translation received');
      }

      const translation = result.translations[0];
      return {
        translated: translation.translated,
        cached: translation.cached
      };
    },
    enabled: enabled && !!text && text.trim().length > 0,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: (failureCount, error) => {
      // Only retry network errors, not translation errors
      return failureCount < 2 && !error.message.includes('Translation error');
    }
  });

  return {
    translated: data?.translated || (fallbackToOriginal ? text : ''),
    isLoading,
    error: error as Error | null,
    isFromCache: data?.cached || false
  };
}

/**
 * Hook for translating multiple text strings at once (batch translation)
 */
export function useBatchTranslation(
  texts: string[],
  options: TranslationOptions = {}
): {
  translations: string[];
  isLoading: boolean;
  error: Error | null;
  cachedCount: number;
} {
  const { currentLanguage } = useLanguage();
  const { context, enabled = true, fallbackToOriginal = true } = options;

  const queryKey = ['batchTranslation', texts, currentLanguage, context];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      // Return original texts if target language is English
      if (currentLanguage === 'en') {
        return {
          translations: texts.map(text => ({ original: text, translated: text, cached: false })),
          cachedCount: 0
        };
      }

      console.log(`[useBatchTranslation] Translating ${texts.length} texts to ${currentLanguage}`);

      const { data: result, error } = await supabase.functions.invoke('translate-content', {
        body: {
          texts,
          targetLanguage: currentLanguage,
          context
        }
      });

      if (error) {
        console.error('[useBatchTranslation] Translation error:', error);
        throw new Error(error.message);
      }

      if (!result?.translations) {
        throw new Error('No translations received');
      }

      return {
        translations: result.translations,
        cachedCount: result.cachedCount || 0
      };
    },
    enabled: enabled && texts.length > 0 && texts.some(t => t.trim().length > 0),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2
  });

  return {
    translations: data?.translations?.map((t: any) => t.translated) || 
                 (fallbackToOriginal ? texts : []),
    isLoading,
    error: error as Error | null,
    cachedCount: data?.cachedCount || 0
  };
}

/**
 * Utility hook for getting translation status and statistics
 */
export function useTranslationStats() {
  const [stats, setStats] = useState({
    totalTranslations: 0,
    cachedTranslations: 0,
    failedTranslations: 0
  });

  // This could be expanded to track translation usage across the app
  return stats;
}