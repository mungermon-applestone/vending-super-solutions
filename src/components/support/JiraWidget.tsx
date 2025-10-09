import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Headset } from 'lucide-react';

/**
 * JiraWidget Component Props
 * 
 * @property {string} collectorUrl - The Jira Issue Collector script URL
 *   Example: "https://applestonesolutions.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-k4bwq9/b/8/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=12345678"
 *   
 *   To find your collector URL:
 *   1. Go to Jira Service Management
 *   2. Navigate to Project settings > Issue collectors
 *   3. Create or edit a collector
 *   4. Copy the script URL from the embed code
 * 
 * @property {string} buttonText - Custom button text (default: 'Submit Support Ticket')
 * @property {string} className - Optional CSS classes
 * @property {Record<string, any>} fieldValues - Pre-populate form fields (optional)
 */
interface JiraWidgetProps {
  collectorUrl: string;
  buttonText?: string;
  className?: string;
  fieldValues?: Record<string, any>;
}

/**
 * JiraWidget Component
 * 
 * Loads the Jira Issue Collector script and provides a button to trigger it.
 * The collector will appear as an overlay/modal on the page when triggered.
 * 
 * This is the standard Jira Issue Collector implementation used by thousands of sites.
 */
const JiraWidget: React.FC<JiraWidgetProps> = ({
  collectorUrl,
  buttonText = 'Submit Support Ticket',
  className = '',
  fieldValues = {},
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptError, setIsScriptError] = useState(false);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${collectorUrl}"]`);
    
    if (existingScript) {
      setIsScriptLoaded(true);
      return;
    }

    // Configure the collector BEFORE loading the script
    // This tells Jira to use a custom trigger instead of auto-showing
    (window as any).ATL_JQ_PAGE_PROPS = {
      triggerFunction: function(showCollectorDialog: () => void) {
        // Store the trigger function globally so our button can call it
        (window as any).showJiraCollector = showCollectorDialog;
      },
      fieldValues: fieldValues,
    };

    // Create and inject the Jira collector script
    const script = document.createElement('script');
    script.src = collectorUrl;
    script.async = true;
    script.defer = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      setIsScriptLoaded(true);
      console.log('Jira Issue Collector loaded successfully');
    };
    
    script.onerror = () => {
      setIsScriptError(true);
      console.error('Failed to load Jira Issue Collector script');
    };

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as any).ATL_JQ_PAGE_PROPS;
      delete (window as any).showJiraCollector;
    };
  }, [collectorUrl, fieldValues]);

  const handleOpenCollector = () => {
    if ((window as any).showJiraCollector) {
      (window as any).showJiraCollector();
    } else {
      console.warn('Jira collector not ready yet');
    }
  };

  if (isScriptError) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-sm text-destructive mb-2">
          Unable to load support form. Please check the collector URL.
        </p>
        <p className="text-xs text-muted-foreground">
          Contact your administrator if this problem persists.
        </p>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <Button
        size="lg"
        onClick={handleOpenCollector}
        disabled={!isScriptLoaded}
        className="gap-2"
      >
        <Headset className="h-5 w-5" />
        {buttonText}
      </Button>
      
      {!isScriptLoaded && !isScriptError && (
        <p className="text-sm text-muted-foreground mt-4">
          Loading support form...
        </p>
      )}
      
      {isScriptLoaded && (
        <p className="text-sm text-muted-foreground mt-4">
          Click to open the support ticket form
        </p>
      )}
    </div>
  );
};

export default JiraWidget;
