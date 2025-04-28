
import { useEffect, useState } from 'react';
import { CONTENTFUL_CONFIG } from '@/config/cms';

export function useContentfulConfig() {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateConfig = () => {
      console.log('[useContentfulConfig] Starting configuration validation');
      console.log('[useContentfulConfig] Current config:', {
        hasSpaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
        spaceIdLength: CONTENTFUL_CONFIG.SPACE_ID?.length || 0,
        hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
        tokenLength: CONTENTFUL_CONFIG.DELIVERY_TOKEN?.length || 0,
        environmentId: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
      });

      if (!CONTENTFUL_CONFIG.SPACE_ID || CONTENTFUL_CONFIG.SPACE_ID.trim() === '') {
        console.error('[useContentfulConfig] Missing or empty Space ID');
        setError('Missing or invalid Contentful Space ID');
        setIsValid(false);
        return;
      }

      if (!CONTENTFUL_CONFIG.DELIVERY_TOKEN || CONTENTFUL_CONFIG.DELIVERY_TOKEN.trim() === '') {
        console.error('[useContentfulConfig] Missing or empty Delivery Token');
        setError('Missing or invalid Contentful Delivery Token');
        setIsValid(false);
        return;
      }

      setIsValid(true);
      setError(null);
      
      console.log('[useContentfulConfig] Configuration validated successfully');
    };

    validateConfig();
  }, []);

  return { 
    isValid, 
    error,
    config: isValid ? CONTENTFUL_CONFIG : null 
  };
}
