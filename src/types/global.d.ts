
// Extend window interface to include our custom properties
interface Window {
  env?: {
    VITE_CONTENTFUL_SPACE_ID?: string;
    VITE_CONTENTFUL_DELIVERY_TOKEN?: string;
    VITE_CONTENTFUL_ENVIRONMENT_ID?: string;
    spaceId?: string;
    deliveryToken?: string;
    environmentId?: string;
    [key: string]: string | undefined;
  };
  _contentfulInitialized?: boolean | string;
  _contentfulInitializedSource?: string;
}
