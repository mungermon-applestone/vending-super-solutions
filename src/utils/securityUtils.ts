
/**
 * Security utilities to help protect the application
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generate a nonce for CSP headers
 */
export const generateNonce = (): string => {
  // Generate a random string that can be used as a nonce
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Check if the application is running in a secure context
 */
export const isSecureContext = (): boolean => {
  return typeof window !== 'undefined' && window.isSecureContext;
};

/**
 * Validate URLs to prevent open redirect vulnerabilities
 */
export const validateUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Only allow URLs that are relative or from our domain
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  
  try {
    const urlObj = new URL(url);
    const allowedDomains = [
      'applestonesolutions.com',
      'lovable.app',
      'lovable.dev'
    ];
    
    return allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
  } catch (e) {
    return false;
  }
};

/**
 * Create a safe redirect function that prevents open redirects
 */
export const safeRedirect = (url: string): void => {
  if (validateUrl(url)) {
    window.location.href = url;
  } else {
    // Fallback to a safe page
    window.location.href = '/';
  }
};

/**
 * Check for common security vulnerabilities in the environment
 */
export const performSecurityCheck = (): {passed: boolean; issues: string[]} => {
  const issues: string[] = [];
  
  // Check if running in secure context
  if (!isSecureContext()) {
    issues.push('Application is not running in a secure context (HTTPS)');
  }
  
  // Check for proper Content-Security-Policy
  if (typeof document !== 'undefined') {
    const cspHeader = document.querySelector('meta[http-equiv="Content-Security-Policy"]') ||
                     document.querySelector('meta[http-equiv="Content-Security-Policy-Report-Only"]');
    if (!cspHeader) {
      issues.push('No Content Security Policy header found');
    }
  }
  
  return {
    passed: issues.length === 0,
    issues
  };
};

/**
 * Helper to check origin of messages for postMessage security
 */
export const isValidMessageOrigin = (origin: string): boolean => {
  const validOrigins = [
    'https://applestonesolutions.com',
    'https://www.applestonesolutions.com'
  ];
  
  return validOrigins.includes(origin);
};

// Setup secure message handler for cross-origin communication
export const setupSecureMessageListener = (callback: (data: any) => void): void => {
  window.addEventListener('message', (event) => {
    // Validate message origin
    if (isValidMessageOrigin(event.origin)) {
      callback(event.data);
    } else {
      console.warn(`Rejected message from unauthorized origin: ${event.origin}`);
    }
  });
};
