import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { translationService } from '@/services/translation/translationService';

interface TranslationStatusOptions {
  /** Sample texts to check for translation coverage */
  sampleTexts?: string[];
  /** Context for the translation check */
  context?: string;
}

interface TranslationStatus {
  /** Whether translations are loading */
  isLoading: boolean;
  /** Whether the current language has translation support */
  hasTranslationSupport: boolean;
  /** Whether we should show translation UI elements */
  showTranslationUI: boolean;
  /** Current language code */
  currentLanguage: string;
  /** Whether translations are likely cached and ready */
  translationsReady: boolean;
  /** Sample translation coverage percentage (0-100) */
  coveragePercentage?: number;
}

/**
 * Hook to check translation status and readiness
 * 
 * This hook helps determine:
 * - Whether translations are available for the current language
 * - Whether translation UI should be shown
 * - Whether translations are cached and ready for fast rendering
 */
export const useTranslationStatus = (options: TranslationStatusOptions = {}): TranslationStatus => {
  const { currentLanguage, availableLanguages } = useLanguage();
  const { sampleTexts = [], context = 'general' } = options;

  // Check if current language has translation support
  const hasTranslationSupport = availableLanguages.some(lang => lang.code === currentLanguage);
  const showTranslationUI = currentLanguage !== 'en' && hasTranslationSupport;

  // Check translation readiness with sample texts if provided
  const { data: sampleTranslationData, isLoading } = useQuery({
    queryKey: ['translation-status', currentLanguage, context, sampleTexts],
    queryFn: async () => {
      if (!showTranslationUI || sampleTexts.length === 0) {
        return { ready: true, coverage: 100 };
      }

      try {
        // Check if sample texts are already cached
        const result = await translationService.translateBatch({
          texts: sampleTexts,
          targetLanguage: currentLanguage,
          context
        });

        const coveragePercentage = Math.round((result.cachedCount / result.totalTexts) * 100);
        
        return {
          ready: result.cachedCount > 0,
          coverage: coveragePercentage
        };
      } catch (error) {
        console.warn('Translation status check failed:', error);
        return { ready: false, coverage: 0 };
      }
    },
    enabled: showTranslationUI && sampleTexts.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });

  return {
    isLoading,
    hasTranslationSupport,
    showTranslationUI,
    currentLanguage,
    translationsReady: sampleTranslationData?.ready ?? true,
    coveragePercentage: sampleTranslationData?.coverage
  };
};

/**
 * Hook to preload translations for critical content
 */
export const usePreloadTranslations = (texts: string[], context: string = 'preload') => {
  const { currentLanguage } = useLanguage();
  const { showTranslationUI } = useTranslationStatus();

  return useQuery({
    queryKey: ['preload-translations', currentLanguage, context, texts],
    queryFn: async () => {
      if (!showTranslationUI) return { preloaded: true };

      try {
        await translationService.translateBatch({
          texts,
          targetLanguage: currentLanguage,
          context
        });
        return { preloaded: true };
      } catch (error) {
        console.warn('Translation preload failed:', error);
        return { preloaded: false };
      }
    },
    enabled: showTranslationUI && texts.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};