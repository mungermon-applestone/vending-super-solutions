
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
  
  it('should use Contentful when no environment variables are set', () => {
    // Set empty environment
    Object.defineProperty(import.meta, 'env', {
      value: {},
      writable: true
    });
    
    // Run initialization
    initCMS();
    
    // Check result
    const config = getCMSProviderConfig();
    expect(config.type).toBe(ContentProviderType.CONTENTFUL);
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Initializing CMS configuration'));
  });
  
  it('should configure Contentful when environment variables are set', () => {
    // Set Contentful environment
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_CONTENTFUL_SPACE_ID: 'test-space-id',
        VITE_CONTENTFUL_DELIVERY_TOKEN: 'test-delivery-token' 
      },
      writable: true
    });
    
    // Run initialization
    initCMS();
    
    // Check result
    const config = getCMSProviderConfig();
    expect(config.type).toBe(ContentProviderType.CONTENTFUL);
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Initializing CMS configuration'));
  });
  
  it('should handle missing environment variables', () => {
    // Set invalid provider
    Object.defineProperty(import.meta, 'env', {
      value: {},
      writable: true
    });
    
    // Run initialization
    initCMS();
    
    // Should default to Contentful
    const config = getCMSProviderConfig();
    expect(config.type).toBe(ContentProviderType.CONTENTFUL);
  });
});
