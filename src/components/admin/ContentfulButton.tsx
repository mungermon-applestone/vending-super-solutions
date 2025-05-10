
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ContentfulButtonProps extends ButtonProps {
  text?: string;
}

const ContentfulButton: React.FC<ContentfulButtonProps> = ({
  text = "Open Contentful",
  className,
  variant = "outline",
  ...props
}) => {
  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleOpenContentful}
      {...props}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
};

export default ContentfulButton;
