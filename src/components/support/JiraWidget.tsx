import React, { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, CheckCircle2, AlertCircle } from 'lucide-react';

interface JiraWidgetProps {
  className?: string;
}

declare global {
  interface Window {
    __JSD_WIDGET_INITIALIZED?: boolean;
  }
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
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const copyDomain = () => {
    const domain = window.location.origin;
    navigator.clipboard.writeText(domain).then(() => {
      toast({
        title: "Domain copied!",
        description: "Share this with your Jira admin to allowlist.",
      });
    });
  };
  useEffect(() => {
    // Prevent duplicate initialization
    if (window.__JSD_WIDGET_INITIALIZED) {
      console.log('Jira widget already initialized globally');
      setIsLoading(false);
      
      // Check for widget with retry logic
      let attempts = 0;
      const maxAttempts = 10; // 30 seconds total (3s * 10)
      const checkInterval = setInterval(() => {
        const iframe = document.querySelector('iframe[src*="jsd-widget.atlassian.com"]');
        if (iframe) {
          console.log('✓ Jira widget iframe detected');
          setWidgetDetected(true);
          setCheckedVisibility(true);
          clearInterval(checkInterval);
        } else {
          attempts++;
          setRetryCount(attempts);
          console.log(`Checking for widget... attempt ${attempts}/${maxAttempts}`);
          if (attempts >= maxAttempts) {
            console.warn('✗ Widget not detected after 30 seconds - domain may not be allowlisted');
            setCheckedVisibility(true);
            clearInterval(checkInterval);
          }
        }
      }, 3000);
      
      return () => clearInterval(checkInterval);
    }

    setIsLoading(true);
    setHasError(false);

    const existingScript = document.querySelector(
      'script[src="https://jsd-widget.atlassian.com/assets/embed.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      console.log('Jira widget script already present in DOM');
      window.__JSD_WIDGET_INITIALIZED = true;
      setIsLoading(false);
      
      // Check for widget with retry logic
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = setInterval(() => {
        const iframe = document.querySelector('iframe[src*="jsd-widget.atlassian.com"]');
        if (iframe) {
          console.log('✓ Jira widget iframe detected');
          setWidgetDetected(true);
          setCheckedVisibility(true);
          clearInterval(checkInterval);
        } else {
          attempts++;
          setRetryCount(attempts);
          if (attempts >= maxAttempts) {
            console.warn('✗ Widget not detected - domain may not be allowlisted');
            setCheckedVisibility(true);
            clearInterval(checkInterval);
          }
        }
      }, 3000);
      
      return () => clearInterval(checkInterval);
    }

    const script = document.createElement('script');
    script.src = 'https://jsd-widget.atlassian.com/assets/embed.js';
    script.async = true;
    script.setAttribute('data-jsd-embedded', '');
    script.setAttribute('data-key', '7958a0ed-fe48-4e2b-b9f5-32eb7f1451c9');
    script.setAttribute('data-base-url', 'https://jsd-widget.atlassian.com');

    script.onload = () => {
      console.log('✓ Jira widget script loaded and injected into <body>');
      window.__JSD_WIDGET_INITIALIZED = true;
      setIsLoading(false);
      
      // Check for widget with retry logic
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = setInterval(() => {
        const iframe = document.querySelector('iframe[src*="jsd-widget.atlassian.com"]');
        if (iframe) {
          console.log('✓ Jira widget iframe detected');
          setWidgetDetected(true);
          setCheckedVisibility(true);
          clearInterval(checkInterval);
        } else {
          attempts++;
          setRetryCount(attempts);
          if (attempts >= maxAttempts) {
            console.warn('✗ Widget not detected - domain may not be allowlisted');
            setCheckedVisibility(true);
            clearInterval(checkInterval);
          }
        }
      }, 3000);
    };

    script.onerror = () => {
      console.error('✗ Failed to load Jira Service Desk widget script');
      setHasError(true);
      setIsLoading(false);
      setCheckedVisibility(true);
    };

    console.log('→ Injecting Jira widget script into <body>');
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
      {!isLoading && checkedVisibility && widgetDetected && (
        <div className="text-center py-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold">Widget Active</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Look for the support launcher at the bottom-right corner of this page.
            </p>
          </div>
        </div>
      )}
      
      {!isLoading && checkedVisibility && !widgetDetected && (
        <div className="text-center py-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="text-base font-semibold">Widget Not Detected</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              The widget should appear at the bottom-right but isn't visible. 
              Your domain likely needs to be allowlisted in Jira Service Management.
            </p>
            <div className="bg-background/50 rounded p-3 mb-3">
              <p className="text-xs text-muted-foreground mb-1">Domain to allowlist:</p>
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {typeof window !== 'undefined' ? window.location.origin : ''}
              </code>
            </div>
            <Button onClick={copyDomain} variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Domain
            </Button>
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Checked {retryCount} time{retryCount !== 1 ? 's' : ''}...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JiraWidget;
