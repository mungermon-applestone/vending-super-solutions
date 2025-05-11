import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { trackDeprecatedFeatureUsage } from '@/services/cms/utils/deprecationLogger';

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
    trackDeprecatedFeatureUsage(
      "ViewInContentful",
      `Button clicked for content type: ${contentType || 'Unknown'}`
    );
    
    let url = "https://app.contentful.com/";
    
    // If we have all the necessary information to link directly to an entry
    if (spaceId && environmentId && contentType && contentId) {
      url = `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${contentId}`;
    }
    // If we only have content type, link to the content type
    else if (spaceId && environmentId && contentType) {
      url = `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries?contentTypeId=${contentType}`;
    }
    // Otherwise just open Contentful
    
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
