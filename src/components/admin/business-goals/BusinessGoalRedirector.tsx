
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { logDeprecation, getContentfulRedirectUrl } from '@/services/cms/utils/deprecationUtils';

interface BusinessGoalRedirectorProps {
  businessGoalId?: string;
  businessGoalSlug?: string;
  isCreating?: boolean;
  contentfulSpaceId?: string;
  contentfulEnvironmentId?: string;
  backPath?: string;
}

/**
 * Component for redirecting users from the legacy business goal editor to Contentful
 */
const BusinessGoalRedirector: React.FC<BusinessGoalRedirectorProps> = ({
  businessGoalId,
  businessGoalSlug,
  isCreating = false,
  contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID,
  contentfulEnvironmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master',
  backPath = '/admin/business-goals'
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const title = isCreating ? 'Create Business Goal' : 'Edit Business Goal';
  const description = `Business goal ${isCreating ? 'creation' : 'editing'} has moved to Contentful CMS`;
  
  useEffect(() => {
    // Log this redirection
    logDeprecation(
      "BusinessGoalRedirector",
      `User attempted to ${isCreating ? 'create' : 'edit'} a business goal through the deprecated interface`,
      "Use Contentful directly"
    );
    
    // Show toast notification
    toast({
      title: "Content Management Moved",
      description: "Business goal management has been moved to Contentful CMS.",
      variant: "destructive",
    });
  }, [isCreating, toast]);

  const getContentfulUrl = (): string => {
    return getContentfulRedirectUrl(
      'businessGoal', 
      businessGoalId,
      contentfulSpaceId,
      contentfulEnvironmentId
    );
  };

  const handleOpenContentful = () => {
    window.open(getContentfulUrl(), "_blank");
  };

  const handleBack = () => {
    navigate(backPath);
  };

  return (
    <Card className="shadow-md border-2 border-blue-100">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="text-xl text-blue-800">{title}</CardTitle>
        <CardDescription className="text-blue-700">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col items-center text-center">
          <p className="mb-6 text-gray-600">
            The business goal management interface has been moved to Contentful CMS.
            Please click the button below to {isCreating ? 'create a new' : 'edit this'} business goal in Contentful.
          </p>
          
          <Button 
            onClick={handleOpenContentful} 
            className="bg-blue-600 hover:bg-blue-700 mb-6"
            size="lg"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            {isCreating ? 'Create New' : 'Edit'} Business Goal in Contentful
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-center">
        <Button 
          variant="ghost" 
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Business Goals
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusinessGoalRedirector;
