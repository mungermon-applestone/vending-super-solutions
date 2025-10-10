import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * JsmWidgetController
 * 
 * Controls the JSM widget opening based on route or user action.
 * Uses the official Atlassian JSM API (window.JiraWidget) to open the widget.
 * The floating button remains hidden via CSS; we only use the overlay.
 */
const JsmWidgetController = () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldOpen = 
      location.pathname === '/support-ticket' ||
      searchParams.get('open') === '1' ||
      sessionStorage.getItem('jsm_open_on_load') === '1';

    if (!shouldOpen) return;

    const openWidget = () => {
      const api = (window as any).JiraWidget;
      if (api?.show) {
        api.show();
        sessionStorage.removeItem('jsm_open_on_load');
        console.log('JSM widget opened via API');
      }
    };

    // Try immediately if API is ready
    if ((window as any).JiraWidget?.show) {
      openWidget();
    } else {
      // Listen for ready event
      const onReady = () => {
        openWidget();
        window.removeEventListener('jsm:ready', onReady);
      };
      window.addEventListener('jsm:ready', onReady);

      // Fallback polling (5s max)
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
      };
    }
  }, [location.pathname, location.search]);

  return null;
};

export default JsmWidgetController;
