import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  texts: string[];
  targetLanguage: string;
  context?: string;
}

interface TranslationResult {
  original: string;
  translated: string;
  cached: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLanguage, context }: TranslationRequest = await req.json();
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      throw new Error('Invalid texts array provided');
    }

    if (!targetLanguage) {
      throw new Error('Target language is required');
    }

    console.log(`Translating ${texts.length} texts to ${targetLanguage}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: TranslationResult[] = [];
    const textsToTranslate: string[] = [];
    
    // Check cache for existing translations
    for (const text of texts) {
      const { data: cachedTranslation } = await supabase
        .from('translations')
        .select('translated_text')
        .eq('source_text', text)
        .eq('target_language', targetLanguage)
        .maybeSingle();

      if (cachedTranslation) {
        console.log(`Found cached translation for: ${text.substring(0, 50)}...`);
        results.push({
          original: text,
          translated: cachedTranslation.translated_text,
          cached: true
        });
      } else {
        textsToTranslate.push(text);
      }
    }

    // Translate uncached texts using Google Translate
    if (textsToTranslate.length > 0) {
      console.log(`Translating ${textsToTranslate.length} uncached texts with Google Translate`);
      
      const googleApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
      if (!googleApiKey) {
        throw new Error('Google Translate API key not configured');
      }

      // Map target language to Google Translate language codes if needed
      const languageMap: { [key: string]: string } = {
        'es': 'es',
        'fr': 'fr',
        'de': 'de',
        'it': 'it',
        'pt': 'pt',
        'ru': 'ru',
        'ja': 'ja',
        'ko': 'ko',
        'zh': 'zh-CN',
        'ar': 'ar',
        'hi': 'hi',
        'nl': 'nl',
        'sv': 'sv',
        'no': 'no',
        'da': 'da',
        'fi': 'fi',
        'pl': 'pl',
        'tr': 'tr',
        'th': 'th',
        'vi': 'vi'
      };

      const googleLangCode = languageMap[targetLanguage] || targetLanguage;
      const translations: string[] = [];

      // Translate each text individually for better accuracy
      for (const text of textsToTranslate) {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: googleLangCode,
            format: 'text'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Google Translate API error:', errorData);
          throw new Error(`Google Translate API error: ${response.statusText}`);
        }

        const translateResponse = await response.json();
        const translatedText = translateResponse.data?.translations?.[0]?.translatedText || text;
        translations.push(translatedText);
      }

      console.log(`Received ${translations.length} translations from Google Translate`);

      // Store new translations in cache and add to results
      const cacheInserts = [];
      for (let i = 0; i < textsToTranslate.length; i++) {
        const originalText = textsToTranslate[i];
        const translatedText = translations[i] || originalText; // Fallback to original if translation missing

        results.push({
          original: originalText,
          translated: translatedText,
          cached: false
        });

        cacheInserts.push({
          source_text: originalText,
          source_language: 'en',
          target_language: targetLanguage,
          translated_text: translatedText,
          context: context || null
        });
      }

      // Batch insert into cache
      if (cacheInserts.length > 0) {
        const { error: insertError } = await supabase
          .from('translations')
          .insert(cacheInserts);

        if (insertError) {
          console.error('Error caching translations:', insertError);
          // Don't throw error - translation still succeeded
        } else {
          console.log(`Cached ${cacheInserts.length} new translations`);
        }
      }
    }

    // Sort results to match original order
    const sortedResults = texts.map(originalText => 
      results.find(r => r.original === originalText) || {
        original: originalText,
        translated: originalText, // Fallback to original text
        cached: false
      }
    );

    console.log(`Translation complete. Returned ${sortedResults.length} results.`);

    return new Response(JSON.stringify({ 
      translations: sortedResults,
      totalTexts: texts.length,
      cachedCount: results.filter(r => r.cached).length,
      newTranslations: results.filter(r => !r.cached).length
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Error in translate-content function:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Translation service error',
      translations: [] 
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});