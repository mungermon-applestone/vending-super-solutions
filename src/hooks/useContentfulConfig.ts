
import { useEffect, useState } from 'react';
import { CONTENTFUL_CONFIG } from '@/config/cms';

export function useContentfulConfig() {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateConfig = () => {
      console.log('[useContentfulConfig] Validating configuration');
      
      if (!CONTENTFUL_CONFIG.SPACE_ID) {
        setError('Missing Contentful Space ID');
        setIsValid(false);
        return;
      }

      if (!CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
        setError('Missing Contentful Delivery Token');
        setIsValid(false);
        return;
      }

      setIsValid(true);
      setError(null);
      
      console.log('[useContentfulConfig] Configuration is valid:', {
        hasSpaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
        hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
        environmentId: CONTENTFUL_CONFIG.ENVIRONMENT_ID
      });
    };

    validateConfig();
  }, []);

  return { isValid, error };
}
