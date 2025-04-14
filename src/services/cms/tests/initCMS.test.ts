
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initCMS } from '../cmsInit';
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';

describe('initCMS', () => {
  // Store original environment
  const originalEnv = { ...import.meta.env };
  
  // Mock console.log to track calls
  const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  afterEach(() => {
    // Restore original environment after each test
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true
    });
  });
  
  it('should default to Supabase when no environment variables are set', () => {
    // Set empty environment
    Object.defineProperty(import.meta, 'env', {
      value: {},
      writable: true
    });
    
    // Run initialization
    initCMS();
    
    // Check result
    const config = getCMSProviderConfig();
    expect(config.type).toBe(ContentProviderType.SUPABASE);
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Using default Supabase CMS provider'));
  });
  
  it('should configure Strapi when environment variables are set', () => {
    // Set Strapi environment
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_CMS_PROVIDER: 'strapi',
        VITE_STRAPI_API_URL: 'http://test-strapi.example.com',
        VITE_STRAPI_API_KEY: 'test-api-key'
      },
      writable: true
    });
    
    // Run initialization
    initCMS();
    
    // Check result
    const config = getCMSProviderConfig();
    expect(config.type).toBe(ContentProviderType.STRAPI);
    expect(config.apiUrl).toBe('http://test-strapi.example.com');
    expect(config.apiKey).toBe('test-api-key');
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Using Strapi CMS provider'));
  });
  
  it('should ignore invalid CMS provider types', () => {
    // Set invalid provider
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_CMS_PROVIDER: 'invalid-provider'
      },
      writable: true
    });
    
    // Run initialization
    initCMS();
    
    // Should default to Supabase
    const config = getCMSProviderConfig();
    expect(config.type).toBe(ContentProviderType.SUPABASE);
  });
});
