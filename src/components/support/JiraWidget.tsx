import React, { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface JiraWidgetProps {
  className?: string;
}

/**
 * JiraWidget Component
 * 
 * Dynamically loads and embeds the Jira Service Desk widget
 * for customer support ticket submission.
 */
const JiraWidget: React.FC<JiraWidgetProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://jsd-widget.atlassian.com/assets/embed.js"]'
    );

    if (existingScript) {
      console.log('Jira widget script already loaded');
      setIsLoading(false);
      return;
    }

    console.log('Loading Jira Service Desk widget script...');

    // Create and load the Jira widget script
    const script = document.createElement('script');
    script.src = 'https://jsd-widget.atlassian.com/assets/embed.js';
    script.async = true;

    // Handle successful script load
    script.onload = () => {
      console.log('Jira widget script loaded successfully');
      setIsLoading(false);
      setHasError(false);
    };

    // Handle script load error
    script.onerror = () => {
      console.error('Failed to load Jira Service Desk widget');
      setIsLoading(false);
      setHasError(true);
    };

    // Append script to document
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Only remove if we added it
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  if (hasError) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Unable to Load Support Form
          </h3>
          <p className="text-muted-foreground">
            We're having trouble loading the support ticket form. Please try refreshing the page or contact us directly at support@applestonesolutions.com
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">
            Loading support form...
          </p>
        </div>
      )}
      
      {/* Container for Jira widget - data attributes tell the script where to mount */}
      <div 
        id="jira-widget-container"
        data-jsd-embedded=""
        data-key="7958a0ed-fe48-4e2b-b9f5-32eb7f1451c9"
        data-base-url="https://jsd-widget.atlassian.com"
        className="min-h-[500px] w-full"
      />
    </div>
  );
};

export default JiraWidget;
