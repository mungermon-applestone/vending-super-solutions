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
      
      // Auto-open the widget after a short delay to ensure it's fully loaded
      const autoOpenTimer = setTimeout(() => {
        const widgetTrigger = 
          document.querySelector('#help-button') ||
          document.querySelector('#button-container #help-button') ||
          document.querySelector('#atlwdg-trigger') ||
          document.querySelector('[id^="atlwdg-"]') ||
          document.querySelector('.atlwdg-trigger');
        
        if (widgetTrigger) {
          (widgetTrigger as HTMLElement).click();
          console.log('JSM widget auto-opened');
        } else {
          console.warn('JSM widget trigger not found');
        }
      }, 1000);
      
      return () => {
        clearTimeout(autoOpenTimer);
        document.body.classList.remove('show-jsm-widget');
      };
    } else {
      document.body.classList.remove('show-jsm-widget');
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default JsmWidgetController;
