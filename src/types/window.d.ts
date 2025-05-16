
interface Window {
  env?: {
    VITE_CONTENTFUL_SPACE_ID?: string;
    VITE_CONTENTFUL_DELIVERY_TOKEN?: string;
    VITE_CONTENTFUL_ENVIRONMENT_ID?: string;
    VITE_CONTENTFUL_ENVIRONMENT?: string;
    SENDGRID_API_KEY?: string;
    EMAIL_TO?: string;
    EMAIL_FROM?: string;
    spaceId?: string;
    deliveryToken?: string;
    environmentId?: string;
    [key: string]: string | undefined;
  };
  _contentfulInitialized?: boolean;
  _contentfulInitializedSource?: string;
  _refreshContentfulAfterConfig?: () => Promise<void>;
}
