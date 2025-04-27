
interface Window {
  env?: {
    VITE_CONTENTFUL_SPACE_ID?: string;
    VITE_CONTENTFUL_DELIVERY_TOKEN?: string;
    VITE_CONTENTFUL_ENVIRONMENT_ID?: string;
    [key: string]: string | undefined;
  };
}
