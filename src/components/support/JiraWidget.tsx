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
  const [widgetDetected, setWidgetDetected] = useState(false);
  const [checkedVisibility, setCheckedVisibility] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    const checkWidget = () => {
      const iframe = document.querySelector('iframe[src*="jsd-widget.atlassian.com"]');
      if (iframe) {
        setWidgetDetected(true);
      }
      setCheckedVisibility(true);
    };

    const existingScript = document.querySelector(
      'script[src="https://jsd-widget.atlassian.com/assets/embed.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      console.log('Jira widget script already present');
      setIsLoading(false);
      setTimeout(checkWidget, 2500);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://jsd-widget.atlassian.com/assets/embed.js';
    script.async = true;
    script.setAttribute('data-jsd-embedded', '');
    script.setAttribute('data-key', '7958a0ed-fe48-4e2b-b9f5-32eb7f1451c9');
    script.setAttribute('data-base-url', 'https://jsd-widget.atlassian.com');

    script.onload = () => {
      console.log('Jira widget script loaded (global)');
      setIsLoading(false);
      setTimeout(checkWidget, 2500);
    };

    script.onerror = () => {
      console.error('Failed to load Jira Service Desk widget (global)');
      setHasError(true);
      setIsLoading(false);
      setCheckedVisibility(true);
    };

    document.body.appendChild(script);

    return () => {
      // Intentionally not removing the script to avoid duplicate inserts on remounts
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
            Loading support widget... It will appear at the bottom-right.
          </p>
        </div>
      )}
      
      {/* The Jira widget injects a floating launcher in the bottom-right. No container needed. */}
      {!isLoading && checkedVisibility && !widgetDetected && (
        <div className="text-center py-6">
          <div className="bg-muted/30 border border-border rounded-lg p-4 max-w-lg mx-auto">
            <h3 className="text-base font-semibold mb-1">Support Widget Not Visible</h3>
            <p className="text-sm text-muted-foreground">
              The support widget should appear at the bottom-right of this page. If it doesn't,
              your domain may not be allowlisted. Share this domain with your Jira admin:
              <span className="font-mono ml-1">{typeof window !== 'undefined' ? window.location.origin : ''}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JiraWidget;
