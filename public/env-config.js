
// This script loads environment variables at runtime before the main application code
(function() {
  console.log('[env-config] Initializing runtime environment configuration');
  
  // Initialize window.env if it doesn't exist
  window.env = window.env || {};
  
  // Function to fetch runtime config
  async function fetchRuntimeConfig() {
    try {
      console.log('[env-config] Attempting to fetch runtime configuration...');
      const response = await fetch('/api/runtime-config');
      if (response.ok) {
        const config = await response.json();
        console.log('[env-config] Successfully loaded runtime configuration', {
          hasContentfulConfig: !!(config.VITE_CONTENTFUL_SPACE_ID && config.VITE_CONTENTFUL_DELIVERY_TOKEN),
          hasEmailConfig: !!(config.SENDGRID_API_KEY && config.EMAIL_TO && config.EMAIL_FROM)
        });
        return config;
      } else {
        console.warn('[env-config] Failed to fetch runtime config:', response.status, response.statusText);
      }
    } catch (error) {
      console.warn('[env-config] Failed to fetch runtime config:', error);
    }
    return null;
  }
  
  // Hardcoded credentials for preview environments - these are known to work
  const PREVIEW_CREDENTIALS = {
    VITE_CONTENTFUL_SPACE_ID: "al01e4yh2wq4",
    VITE_CONTENTFUL_DELIVERY_TOKEN: "fxpQth03vfdKzI4VNT_fYg8cD5BwoTiGaa6INIyYync",
    VITE_CONTENTFUL_ENVIRONMENT_ID: "master",
    SENDGRID_API_KEY: "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",
    EMAIL_TO: "hello@applestonesolutions.com",
    EMAIL_FROM: "support@applestonesolutions.com"
  };

  // Simple function to detect if we're in a preview environment
  function isPreviewEnvironment() {
    if (typeof window === 'undefined') return false;
    
    const hostname = window.location.hostname;
    return (
      hostname.includes('preview') || 
      hostname.includes('staging') || 
      hostname.includes('lovable.app') ||
      hostname.includes('vercel.app') ||
      hostname.includes('netlify.app') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    );
  }
  
  // Try to load credentials from localStorage if available
  function loadCredentialsFromStorage() {
    try {
      const storedCredentials = localStorage.getItem('contentful_credentials');
      if (storedCredentials) {
        const credentials = JSON.parse(storedCredentials);
        if (credentials.VITE_CONTENTFUL_SPACE_ID && credentials.VITE_CONTENTFUL_DELIVERY_TOKEN) {
          console.log('[env-config] Loaded credentials from localStorage');
          return credentials;
        }
      }
    } catch (e) {
      console.warn('[env-config] Failed to load credentials from localStorage:', e);
    }
    return null;
  }
  
  // Apply credentials based on environment
  function applyCredentials() {
    // First, check for production environment variables (set in deployment)
    if (window.env.VITE_CONTENTFUL_SPACE_ID && window.env.VITE_CONTENTFUL_DELIVERY_TOKEN) {
      console.log('[env-config] Using production environment variables');
      window._contentfulInitializedSource = 'production-env';
      return true;
    }
    
    // Second, try localStorage for any saved credentials
    const storedCreds = loadCredentialsFromStorage();
    if (storedCreds) {
      window.env.VITE_CONTENTFUL_SPACE_ID = storedCreds.VITE_CONTENTFUL_SPACE_ID;
      window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = storedCreds.VITE_CONTENTFUL_DELIVERY_TOKEN;
      window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = storedCreds.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
      window.env.EMAIL_TO = storedCreds.EMAIL_TO || 'hello@applestonesolutions.com';
      window.env.EMAIL_FROM = storedCreds.EMAIL_FROM || 'support@applestonesolutions.com';
      window.env.SENDGRID_API_KEY = storedCreds.SENDGRID_API_KEY;
      
      // Also set legacy keys for backward compatibility
      window.env.spaceId = storedCreds.VITE_CONTENTFUL_SPACE_ID;
      window.env.deliveryToken = storedCreds.VITE_CONTENTFUL_DELIVERY_TOKEN;
      window.env.environmentId = storedCreds.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
      
      window._contentfulInitializedSource = 'local-storage';
      return true;
    }
    
    // Third, try fetching runtime config
    fetchRuntimeConfig().then(config => {
      if (config) {
        console.log('[env-config] Loaded configuration from runtime-config');
        
        // Apply the configuration
        Object.keys(config).forEach(key => {
          window.env[key] = config[key];
        });
        
        // Set legacy keys for backward compatibility
        window.env.spaceId = config.VITE_CONTENTFUL_SPACE_ID;
        window.env.deliveryToken = config.VITE_CONTENTFUL_DELIVERY_TOKEN;
        window.env.environmentId = config.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
        
        // Explicitly log email configuration
        console.log('[env-config] Email configuration from runtime-config:', {
          SENDGRID_API_KEY: config.SENDGRID_API_KEY ? 'Present (hidden)' : 'Missing',
          EMAIL_TO: config.EMAIL_TO || 'Missing',
          EMAIL_FROM: config.EMAIL_FROM || 'Missing'
        });
        
        // Save to localStorage for future use
        try {
          localStorage.setItem('contentful_credentials', JSON.stringify(config));
        } catch (e) {
          console.warn('[env-config] Failed to save credentials to localStorage:', e);
        }
        
        window._contentfulInitializedSource = 'runtime-config';
        window.dispatchEvent(new Event('env-config-loaded'));
      }
    });
    
    // Fourth, use preview credentials for preview environments
    if (isPreviewEnvironment()) {
      console.log('[env-config] Preview/development environment detected, applying preview credentials');
      
      window.env.VITE_CONTENTFUL_SPACE_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
      window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
      window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
      window.env.EMAIL_TO = PREVIEW_CREDENTIALS.EMAIL_TO;
      window.env.EMAIL_FROM = PREVIEW_CREDENTIALS.EMAIL_FROM;
      window.env.SENDGRID_API_KEY = PREVIEW_CREDENTIALS.SENDGRID_API_KEY;
      
      // Also set legacy keys for backward compatibility
      window.env.spaceId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
      window.env.deliveryToken = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
      window.env.environmentId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
      
      console.log('[env-config] Email configuration from preview credentials:', {
        SENDGRID_API_KEY: PREVIEW_CREDENTIALS.SENDGRID_API_KEY ? 'Present (hidden)' : 'Missing',
        EMAIL_TO: PREVIEW_CREDENTIALS.EMAIL_TO || 'Missing',
        EMAIL_FROM: PREVIEW_CREDENTIALS.EMAIL_FROM || 'Missing'
      });
      
      window._contentfulInitializedSource = 'preview-hardcoded';
      return true;
    }
    
    console.warn('[env-config] No credentials found');
    return false;
  }
  
  // Apply credentials and trigger event
  if (applyCredentials()) {
    console.log('[env-config] Credentials applied successfully');
    
    // Save credentials to localStorage for future use if they weren't loaded from there
    if (window._contentfulInitializedSource !== 'local-storage') {
      try {
        localStorage.setItem('contentful_credentials', JSON.stringify({
          VITE_CONTENTFUL_SPACE_ID: window.env.VITE_CONTENTFUL_SPACE_ID,
          VITE_CONTENTFUL_DELIVERY_TOKEN: window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
          VITE_CONTENTFUL_ENVIRONMENT_ID: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
          EMAIL_TO: window.env.EMAIL_TO,
          EMAIL_FROM: window.env.EMAIL_FROM,
          SENDGRID_API_KEY: window.env.SENDGRID_API_KEY
        }));
      } catch (e) {
        console.warn('[env-config] Failed to save credentials to localStorage:', e);
      }
    }
  }
  
  // Always trigger event to notify app that environment initialization is complete
  window.dispatchEvent(new Event('env-config-loaded'));
})();
