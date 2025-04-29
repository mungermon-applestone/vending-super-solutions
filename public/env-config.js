
// This script loads environment variables at runtime before the main application code
(function() {
  console.log('[env-config] Initializing runtime environment configuration');
  
  // Initialize window.env if it doesn't exist
  window.env = window.env || {};

  // Define a function to fetch runtime config
  async function fetchRuntimeConfig() {
    try {
      console.log('[env-config] Attempting to fetch runtime configuration from /api/runtime-config');
      // Attempt to fetch runtime configuration from the server
      const response = await fetch('/api/runtime-config');
      
      if (!response.ok) {
        console.error('[env-config] Failed to fetch runtime config:', response.status, response.statusText);
        throw new Error(`Failed to fetch runtime config: ${response.status} ${response.statusText}`);
      }
      
      const configText = await response.text();
      console.log('[env-config] Received runtime config response:', configText.substring(0, 50) + '...');
      
      let config;
      try {
        config = JSON.parse(configText);
      } catch (parseError) {
        console.error('[env-config] Failed to parse runtime config JSON:', parseError);
        console.error('[env-config] Raw content:', configText);
        throw new Error('Failed to parse runtime config JSON');
      }
      
      console.log('[env-config] Parsed runtime config:', {
        hasSpaceId: !!config.VITE_CONTENTFUL_SPACE_ID,
        hasDeliveryToken: !!config.VITE_CONTENTFUL_DELIVERY_TOKEN,
        hasEnvironmentId: !!config.VITE_CONTENTFUL_ENVIRONMENT_ID
      });
      
      // Check if the values are placeholders (containing {{)
      const isSpaceIdPlaceholder = config.VITE_CONTENTFUL_SPACE_ID && config.VITE_CONTENTFUL_SPACE_ID.includes('{{');
      const isTokenPlaceholder = config.VITE_CONTENTFUL_DELIVERY_TOKEN && config.VITE_CONTENTFUL_DELIVERY_TOKEN.includes('{{');
      const isEnvIdPlaceholder = config.VITE_CONTENTFUL_ENVIRONMENT_ID && config.VITE_CONTENTFUL_ENVIRONMENT_ID.includes('{{');
      
      // Only use values that are not placeholders
      if (!isSpaceIdPlaceholder && config.VITE_CONTENTFUL_SPACE_ID) {
        window.env.VITE_CONTENTFUL_SPACE_ID = config.VITE_CONTENTFUL_SPACE_ID;
      }
      
      if (!isTokenPlaceholder && config.VITE_CONTENTFUL_DELIVERY_TOKEN) {
        window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = config.VITE_CONTENTFUL_DELIVERY_TOKEN;
      }
      
      if (!isEnvIdPlaceholder && config.VITE_CONTENTFUL_ENVIRONMENT_ID) {
        window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = config.VITE_CONTENTFUL_ENVIRONMENT_ID;
      }
      
      console.log('[env-config] Loaded runtime config:', {
        hasSpaceId: !!window.env.VITE_CONTENTFUL_SPACE_ID,
        hasDeliveryToken: !!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
        hasEnvironmentId: !!window.env.VITE_CONTENTFUL_ENVIRONMENT_ID,
        spaceIdValue: window.env.VITE_CONTENTFUL_SPACE_ID
      });
      
      // Dispatch an event to notify the app that config is ready
      if (!isSpaceIdPlaceholder || !isTokenPlaceholder || !isEnvIdPlaceholder) {
        window.dispatchEvent(new Event('env-config-loaded'));
        return true;
      }
      
      console.warn('[env-config] Runtime config contains placeholder values, skipping');
      return false;
    } catch (error) {
      console.error('[env-config] Could not load runtime config:', error);
      return false;
    }
  }
  
  // Function to detect if we're in a preview environment
  function isPreviewEnvironment() {
    // Check if the current hostname contains preview domains
    const hostname = window.location.hostname;
    return (
      hostname.includes('preview') || 
      hostname.includes('staging') || 
      hostname.includes('lovable.app') ||
      hostname.includes('vercel.app') ||
      hostname.includes('netlify.app')
    );
  }
  
  // Load environment variables from localStorage if available
  function loadFromLocalStorage() {
    try {
      const storedVars = localStorage.getItem('vending-cms-env-variables');
      if (storedVars) {
        const parsedVars = JSON.parse(storedVars);
        
        // Set values with proper prefixes for compatibility
        window.env.VITE_CONTENTFUL_SPACE_ID = parsedVars.spaceId;
        window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = parsedVars.deliveryToken;
        window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = parsedVars.environmentId || 'master';
        
        // Set legacy keys for backward compatibility
        window.env.spaceId = parsedVars.spaceId;
        window.env.deliveryToken = parsedVars.deliveryToken;
        window.env.environmentId = parsedVars.environmentId || 'master';
        
        console.log('[env-config] Loaded variables from localStorage:', {
          spaceId: window.env.VITE_CONTENTFUL_SPACE_ID,
          hasToken: !!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
          environmentId: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID
        });
        return true;
      }
    } catch (error) {
      console.error('[env-config] Failed to load from localStorage:', error);
    }
    return false;
  }
  
  // Initialize the environment
  async function init() {
    // For preview environments, try fetch runtime config first
    if (isPreviewEnvironment()) {
      console.log('[env-config] Preview environment detected, attempting to fetch runtime config');
      const configLoaded = await fetchRuntimeConfig();
      
      // If runtime config successful, set a flag
      if (configLoaded) {
        window._contentfulInitialized = true;
        console.log('[env-config] Runtime config loaded successfully for preview environment');
        return;
      }
      
      // If runtime config failed, fall back to localStorage
      console.warn('[env-config] No runtime config found for preview environment, falling back to localStorage');
      const localStorageLoaded = loadFromLocalStorage();
      
      if (localStorageLoaded) {
        window._contentfulInitialized = 'localStorage';
      } else {
        window._contentfulInitialized = false;
      }
    } else {
      // For development, prefer localStorage
      const localStorageLoaded = loadFromLocalStorage();
      
      // If no localStorage, try fetch runtime config as fallback
      if (!localStorageLoaded) {
        console.log('[env-config] No localStorage variables, trying runtime config');
        const configLoaded = await fetchRuntimeConfig();
        if (configLoaded) {
          window._contentfulInitialized = 'runtime-config';
        } else {
          window._contentfulInitialized = false;
        }
      } else {
        window._contentfulInitialized = 'localStorage';
      }
    }
    
    // Log the final status of environment variables
    console.log('[env-config] Environment configuration initialized:', {
      hasSpaceId: !!window.env.VITE_CONTENTFUL_SPACE_ID,
      hasDeliveryToken: !!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
      environmentId: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
      source: window._contentfulInitialized
    });
  }
  
  // Start initialization
  init();
})();
