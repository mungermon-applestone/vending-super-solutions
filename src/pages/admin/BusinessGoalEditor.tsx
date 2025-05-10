
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

const BusinessGoalEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = !!slug;
  
  React.useEffect(() => {
    logDeprecationWarning(
      "BusinessGoalEditor",
      "The Business Goal editor interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage business goal content."
    );
  }, []);

  const openContentful = () => {
    window.open('https://app.contentful.com/', '_blank');
  };

  return (
    <DeprecatedAdminLayout
      title={isEditMode ? "Edit Business Goal" : "Create Business Goal"}
      description="Business goal management has moved to Contentful"
      contentType="Business Goal"
      backPath="/admin/business-goals"
    >
      <Card>
        <CardHeader>
          <CardTitle>Business Goal {isEditMode ? "Editor" : "Creator"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Business goal {isEditMode ? "editing" : "creation"} functionality has been fully migrated to Contentful.
            Please use Contentful's interface to {isEditMode ? "edit" : "create"} business goals.
          </p>
          
          <Button 
            variant="default"
            onClick={openContentful}
            className="w-full sm:w-auto"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {isEditMode ? "Edit in Contentful" : "Create in Contentful"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/admin/business-goals')}
            className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4"
          >
            Back to Business Goals
          </Button>
        </CardContent>
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default BusinessGoalEditor;
