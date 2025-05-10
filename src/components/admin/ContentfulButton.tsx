
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface ContentfulButtonProps extends Omit<ButtonProps, 'onClick'> {
  contentType?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  customText?: string;
  contentfulSpaceId?: string;
  contentfulEnvironmentId?: string;
  customUrl?: string;
}

/**
 * A button component that links to Contentful, optionally focusing on a specific content type
 */
const ContentfulButton: React.FC<ContentfulButtonProps> = ({ 
  contentType, 
  className,
  variant = "outline",
  size = "sm",
  customText,
  contentfulSpaceId,
  contentfulEnvironmentId,
  customUrl,
  ...props 
}) => {
  const handleOpenContentful = () => {
    // Construct the Contentful URL - if custom URL provided, use that
    if (customUrl) {
      window.open(customUrl, "_blank");
      return;
    }
    
    // Base Contentful URL
    let contentfulUrl = "https://app.contentful.com/";
    
    // If space ID is provided, use it to create a more specific URL
    if (contentfulSpaceId) {
      contentfulUrl += `spaces/${contentfulSpaceId}/`;
      
      // If environment is also provided, add it to the URL
      if (contentfulEnvironmentId) {
        contentfulUrl += `environments/${contentfulEnvironmentId}/`;
      }
      
      // If content type is provided, add it to the URL
      if (contentType) {
        // Convert contentType to kebab case if it contains spaces (e.g., "Business Goal" -> "business-goal")
        const contentTypeSlug = contentType.toLowerCase().replace(/\s+/g, '-');
        contentfulUrl += `entries/?contentTypeId=${contentTypeSlug}`;
      }
    }

    window.open(contentfulUrl, "_blank");
  };

  // Determine button text
  const buttonText = customText || 
    (contentType ? `Manage ${contentType} in Contentful` : 'Open Contentful');

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleOpenContentful}
      {...props}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
};

export default ContentfulButton;
