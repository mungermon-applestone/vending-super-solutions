
import React from 'react';
import ContentfulRedirector from '@/components/admin/contentful/ContentfulRedirector';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface BusinessGoalRedirectorProps {
  slug?: string; // The business goal slug if we're editing an existing one
  isNew?: boolean; // Whether we're creating a new business goal
  returnPath: string; // Where to return to if the user cancels
}

/**
 * Component that redirects users from deprecated business goal editor to Contentful
 * @deprecated Use ContentfulRedirector directly
 */
const BusinessGoalRedirector: React.FC<BusinessGoalRedirectorProps> = ({
  slug,
  isNew = false,
  returnPath
}) => {
  return (
    <>
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Redirecting to Contentful</AlertTitle>
        <AlertDescription>
          Business goal management has been moved to Contentful.
          You will be redirected to the appropriate Contentful interface.
        </AlertDescription>
      </Alert>
      
      <ContentfulRedirector
        contentType="businessGoal"
        contentTypeName="Business Goal"
        slug={slug}
        isCreating={isNew}
        returnPath={returnPath}
      />
    </>
  );
};

export default BusinessGoalRedirector;
