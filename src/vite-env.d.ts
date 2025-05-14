
/// <reference types="vite/client" />

// Add explicit imports for Contentful types to help TypeScript resolution
import type { Entry, EntryCollection, Asset } from 'contentful';

// Add window interface extensions for runtime configuration
interface Window {
  // Runtime configuration objects
  env?: Record<string, any>;
  _runtimeConfig?: Record<string, any>;
  _runtimeConfigLoaded?: boolean;
  __RUNTIME_CONFIG__?: Record<string, string>;
  _devMockData?: Record<string, any>;
  
  // Contentful-specific runtime properties
  _contentfulInitialized?: boolean;
  _contentfulInitializedSource?: string;
  _refreshContentfulAfterConfig?: () => Promise<void>;
}
