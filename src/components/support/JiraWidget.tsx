import React, { useEffect, useState } from 'react';

/**
 * JiraWidget Component Props
 * 
 * @property {string} widgetKey - The widget key from your JSM embed code (data-key attribute)
 *   Example: "7958a0ed-fe48-4e2b-b9f5-32eb7f1451c9"
 * 
 * @property {string} baseUrl - The base URL for the JSM widget (data-base-url attribute)
 *   Example: "https://jsd-widget.atlassian.com"
 * 
 * @property {string} scriptSrc - The script source URL from your JSM embed code
 *   Example: "https://jsd-widget.atlassian.com/assets/embed.js"
 *   
 *   To find your JSM embed code:
 *   1. Go to Jira Service Management
 *   2. Navigate to Project settings > Portals > Select your portal
 *   3. Go to the "Embed widget" section
 *   4. Copy the script tag provided
 * 
 * @property {string} className - Optional CSS classes
 */
interface JiraWidgetProps {
  widgetKey: string;
  baseUrl: string;
  scriptSrc: string;
  className?: string;
}

/**
 * JiraWidget Component
 * 
 * Loads the Jira Service Management embeddable widget script.
 * The widget will automatically create a floating help button in the bottom-right corner.
 * 
 * This is the official JSM embeddable widget for JSM projects.
 */
const JiraWidget: React.FC<JiraWidgetProps> = ({
  widgetKey,
  baseUrl,
  scriptSrc,
  className = '',
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptError, setIsScriptError] = useState(false);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    
    if (existingScript) {
      setIsScriptLoaded(true);
      return;
    }

    // Create and inject the JSM embeddable widget script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc;
    
    // Set required JSM widget data attributes
    script.setAttribute('data-jsd-embedded', '');
    script.setAttribute('data-key', widgetKey);
    script.setAttribute('data-base-url', baseUrl);
    
    script.onload = () => {
      setIsScriptLoaded(true);
      console.log('JSM Widget loaded successfully');
    };
    
    script.onerror = () => {
      setIsScriptError(true);
      console.error('Failed to load JSM Widget script');
    };

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [scriptSrc, widgetKey, baseUrl]);

  if (isScriptError) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-sm text-destructive mb-2">
          Unable to load support widget. Please check your connection.
        </p>
        <p className="text-xs text-muted-foreground">
          Contact your administrator if this problem persists.
        </p>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {!isScriptLoaded && !isScriptError && (
        <p className="text-sm text-muted-foreground">
          Loading support widget...
        </p>
      )}
      
      {isScriptLoaded && (
        <p className="text-sm text-muted-foreground">
          A help button will appear in the bottom-right corner of your screen
        </p>
      )}
    </div>
  );
};

export default JiraWidget;
