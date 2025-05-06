
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
  
  // Apply credentials immediately for preview or localhost environments
  if (isPreviewEnvironment()) {
    console.log('[env-config] Preview/development environment detected, applying preview credentials');
    
    window.env.VITE_CONTENTFUL_SPACE_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
    window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
    window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
    
    // Also set legacy keys for backward compatibility
    window.env.spaceId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
    window.env.deliveryToken = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
    window.env.environmentId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
    
    window._contentfulInitializedSource = 'preview-hardcoded';
    
    console.log('[env-config] Preview credentials applied');
    
    // Trigger event to notify app that environment variables are loaded
    window.dispatchEvent(new Event('env-config-loaded'));
  }
})();
