
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';
import { logDeprecation, getContentfulRedirectUrl } from '@/services/cms/utils/deprecationUtils';

interface ContentfulButtonProps extends Omit<ButtonProps, 'onClick'> {
  contentType?: string;
  contentTypeId?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  customText?: string;
  contentfulSpaceId?: string;
  contentfulEnvironmentId?: string;
  customUrl?: string;
  entryId?: string;
  action?: 'view' | 'edit' | 'create' | 'manage';
  logUsage?: boolean;
}

/**
 * A standardized button component that links to Contentful
 * Replaces multiple similar components with a single, configurable one
 */
const ContentfulButton: React.FC<ContentfulButtonProps> = ({ 
  contentType, 
  contentTypeId,
  className,
  variant = "outline",
  size = "sm",
  customText,
  contentfulSpaceId,
  contentfulEnvironmentId,
  customUrl,
  entryId,
  action = 'view',
  logUsage = true,
  ...props 
}) => {
  // Set a default content type ID based on the content type if not provided
  const actualContentTypeId = contentTypeId || 
    (contentType ? contentType.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  const handleOpenContentful = () => {
    if (logUsage) {
      // Track usage of the button
      logDeprecation(
        "ContentfulButton",
        `${action} button clicked for ${contentType || 'Unknown'} ${entryId ? `ID: ${entryId}` : ''}`,
        "Use Contentful directly for content management"
      );
    }
    
    // Construct the Contentful URL - if custom URL provided, use that
    const url = customUrl || getContentfulRedirectUrl(
      actualContentTypeId,
      entryId,
      contentfulSpaceId,
      contentfulEnvironmentId
    );
    
    window.open(url, "_blank");
  };

  // Determine button text based on action and content type
  const getButtonText = (): string => {
    if (customText) return customText;
    
    switch (action) {
      case 'create':
        return contentType ? `Create ${contentType} in Contentful` : 'Create in Contentful';
      case 'edit':
        return contentType ? `Edit ${contentType} in Contentful` : 'Edit in Contentful';
      case 'manage':
        return contentType ? `Manage ${contentType} in Contentful` : 'Manage in Contentful';
      case 'view':
      default:
        return contentType ? `View in Contentful` : 'Open Contentful';
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      className={`flex items-center gap-2 ${className || ''}`}
      onClick={handleOpenContentful}
      {...props}
    >
      <ExternalLink className="h-4 w-4" />
      <span>{getButtonText()}</span>
    </Button>
  );
};

export default ContentfulButton;
