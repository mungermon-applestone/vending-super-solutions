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

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute per IP
const MAX_TEXTS_PER_REQUEST = 50; // Maximum 50 texts per request
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 300000);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req);
    
    // Check rate limit
    const { allowed, remaining } = checkRateLimit(clientIP);
    
    if (!allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        translations: [] 
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        },
      });
    }

    const { texts, targetLanguage, context }: TranslationRequest = await req.json();
    
    // Validate request
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request: texts array is required',
        translations: [] 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (texts.length > MAX_TEXTS_PER_REQUEST) {
      return new Response(JSON.stringify({ 
        error: `Too many texts in request. Maximum ${MAX_TEXTS_PER_REQUEST} allowed.`,
        translations: [] 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      throw new Error('Invalid texts array provided');
    }

    if (!targetLanguage) {
      return new Response(JSON.stringify({ 
        error: 'Target language is required',
        translations: [] 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[${clientIP}] Translating ${texts.length} texts to ${targetLanguage} (Rate limit remaining: ${remaining})`);

    // Initialize Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(JSON.stringify({ 
        error: 'Service configuration error',
        translations: [] 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: TranslationResult[] = [];
    const textsToTranslate: string[] = [];
    
    // Check cache for existing translations
    try {
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
    } catch (cacheError) {
      console.error('Cache lookup error:', cacheError);
      // If cache fails, translate all texts
      textsToTranslate.push(...texts);
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
        try {
          const { error: insertError } = await supabase
            .from('translations')
            .insert(cacheInserts);

          if (insertError) {
            console.error('Error caching translations:', insertError);
            // Don't throw error - translation still succeeded
          } else {
            console.log(`Cached ${cacheInserts.length} new translations`);
          }
        } catch (cacheError) {
          console.error('Cache insert exception:', cacheError);
          // Don't throw error - translation still succeeded
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
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': remaining.toString()
      },
    });

  } catch (error) {
    console.error('Error in translate-content function:', error);
    
    // Return generic error message to client, log details server-side
    return new Response(JSON.stringify({ 
      error: 'Translation service temporarily unavailable',
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