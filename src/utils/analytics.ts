import { isTrackingAllowed } from './privacy';

/**
 * Google Analytics 4 integration utility
 * 
 * This utility provides a typed interface to work with Google Analytics 4.
 * It offers methods for page views, events, and custom user properties.
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - Do not remove the window.gtag type declaration
 * - Maintain consistent console logging patterns for debugging
 * - Always check for gtag existence before calling methods
 * - Preserve the error handling in each method
 * - Always check isTrackingAllowed() to respect Do Not Track preferences
 * 
 * Form Tracking Events:
 * - form_view: When a form becomes visible
 * - form_submit: When a form is submitted
 * - form_submit_success: When a form is successfully submitted
 * - form_submit_error: When a form submission fails
 * - cta_clicked: When a CTA button is clicked
 * - cta_form_toggled: When a CTA toggles to show a form
 */

// Declare gtag as a global function
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Track a page view in Google Analytics
 * 
 * @param path - The current page path
 * @param title - The page title
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isTrackingAllowed()) {
    return;
  }

  if (!window.gtag) {
    console.warn('[Analytics] Google Analytics not initialized');
    return;
  }

  // Remove any query parameters for cleaner page paths
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Send a page view to Google Analytics
  window.gtag('event', 'page_view', {
    page_path: cleanPath,
    page_title: title || document.title,
    page_location: window.location.href,
  });
  
  console.log('[Analytics] Page view tracked:', cleanPath);
};

/**
 * Track a custom event in Google Analytics
 * 
 * @param eventName - The name of the event
 * @param params - Additional parameters to include
 */
export const trackEvent = (eventName: string, params?: Record<string, any>): void => {
  if (!isTrackingAllowed()) {
    return;
  }

  if (!window.gtag) {
    console.warn('[Analytics] Google Analytics not initialized');
    return;
  }

  window.gtag('event', eventName, params);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Event tracked: ${eventName}`, params);
  }
};

/**
 * Track form views (when a form becomes visible)
 * 
 * @param formType - The type of form (contact, newsletter, etc.)
 * @param formLocation - Where the form appears (page path or component)
 */
export const trackFormView = (formType: string, formLocation?: string): void => {
  trackEvent('form_view', {
    form_type: formType,
    form_location: formLocation || window.location.pathname
  });
};

/**
 * Track form submissions (when a user attempts to submit)
 * 
 * @param formType - The type of form (contact, newsletter, etc.)
 * @param formLocation - Where the form appears (page path or component)
 */
export const trackFormSubmit = (formType: string, formLocation?: string): void => {
  trackEvent('form_submit', {
    form_type: formType,
    form_location: formLocation || window.location.pathname,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track successful form submissions
 * 
 * @param formType - The type of form (contact, newsletter, etc.)
 * @param formLocation - Where the form appears (page path or component)
 */
export const trackFormSuccess = (formType: string, formLocation?: string): void => {
  trackEvent('form_submit_success', {
    form_type: formType,
    form_location: formLocation || window.location.pathname,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track form submission errors
 * 
 * @param formType - The type of form (contact, newsletter, etc.)
 * @param errorMessage - Description of the error
 * @param formLocation - Where the form appears (page path or component)
 */
export const trackFormError = (formType: string, errorMessage: string, formLocation?: string): void => {
  trackEvent('form_submit_error', {
    form_type: formType,
    error_message: errorMessage,
    form_location: formLocation || window.location.pathname,
    timestamp: new Date().toISOString()
  });
};

/**
 * Set user properties for more detailed analytics
 * 
 * @param properties - User properties to set
 */
export const setUserProperties = (properties: Record<string, any>): void => {
  if (!isTrackingAllowed()) {
    return;
  }

  if (!window.gtag) {
    console.warn('[Analytics] Google Analytics not initialized');
    return;
  }

  window.gtag('set', 'user_properties', properties);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] User properties set:', properties);
  }
};

/**
 * Initialize additional configuration for analytics
 */
export const initializeAnalytics = (): void => {
  // This function could be extended with additional configuration
  // such as setting default parameters, enabling advertising features, etc.
  
  // Log initialization in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Analytics initialized with GA4 ID: G-9CQNGZV49F');
  }
};

/**
 * Track timings for performance monitoring
 * 
 * @param category - The category of the timing
 * @param variable - The variable being measured
 * @param time - The time in milliseconds
 */
export const trackTiming = (category: string, variable: string, time: number): void => {
  trackEvent('timing_complete', {
    name: variable,
    value: time,
    event_category: category
  });
};

/**
 * Enhanced tracking of web vitals
 * This integrates with the existing web-vitals monitoring
 * 
 * @param metric - Web vital metric object
 */
export const trackWebVital = (metric: { name: string; id: string; value: number }): void => {
  trackEvent('web_vitals', {
    metric_name: metric.name,
    metric_id: metric.id,
    metric_value: Math.round(metric.value * 100) / 100,
  });
};
