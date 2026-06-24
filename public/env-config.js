
// This script loads environment variables at runtime before the main application code
(function() {
  console.log('[env-config] Initializing runtime environment configuration');
  
  // Initialize window.env if it doesn't exist
  window.env = window.env || {};
  
  // Token version - bump this whenever PREVIEW_CREDENTIALS token is rotated
  // to invalidate any stale token cached in user localStorage.
  const CREDENTIALS_VERSION = '2026-06-24-c';

  // Hardcoded credentials for preview environments - these are known to work
  const PREVIEW_CREDENTIALS = {
    VITE_CONTENTFUL_SPACE_ID: "al01e4yh2wq4",
    VITE_CONTENTFUL_DELIVERY_TOKEN: "Z5nFDjjfz2n_GN2JLDBVVH6rr96986sa2TaFCL5zkcI",
    VITE_CONTENTFUL_ENVIRONMENT_ID: "master"
  };

  // One-time cache-bust: drop stale cached credentials from prior token versions.
  // Clears every key any part of the app uses to cache contentful tokens.
  try {
    if (localStorage.getItem('contentful_credentials_version') !== CREDENTIALS_VERSION) {
      localStorage.removeItem('contentful_credentials');
      localStorage.removeItem('vending-cms-env-variables');
      // Also purge any Service Worker caches that may hold stale contentful responses
      if (typeof caches !== 'undefined' && caches.keys) {
        caches.keys().then(function(names) {
          names.forEach(function(n) { caches.delete(n); });
        }).catch(function() {});
      }
      localStorage.setItem('contentful_credentials_version', CREDENTIALS_VERSION);
      console.log('[env-config] Cleared stale cached contentful credentials');
    }
  } catch (e) {
    console.warn('[env-config] Failed to check credentials version:', e);
  }

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
    // ALWAYS apply the current hardcoded credentials first — these are the
    // authoritative token for both preview and production. This guarantees a
    // rotated token reaches every environment as soon as the new build ships.
    window.env.VITE_CONTENTFUL_SPACE_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
    window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
    window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
    window.env.spaceId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
    window.env.deliveryToken = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
    window.env.environmentId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
    window._contentfulInitializedSource = 'hardcoded-current';
    try {
      localStorage.setItem('contentful_credentials', JSON.stringify({
        VITE_CONTENTFUL_SPACE_ID: PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID,
        VITE_CONTENTFUL_DELIVERY_TOKEN: PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN,
        VITE_CONTENTFUL_ENVIRONMENT_ID: PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID
      }));
    } catch (e) {}
    return true;

    // (legacy fallback paths kept below for reference; unreachable)
    // eslint-disable-next-line no-unreachable
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
