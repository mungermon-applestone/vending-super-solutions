/**
 * Privacy utility for respecting user tracking preferences
 * 
 * This utility checks for Do Not Track (DNT) signals and provides
 * a centralized way to determine if tracking is allowed.
 */

/**
 * Check if the user has enabled Do Not Track in their browser
 * 
 * @returns true if DNT is enabled, false otherwise
 */
export const isDoNotTrackEnabled = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // Check all possible DNT signals across different browsers
  const dnt = 
    navigator.doNotTrack === '1' ||
    navigator.doNotTrack === 'yes' ||
    (window as any).doNotTrack === '1';
  
  return dnt;
};

/**
 * Determine if tracking is allowed based on user preferences
 * 
 * This function centralizes all privacy checks. Currently it only
 * checks DNT, but can be extended to include cookie consent, etc.
 * 
 * @returns true if tracking is allowed, false otherwise
 */
export const isTrackingAllowed = (): boolean => {
  // Respect Do Not Track preference
  if (isDoNotTrackEnabled()) {
    return false;
  }
  
  // Could also check for cookie consent here in the future
  return true;
};

// Log DNT status on load (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (isDoNotTrackEnabled()) {
    console.log('[Privacy] Do Not Track preference detected - analytics will be disabled');
  }
}
