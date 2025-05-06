
// This script loads environment variables at runtime before the main application code
(function() {
  console.log('[env-config] Initializing runtime environment configuration');
  
  // Initialize window.env if it doesn't exist
  window.env = window.env || {};
  
  // Hardcoded credentials for preview environments - these are known to work
  // These will be used immediately in preview environments for reliability
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
      hostname.includes('localhost') ||
      hostname.includes('127.0.0.1')
    );
  }
  
  // Apply credentials immediately for preview or localhost environments
  if (isPreviewEnvironment()) {
    console.log('[env-config] Preview/development environment detected, applying preview credentials immediately');
    
    window.env.VITE_CONTENTFUL_SPACE_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
    window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
    window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
    
    // Also set legacy keys for backward compatibility
    window.env.spaceId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_SPACE_ID;
    window.env.deliveryToken = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_DELIVERY_TOKEN;
    window.env.environmentId = PREVIEW_CREDENTIALS.VITE_CONTENTFUL_ENVIRONMENT_ID;
    
    window._contentfulInitializedSource = 'preview-hardcoded';
    
    console.log('[env-config] Preview credentials applied:', {
      spaceId: window.env.VITE_CONTENTFUL_SPACE_ID,
      tokenStatus: window.env.VITE_CONTENTFUL_DELIVERY_TOKEN ? 'Set' : 'Not set',
      envId: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID,
      source: window._contentfulInitializedSource
    });
    
    // Trigger event to notify app that environment variables are loaded
    window.dispatchEvent(new Event('env-config-loaded'));
  }
  // For non-preview environments (production), try to load from localStorage
  else {
    console.log('[env-config] Non-preview environment detected');
    
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
        
        window._contentfulInitializedSource = 'localStorage';
        
        console.log('[env-config] Loaded variables from localStorage:', {
          spaceId: window.env.VITE_CONTENTFUL_SPACE_ID,
          tokenStatus: window.env.VITE_CONTENTFUL_DELIVERY_TOKEN ? 'Set' : 'Not set',
          envId: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID
        });
        
        // Trigger event to notify app that environment variables are loaded
        window.dispatchEvent(new Event('env-config-loaded'));
      }
    } catch (error) {
      console.error('[env-config] Failed to load from localStorage:', error);
    }
    
    // Also attempt to fetch runtime config as a backup for non-preview environments
    // but don't make preview environments dependent on this
    (async function() {
      try {
        console.log('[env-config] Attempting to fetch runtime configuration as backup');
        const response = await fetch('/api/runtime-config');
        
        if (response.ok) {
          const config = await response.json();
          
          // Only use if we don't already have values
          if (!window.env.VITE_CONTENTFUL_SPACE_ID && config.VITE_CONTENTFUL_SPACE_ID) {
            window.env.VITE_CONTENTFUL_SPACE_ID = config.VITE_CONTENTFUL_SPACE_ID;
            window._contentfulInitializedSource = 'runtime-config';
          }
          
          if (!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN && config.VITE_CONTENTFUL_DELIVERY_TOKEN) {
            window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = config.VITE_CONTENTFUL_DELIVERY_TOKEN;
            window._contentfulInitializedSource = 'runtime-config';
          }
          
          if (!window.env.VITE_CONTENTFUL_ENVIRONMENT_ID && config.VITE_CONTENTFUL_ENVIRONMENT_ID) {
            window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = config.VITE_CONTENTFUL_ENVIRONMENT_ID;
          }
          
          console.log('[env-config] Runtime config loaded as backup');
          window.dispatchEvent(new Event('env-config-loaded'));
        }
      } catch (error) {
        console.error('[env-config] Failed to fetch runtime config:', error);
      }
    })();
  }
  
  // Final log of environment configuration status
  console.log('[env-config] Initial environment setup complete:', {
    hasSpaceId: !!window.env.VITE_CONTENTFUL_SPACE_ID,
    hasToken: !!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
    envId: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
    source: window._contentfulInitializedSource || 'none'
  });
})();
