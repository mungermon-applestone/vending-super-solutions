
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import { AlertCircle } from 'lucide-react';
import TechnologyEditorForm from '@/components/admin/technology-editor/TechnologyEditorForm';
import { createTechnology, updateTechnology } from '@/services/cms/contentTypes/technologies';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';

const TechnologyEditor: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { technologySlug } = useParams<{ technologySlug: string }>();
  
  // A technology is in edit mode if technologySlug exists and is not 'new'
  const isEditMode = !!technologySlug && technologySlug !== 'new';
  const isNewTechnology = !isEditMode;
  
  console.log('[TechnologyEditor] Technology slug from URL:', technologySlug);
  console.log('[TechnologyEditor] Is edit mode:', isEditMode);
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  
  // If editing an existing technology, fetch it
  const { technology, isLoading, error } = useTechnologyData(
    isEditMode ? technologySlug || '' : ''
  );

  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading technology",
        description: error.message
      });
    }
  }, [error, toast]);

  React.useEffect(() => {
    // Show deprecation notification
    toast({
      title: "Deprecated Editor",
      description: "This technology editor is being phased out. Please use Contentful CMS for content management.",
      variant: "warning",
      duration: 5000,
    });
  }, [toast]);

  const handleSaveTechnology = async (formData: any) => {
    console.log('Technology Editor: handleSaveTechnology called with data:', formData);
    setSaveError(null);
    try {
      setIsSaving(true);
      
      // Log that we're about to create/update the technology
      console.log(`About to ${isNewTechnology ? 'create' : 'update'} technology with data:`, formData);
      
      if (isNewTechnology) {
        // Create new technology
        console.log('Creating new technology...');
        const newTechnology = await createTechnology(formData);
        console.log('Technology created:', newTechnology);
        
        toast({
          title: "Technology created",
          description: "Technology has been created successfully."
        });
        navigate(`/admin/technology/edit/${newTechnology.slug}`);
      } else if (technologySlug) {
        // Update existing technology
        console.log('Updating existing technology...');
        await updateTechnology(technologySlug, formData);
        console.log('Technology updated successfully');
        
        toast({
          title: "Technology updated",
          description: "Technology has been updated successfully."
        });
        
        // If the slug was changed, navigate to the new URL
        if (formData.slug !== technologySlug) {
          navigate(`/admin/technology/edit/${formData.slug}`);
        }
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving technology:", error);
      setSaveError(error instanceof Error ? error.message : "An unknown error occurred");
      toast({
        variant: "destructive",
        title: "Failed to save technology",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      return Promise.reject(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DeprecatedAdminLayout
      title={isNewTechnology ? 'Create New Technology' : `Edit Technology: ${isLoading ? '...' : technology?.title}`}
      description="This technology editor is being phased out. Content edits should be made directly in Contentful CMS."
      contentType="Technology"
      backPath="/admin/technology"
    >
      {saveError && (
        <div className="bg-destructive/15 p-4 rounded-md mb-4 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <h4 className="font-medium text-destructive">Error</h4>
            <p className="text-sm text-destructive/90">{saveError}</p>
          </div>
        </div>
      )}

      {isLoading && !isNewTechnology ? (
        <Card className="p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded-md"></div>
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </div>
        </Card>
      ) : (
        <TechnologyEditorForm
          initialData={isNewTechnology ? null : technology}
          onSave={handleSaveTechnology}
          isLoading={isSaving}
        />
      )}
    </DeprecatedAdminLayout>
  );
};

export default TechnologyEditor;
