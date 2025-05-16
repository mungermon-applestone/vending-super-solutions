import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getContentfulRedirectUrl, logDeprecation } from '@/services/cms/utils/deprecationUtils';

interface ContentfulRedirectHandlerProps {
  contentType: string;
  entityId?: string;
  message?: string;
  redirectPath?: string;
  autoRedirect?: boolean;
  children?: React.ReactNode;
}

/**
 * Component that can either automatically redirect to Contentful
 * or display a message with its children
 */
const ContentfulRedirectHandler: React.FC<ContentfulRedirectHandlerProps> = ({
  contentType,
  entityId,
  message = "This page has been deprecated. Please use Contentful.",
  redirectPath,
  autoRedirect = false,
  children
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    logDeprecation(
      `ContentfulRedirectHandler-${contentType}`,
      `User accessed deprecated ${contentType} page`,
      "Use Contentful directly"
    );
    
    // Show a toast notification
    toast({
      title: "Deprecated Page",
      description: message,
      variant: "destructive",
    });
    
    // If autoRedirect is true, redirect to Contentful or specified path
    if (autoRedirect) {
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        window.location.href = getContentfulRedirectUrl(contentType, entityId);
      }
    }
  }, [contentType, entityId, autoRedirect, redirectPath, navigate, toast, message]);
  
  // If not auto-redirecting, render children
  if (!autoRedirect) {
    return <>{children}</>;
  }
  
  // Otherwise render nothing (will redirect)
  return null;
};

export default ContentfulRedirectHandler;
