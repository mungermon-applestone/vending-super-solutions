
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { logDeprecation, getContentfulRedirectUrl } from '@/services/cms/utils/deprecation';

interface ViewInContentfulProps extends ButtonProps {
  contentType?: string;
  contentId?: string;
  spaceId?: string;
  environmentId?: string;
}

/**
 * Standard button for viewing content in Contentful
 */
const ViewInContentful: React.FC<ViewInContentfulProps> = ({
  contentType,
  contentId,
  spaceId = process.env.CONTENTFUL_SPACE_ID,
  environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID,
  className,
  variant = "outline",
  size = "sm",
  ...props
}) => {
  const handleClick = () => {
    // Track usage of the "View in Contentful" button
    logDeprecation(
      "ViewInContentful", 
      `Button clicked for content type: ${contentType || 'Unknown'}`
    );
    
    // Use our utility function to generate the URL
    const url = getContentfulRedirectUrl(contentType, contentId);
    
    window.open(url, "_blank");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className || ''}`}
      {...props}
    >
      <ExternalLink className="h-4 w-4" />
      <span>{contentType ? `View in Contentful` : `Open Contentful`}</span>
    </Button>
  );
};

export default ViewInContentful;
