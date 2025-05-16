/**
 * This file manages environment variables and configuration for Contentful
 */

/**
 * Waits for environment variables to be fully loaded before proceeding
 * This ensures we don't try to create a client with missing credentials
 */
export function waitForEnvironmentVariables(): Promise<void> {
  // Store the promise to prevent multiple executions
  let envLoadedPromise: Promise<void> | null = null;

  // If we already have the promise cached, return it
  if (envLoadedPromise) {
    return envLoadedPromise;
  }

  // Create a new promise that resolves when environment variables are loaded
  envLoadedPromise = new Promise((resolve) => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      // In SSR/Node environment, resolve immediately
      resolve();
      return;
    }

    // Check if the event has already been fired (window.env exists and has values)
    if (window.env && 
        window.env.VITE_CONTENTFUL_SPACE_ID && 
        window.env.VITE_CONTENTFUL_DELIVERY_TOKEN) {
      console.log('[waitForEnvironmentVariables] Environment variables already loaded');
      resolve();
      return;
    }

    // Otherwise, wait for the env-config-loaded event
    console.log('[waitForEnvironmentVariables] Waiting for env-config-loaded event');
    window.addEventListener('env-config-loaded', () => {
      console.log('[waitForEnvironmentVariables] env-config-loaded event received');
      resolve();
    }, { once: true });

    // Set a timeout as a fallback in case the event never fires
    setTimeout(() => {
      console.log('[waitForEnvironmentVariables] Timeout reached, proceeding anyway');
      resolve();
    }, 2000); // 2 second timeout
  });

  return envLoadedPromise;
}

/**
 * Get Contentful Space ID from environment variables or window.env
 */
export function getContentfulSpaceId(): string {
  // Try to get from import.meta.env first
  const envSpaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  
  // Then try window.env if available
  const windowEnvSpaceId = typeof window !== 'undefined' && 
    window.env && 
    window.env.VITE_CONTENTFUL_SPACE_ID;
  
  // Return the first available value
  return envSpaceId || windowEnvSpaceId || "";
}

/**
 * Get Contentful Access Token from environment variables or window.env
 */
export function getContentfulAccessToken(): string {
  // Try to get from import.meta.env first
  const envToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  
  // Then try window.env if available
  const windowEnvToken = typeof window !== 'undefined' && 
    window.env && 
    window.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  
  // Return the first available value
  return envToken || windowEnvToken || "";
}

/**
 * Get Contentful Environment ID from environment variables or window.env
 */
export function getContentfulEnvironment(): string {
  // Try to get from import.meta.env first
  const envEnvironment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT;
  
  // Then try window.env if available
  const windowEnvEnvironment = typeof window !== 'undefined' && 
    window.env && 
    (window.env.VITE_CONTENTFUL_ENVIRONMENT || window.env.VITE_CONTENTFUL_ENVIRONMENT_ID);
  
  // Default to 'master' if not specified
  return envEnvironment || windowEnvEnvironment || "master";
}

/**
 * Check if Contentful is properly configured
 */
export function isContentfulConfigured(): boolean {
  const spaceId = getContentfulSpaceId();
  const accessToken = getContentfulAccessToken();
  
  console.log('[isContentfulConfigured] Configuration check:', {
    hasSpaceId: !!spaceId,
    hasAccessToken: !!accessToken
  });
  
  return !!spaceId && !!accessToken;
}
