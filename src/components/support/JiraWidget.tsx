import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExternalLink, Headset } from 'lucide-react';

/**
 * JiraWidget Component Props
 * 
 * @property {string} portalUrl - Direct URL to your Jira Service Management portal
 *   Example: "https://applestonesolutions.atlassian.net/servicedesk/customer/portal/1"
 *   
 *   To find your portal URL:
 *   1. Go to Jira Service Management
 *   2. Navigate to Project settings > Customer portal
 *   3. Copy the portal URL
 * 
 * @property {'popover' | 'direct' | 'button'} mode - Integration mode (default: 'popover')
 *   - 'popover': Opens portal in a large dialog with iframe
 *   - 'direct': Opens portal in new tab when button is clicked
 *   - 'button': Same as direct (opens in new tab)
 * 
 * @property {string} buttonText - Custom button text (default: 'Open Support Portal')
 * @property {string} className - Optional CSS classes
 */
interface JiraWidgetProps {
  portalUrl: string;
  mode?: 'popover' | 'direct' | 'button';
  buttonText?: string;
  className?: string;
}

/**
 * JiraWidget Component
 * 
 * Provides integration with Jira Service Management portal.
 * Displays the portal in an iframe dialog or opens it in a new tab.
 * 
 * No Jira configuration required - works immediately!
 */
const JiraWidget: React.FC<JiraWidgetProps> = ({
  portalUrl,
  mode = 'popover',
  buttonText = 'Open Support Portal',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Handle direct link mode (opens in new tab)
  if (mode === 'direct' || mode === 'button') {
    return (
      <div className={`text-center ${className}`}>
        <Button
          size="lg"
          onClick={() => window.open(portalUrl, '_blank', 'noopener,noreferrer')}
          className="gap-2"
        >
          <Headset className="h-5 w-5" />
          {buttonText}
          <ExternalLink className="h-4 w-4" />
        </Button>
        
        <p className="text-sm text-muted-foreground mt-4">
          Opens in a new tab
        </p>
      </div>
    );
  }

  // Handle popover mode (iframe in dialog)
  return (
    <div className={`text-center ${className}`}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2">
            <Headset className="h-5 w-5" />
            {buttonText}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Support Portal</DialogTitle>
            <DialogDescription>
              Submit tickets, track requests, and browse our knowledge base
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 px-6 pb-6 flex flex-col gap-4">
            {/* Open in New Tab Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(portalUrl, '_blank', 'noopener,noreferrer')}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
            </div>
            
            {/* Iframe Container */}
            {!iframeError ? (
              <div className="flex-1 border rounded-lg overflow-hidden bg-background">
                <iframe
                  src={portalUrl}
                  className="w-full h-full"
                  title="Jira Support Portal"
                  allow="clipboard-write"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  onError={() => setIframeError(true)}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border rounded-lg bg-destructive/10">
                <div className="text-center max-w-md p-6">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Unable to Load Portal
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The portal cannot be displayed in this window. This may be due to browser security settings.
                  </p>
                  <Button
                    onClick={() => window.open(portalUrl, '_blank', 'noopener,noreferrer')}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab Instead
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <p className="text-sm text-muted-foreground mt-4">
        Opens the support portal in a large window
      </p>
    </div>
  );
};

export default JiraWidget;
