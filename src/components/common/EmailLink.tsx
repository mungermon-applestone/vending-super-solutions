
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface EmailLinkProps {
  title?: string;
  description?: string;
  emailAddress?: string;
  subject?: string;
  buttonText?: string;
  className?: string;
}

const EmailLink: React.FC<EmailLinkProps> = ({
  title = 'Contact Us',
  description = 'Click the button below to send us an email.',
  emailAddress = 'contact@example.com', // Replace with your actual email
  subject = 'Website Inquiry',
  buttonText = 'Send Email',
  className,
}) => {
  const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 md:p-8 ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      
      <div className="flex flex-col items-center">
        <p className="text-gray-700 mb-4 text-center">
          Please click the button below to send us an email. We'll get back to you as soon as possible.
        </p>
        
        <Button 
          className="bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3 flex items-center gap-2"
          asChild
        >
          <a href={mailtoLink}>
            <Mail className="h-5 w-5" />
            {buttonText}
          </a>
        </Button>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          Alternatively, you can email us directly at: <a href={`mailto:${emailAddress}`} className="text-vending-blue hover:underline">{emailAddress}</a>
        </p>
      </div>
    </div>
  );
};

export default EmailLink;
