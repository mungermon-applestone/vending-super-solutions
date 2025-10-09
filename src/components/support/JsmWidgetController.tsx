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
      
      // Use the official JSM API to open the widget
      const openWidget = () => {
        if ((window as any).JiraWidget?.show) {
          (window as any).JiraWidget.show();
          console.log('JSM widget opened via API');
        }
      };
      
      // Try to open immediately if API is ready
      if ((window as any).JiraWidget?.show) {
        openWidget();
      } else {
        // Listen for the ready event
        const onReady = () => {
          openWidget();
          window.removeEventListener('jsm:ready', onReady);
        };
        window.addEventListener('jsm:ready', onReady);
        
        // Fallback polling with timeout
        const startTime = Date.now();
        const pollInterval = setInterval(() => {
          if ((window as any).JiraWidget?.show) {
            clearInterval(pollInterval);
            openWidget();
          }
          if (Date.now() - startTime > 5000) {
            clearInterval(pollInterval);
            console.warn('JSM widget API not available after 5s');
          }
        }, 250);
        
        return () => {
          window.removeEventListener('jsm:ready', onReady);
          clearInterval(pollInterval);
          document.body.classList.remove('show-jsm-widget');
        };
      }
      
      return () => {
        document.body.classList.remove('show-jsm-widget');
      };
    } else {
      document.body.classList.remove('show-jsm-widget');
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default JsmWidgetController;
