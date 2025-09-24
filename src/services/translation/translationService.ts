import { supabase } from '@/integrations/supabase/client';

export interface TranslationRequest {
  texts: string[];
  targetLanguage: string;
  context?: string;
}

export interface TranslationResponse {
  translations: Array<{
    original: string;
    translated: string;
    cached: boolean;
  }>;
  totalTexts: number;
  cachedCount: number;
  newTranslations: number;
}

/**
 * Core translation service for handling AI-powered translations
 */
export class TranslationService {
  private static instance: TranslationService;
  private translateQueue: Map<string, Promise<TranslationResponse>> = new Map();
  
  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Translate multiple texts with deduplication and caching
   */
  async translateBatch(request: TranslationRequest): Promise<TranslationResponse> {
    const { texts, targetLanguage, context } = request;
    
    // Return original texts if target is English
    if (targetLanguage === 'en') {
      return {
        translations: texts.map(text => ({
          original: text,
          translated: text,
          cached: false
        })),
        totalTexts: texts.length,
        cachedCount: 0,
        newTranslations: 0
      };
    }

    // Create a unique key for this translation request
    const requestKey = this.createRequestKey(texts, targetLanguage, context);
    
    // Check if this exact request is already in progress
    if (this.translateQueue.has(requestKey)) {
      console.log('[TranslationService] Reusing pending translation request');
      return this.translateQueue.get(requestKey)!;
    }

    // Create new translation promise
    const translationPromise = this.executeTranslation(request);
    
    // Store in queue to prevent duplicate requests
    this.translateQueue.set(requestKey, translationPromise);
    
    try {
      const result = await translationPromise;
      return result;
    } finally {
      // Remove from queue when complete
      this.translateQueue.delete(requestKey);
    }
  }

  /**
   * Translate a single text string
   */
  async translateSingle(
    text: string, 
    targetLanguage: string, 
    context?: string
  ): Promise<string> {
    const result = await this.translateBatch({
      texts: [text],
      targetLanguage,
      context
    });
    
    return result.translations[0]?.translated || text;
  }

  /**
   * Get cached translations from local database
   */
  async getCachedTranslations(
    texts: string[], 
    targetLanguage: string
  ): Promise<Map<string, string>> {
    const { data, error } = await supabase
      .from('translations')
      .select('source_text, translated_text')
      .in('source_text', texts)
      .eq('target_language', targetLanguage);

    if (error) {
      console.error('[TranslationService] Error fetching cached translations:', error);
      return new Map();
    }

    const cacheMap = new Map<string, string>();
    data?.forEach(item => {
      cacheMap.set(item.source_text, item.translated_text);
    });

    return cacheMap;
  }

  /**
   * Clear old translations from cache (cleanup utility)
   */
  async clearOldTranslations(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await supabase
      .from('translations')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (error) {
      console.error('[TranslationService] Error clearing old translations:', error);
    } else {
      console.log(`[TranslationService] Cleared translations older than ${daysOld} days`);
    }
  }

  private async executeTranslation(request: TranslationRequest): Promise<TranslationResponse> {
    console.log(`[TranslationService] Executing translation for ${request.texts.length} texts`);
    
    const { data, error } = await supabase.functions.invoke('translate-content', {
      body: request
    });

    if (error) {
      console.error('[TranslationService] Translation function error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }

    if (!data?.translations) {
      throw new Error('Invalid translation response received');
    }

    console.log(`[TranslationService] Translation completed: ${data.cachedCount} cached, ${data.newTranslations} new`);
    
    return data;
  }

  private createRequestKey(texts: string[], targetLanguage: string, context?: string): string {
    const textHash = texts.sort().join('|');
    return `${targetLanguage}:${context || 'default'}:${btoa(textHash).substring(0, 20)}`;
  }
}

// Export singleton instance
export const translationService = TranslationService.getInstance();