import React, { useEffect, useState, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.warn('JiraWidget: container not found');
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Cleanup any previous content inside the container
    container.innerHTML = '';

    // Create and configure the Jira widget script and place it inside the container
    const script = document.createElement('script');
    script.src = 'https://jsd-widget.atlassian.com/assets/embed.js';
    script.async = true;
    script.setAttribute('data-jsd-embedded', '');
    script.setAttribute('data-key', '7958a0ed-fe48-4e2b-b9f5-32eb7f1451c9');
    script.setAttribute('data-base-url', 'https://jsd-widget.atlassian.com');

    script.onload = () => {
      console.log('Jira widget script loaded successfully (embedded)');
      setIsLoading(false);
    };

    script.onerror = () => {
      console.error('Failed to load Jira Service Desk widget (embedded)');
      setHasError(true);
      setIsLoading(false);
    };

    container.appendChild(script);

    // Cleanup: remove any content we injected in the container
    return () => {
      try {
        container.innerHTML = '';
      } catch (e) {
        // no-op
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
        ref={containerRef}
        className="min-h-[500px] w-full"
      />
    </div>
  );
};

export default JiraWidget;
