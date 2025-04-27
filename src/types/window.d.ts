
interface Window {
  env?: {
    VITE_CONTENTFUL_SPACE_ID?: string;
    VITE_CONTENTFUL_DELIVERY_TOKEN?: string;
    VITE_CONTENTFUL_ENVIRONMENT_ID?: string;
    // Direct access properties for backward compatibility
    spaceId?: string; 
    deliveryToken?: string;
    environmentId?: string;
    [key: string]: string | undefined;
  };
}
