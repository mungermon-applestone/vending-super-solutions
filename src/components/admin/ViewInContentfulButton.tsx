
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { getContentfulEditUrl } from '@/services/cms/utils/migrationHelpers';
import { logDeprecation } from '@/services/cms/utils/deprecation';

interface ViewInContentfulButtonProps extends ButtonProps {
  contentType: string;
  contentId?: string;
  label?: string;
}

/**
 * Standardized button to view or create content in Contentful
 */
const ViewInContentfulButton: React.FC<ViewInContentfulButtonProps> = ({
  contentType,
  contentId,
  label,
  className = '',
  variant = 'outline',
  size = 'sm',
  ...props
}) => {
  // Determine appropriate button text
  const buttonText = label || (contentId 
    ? `Edit in Contentful` 
    : contentType 
      ? `Create in Contentful` 
      : `Open Contentful`);
  
  const handleClick = () => {
    logDeprecation(
      'ViewInContentfulButton',
      `Redirecting to Contentful for ${contentType}${contentId ? ' ID: ' + contentId : ''}`,
      'Use Contentful directly for content management'
    );
    
    const url = getContentfulEditUrl(contentType, contentId);
    window.open(url, '_blank');
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
      {...props}
    >
      <ExternalLink className="h-4 w-4" />
      <span>{buttonText}</span>
    </Button>
  );
};

export default ViewInContentfulButton;
