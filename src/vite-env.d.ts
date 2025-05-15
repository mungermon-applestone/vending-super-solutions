
/// <reference types="vite/client" />

// Add explicit imports for Contentful types to help TypeScript resolution
import type { Entry, EntryCollection, Asset } from 'contentful';

// Extend Window interface to allow for environment variable access
interface ImportMetaEnv {
  readonly VITE_CONTENTFUL_SPACE_ID: string;
  readonly VITE_CONTENTFUL_DELIVERY_TOKEN: string;
  readonly VITE_CONTENTFUL_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
