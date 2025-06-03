
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when the route changes.
 * This ensures that navigation between pages always starts at the top,
 * preventing the appearance of "anchor link" behavior where users
 * see the bottom of pages first.
 * 
 * CRITICAL: This component must be included in the main layout to
 * prevent regression where footer/navigation links appear to navigate
 * to the bottom of destination pages.
 */
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;
