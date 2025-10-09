import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * JsmWidgetController
 * 
 * Controls the visibility of the Jira Service Management widget based on the current route.
 * The widget script is loaded globally in index.html, but this component adds/removes
 * a CSS class to show/hide it only on specific routes.
 */
const JsmWidgetController = () => {
  const location = useLocation();

  useEffect(() => {
    // Show widget only on the support ticket page
    if (location.pathname === '/support-ticket') {
      document.body.classList.add('show-jsm-widget');
    } else {
      document.body.classList.remove('show-jsm-widget');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('show-jsm-widget');
    };
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default JsmWidgetController;
