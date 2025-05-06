
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export interface EmailLinkProps extends ButtonProps {
  emailAddress?: string;
  subject?: string;
  body?: string;
  buttonText?: string;
  className?: string;
  showIcon?: boolean;
}

const EmailLink = ({
  emailAddress = 'munger@applestonesolutions.com',
  subject = 'Website Inquiry',
  body = '',
  buttonText = 'Contact Us',
  className = '',
  showIcon = true,
  ...props
}: EmailLinkProps) => {
  const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

  return (
    <Button 
      asChild
      className={`flex items-center gap-2 ${className}`}
      {...props}
    >
      <a href={mailtoLink}>
        {showIcon && <Mail className="h-4 w-4" />}
        {buttonText}
      </a>
    </Button>
  );
};

export default EmailLink;
