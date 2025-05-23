
// This script loads environment variables at runtime before the main application code
(function() {
  console.log('[env-config] Initializing runtime environment configuration');
  
  // Initialize window.env if it doesn't exist
  window.env = window.env || {};
  
  // Hardcoded credentials for preview environments - these are known to work
  const PREVIEW_CREDENTIALS = {
    VITE_CONTENTFUL_SPACE_ID: "al01e4yh2wq4",
    VITE_CONTENTFUL_DELIVERY_TOKEN: "fxpQth03vfdKzI4VNT_fYg8cD5BwoTiGaa6INIyYync",
    VITE_CONTENTFUL_ENVIRONMENT_ID: "master"
  };

  // Enhanced detection function for preview environments
  function isPreviewEnvironment() {
    if (typeof window === 'undefined') return false;
    
    const hostname = window.location.hostname;
    
    // List of production domains (adjust these according to your actual production domains)
    const productionDomains = [
      'applestonesolutions.com',
      'www.applestonesolutions.com'
      // Add other production domains here if needed
    ];
    
    // Check if current hostname is a production domain
    for (const domain of productionDomains) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return false; // Not a preview environment
      }
    }
    
    // If not explicitly production, treat as preview
    return true;
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
  
  // Load runtime config from API if available
  async function loadRuntimeConfig() {
    try {
      const response = await fetch('/api/runtime-config');
      if (response.ok) {
        const config = await response.json();
        console.log('[env-config] Loaded runtime config from API');
        return config;
      }
    } catch (e) {
      console.warn('[env-config] Failed to load runtime config from API:', e);
    }
    return null;
  }
  
  // Apply credentials based on environment with enhanced fallback logic
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
      
      // Also set legacy keys for backward compatibility
      window.env.spaceId = storedCreds.VITE_CONTENTFUL_SPACE_ID;
      window.env.deliveryToken = storedCreds.VITE_CONTENTFUL_DELIVERY_TOKEN;
      window.env.environmentId = storedCreds.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
      
      // Check for email related credentials
      if (storedCreds.SENDGRID_API_KEY) {
        window.env.SENDGRID_API_KEY = storedCreds.SENDGRID_API_KEY;
      }
      if (storedCreds.EMAIL_TO) {
        window.env.EMAIL_TO = storedCreds.EMAIL_TO;
      }
      if (storedCreds.EMAIL_FROM) {
        window.env.EMAIL_FROM = storedCreds.EMAIL_FROM;
      }
      
      window._contentfulInitializedSource = 'local-storage';
      return true;
    }
    
    // Third, use preview credentials for preview environments or as fallback
    if (isPreviewEnvironment() || !window.env.VITE_CONTENTFUL_SPACE_ID) {
      console.log('[env-config] Applying preview/fallback credentials');
      
      window.env.VITE_CONTENTFUL_SPACE_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
      window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
      window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
      
      // Also set legacy keys for backward compatibility
      window.env.spaceId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
      window.env.deliveryToken = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
      window.env.environmentId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
      
      window._contentfulInitializedSource = 'preview-hardcoded';
      return true;
    }
    
    console.warn('[env-config] No credentials found');
    return false;
  }
  
  // Initialize email configuration with default values
  function initializeEmailConfig() {
    // Set default email configuration if not already set
    window.env.SENDGRID_API_KEY = window.env.SENDGRID_API_KEY || '';
    window.env.EMAIL_TO = window.env.EMAIL_TO || 'munger@applestonesolutions.com';
    window.env.EMAIL_FROM = window.env.EMAIL_FROM || 'noreply@applestonesolutions.com';
    
    // In development, we can use testing keys
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('.lovable.app')) {
      console.log('[env-config] Development environment detected for email');
      // These are intentionally left empty for development - emails will be logged to console
    }
  }
  
  // Apply credentials and trigger event
  if (applyCredentials()) {
    console.log('[env-config] Credentials applied successfully');
    
    // Initialize email configuration
    initializeEmailConfig();
    
    // Save credentials to localStorage for future use if they weren't loaded from there
    if (window._contentfulInitializedSource !== 'local-storage') {
      try {
        localStorage.setItem('contentful_credentials', JSON.stringify({
          VITE_CONTENTFUL_SPACE_ID: window.env.VITE_CONTENTFUL_SPACE_ID,
          VITE_CONTENTFUL_DELIVERY_TOKEN: window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
          VITE_CONTENTFUL_ENVIRONMENT_ID: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'
        }));
      } catch (e) {
        console.warn('[env-config] Failed to save credentials to localStorage:', e);
      }
    }
  }
  
  // Always trigger event to notify app that environment initialization is complete
  window.dispatchEvent(new Event('env-config-loaded'));
})();
