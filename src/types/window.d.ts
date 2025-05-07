
interface Window {
  env?: {
    VITE_CONTENTFUL_SPACE_ID?: string;
    VITE_CONTENTFUL_DELIVERY_TOKEN?: string;
    VITE_CONTENTFUL_ENVIRONMENT_ID?: string;
    // Legacy keys for backward compatibility
    spaceId?: string;
    deliveryToken?: string;
    environmentId?: string;
    [key: string]: string | undefined;
  };
  _contentfulInitialized?: boolean | string;
  _contentfulInitializedSource?: string;
  _swRegistration?: ServiceWorkerRegistration;
  _refreshContentfulAfterConfig?: () => Promise<void>;
  _runtimeConfig?: Record<string, string>;
  _runtimeConfigLoaded?: boolean;
}

