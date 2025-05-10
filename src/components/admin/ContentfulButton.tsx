
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface ContentfulButtonProps extends Omit<ButtonProps, 'onClick'> {
  contentType?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const ContentfulButton: React.FC<ContentfulButtonProps> = ({ 
  contentType, 
  className,
  variant = "outline",
  size = "sm",
  ...props 
}) => {
  const handleOpenContentful = () => {
    // Open Contentful, potentially with a specific content type focused if provided
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleOpenContentful}
      {...props}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      {contentType ? `Manage ${contentType} in Contentful` : 'Open Contentful'}
    </Button>
  );
};

export default ContentfulButton;
