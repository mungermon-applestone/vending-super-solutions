
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { logDeprecation, getContentfulRedirectUrl } from '@/services/cms/utils/deprecationUtils';

/**
 * Component that redirects users from the legacy business goal editor
 * to Contentful for content management
 */
const BusinessGoalRedirector: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contentType = "Business Goal";
  const contentTypeId = "businessGoal";
  
  // If we have a specific goalId, it means we're editing
  const isEditing = !!goalId && goalId !== 'new';
  const actionType = isEditing ? 'edit' : 'create';
  
  const title = isEditing
    ? "Edit Business Goal in Contentful"
    : "Create Business Goals in Contentful";
    
  const description = isEditing
    ? "This business goal can only be edited in Contentful CMS. Please use Contentful to manage this content."
    : "New business goals can only be created in Contentful CMS. Please use Contentful to manage this content.";

  useEffect(() => {
    // Log this redirection
    logDeprecation(
      "BusinessGoalRedirector",
      `User attempted to ${actionType} business goal ${goalId || '(new)'}`,
      "Use Contentful directly"
    );
    
    // Show toast notification
    toast({
      title: "Redirecting to Contentful",
      description: description,
      variant: "default",
    });
  }, [actionType, goalId, description, toast]);

  const getContentfulUrl = (): string => {
    return getContentfulRedirectUrl(
      contentTypeId,
      isEditing ? goalId : undefined
    );
  };

  const handleOpenContentful = () => {
    window.open(getContentfulUrl(), "_blank");
  };

  const handleBack = () => {
    navigate("/admin/business-goals");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="shadow-md border-2 border-blue-100">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-xl text-blue-800">{title}</CardTitle>
            <CardDescription className="text-blue-700">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center">
              <p className="mb-6 text-gray-600">
                All {contentType.toLowerCase()} management has been moved to Contentful CMS.
                Please click the button below to open Contentful and {actionType} your {contentType.toLowerCase()} there.
              </p>
              
              <Button 
                onClick={handleOpenContentful} 
                className="bg-blue-600 hover:bg-blue-700 mb-8"
                size="lg"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                {isEditing ? `Edit in Contentful` : `Create in Contentful`}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Business Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BusinessGoalRedirector;
