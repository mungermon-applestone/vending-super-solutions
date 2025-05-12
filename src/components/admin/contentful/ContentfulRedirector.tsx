
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { logDeprecation, getContentfulRedirectUrl } from '@/services/cms/utils/deprecationUtils';
import ViewInContentful from '@/components/admin/ViewInContentful';
import DeprecatedInterfaceWarning from '@/components/admin/DeprecatedInterfaceWarning';

interface ContentfulRedirectorProps {
  /**
   * The content type ID in Contentful
   */
  contentType: string;
  
  /**
   * Human-readable name of the content type (e.g., "Business Goal")
   */
  contentTypeName: string;
  
  /**
   * The entity slug if we're editing an existing entity
   */
  slug?: string;
  
  /**
   * Whether we're creating a new entity
   */
  isCreating?: boolean;
  
  /**
   * The path to return to if the user cancels
   */
  returnPath: string;
  
  /**
   * Optional content ID for Contentful
   */
  contentId?: string;
  
  /**
   * Optional custom description message
   */
  customMessage?: string;
}

/**
 * Generic component that redirects users from deprecated admin interfaces to Contentful
 */
const ContentfulRedirector: React.FC<ContentfulRedirectorProps> = ({
  contentType,
  contentTypeName,
  slug,
  isCreating = false,
  returnPath,
  contentId,
  customMessage
}) => {
  const navigate = useNavigate();
  
  // Track this redirection
  useEffect(() => {
    logDeprecation(
      `ContentfulRedirector-${contentType}-${isCreating ? 'create' : 'edit'}`,
      `User attempted to ${isCreating ? 'create' : 'edit'} ${contentTypeName.toLowerCase()}${slug ? ` (${slug})` : ''}`,
      "Use Contentful directly"
    );
  }, [contentType, contentTypeName, isCreating, slug]);
  
  // Handle redirecting to Contentful
  const handleGoToContentful = () => {
    // Use either provided contentId or slug
    const resolvedContentId = contentId || slug;
    
    // Generate the Contentful URL
    const url = getContentfulRedirectUrl(contentType, resolvedContentId);
    
    // Open Contentful in a new tab
    window.open(url, "_blank");
  };
  
  // Handle going back/cancel
  const handleCancel = () => {
    navigate(returnPath);
  };

  // Determine the message to display
  const actionText = isCreating ? 'Creating' : 'Editing';
  const message = customMessage || `${actionText} ${contentTypeName.toLowerCase()} is now done directly in Contentful. Please use the button below to open Contentful and continue.`;

  return (
    <div className="space-y-6">
      <DeprecatedInterfaceWarning 
        contentType={contentTypeName}
        contentTypeId={contentType}
        variant="warning"
      />
      
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800">
          {contentTypeName} {isCreating ? "Creation" : "Editing"} Has Moved
        </AlertTitle>
        <AlertDescription className="text-amber-700 mt-2">
          <p className="mb-4">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <ViewInContentful 
              contentType={contentType}
              contentId={contentId || slug}
              className="flex-1"
              variant="default"
              size="default"
            />
            
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="flex-1 sm:flex-initial"
            >
              Return to {contentTypeName} List
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ContentfulRedirector;
