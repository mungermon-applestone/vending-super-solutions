
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import { CMSTechnology } from '@/types/cms';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import TechnologyEditorForm from '@/components/admin/technology-editor/TechnologyEditorForm';
import { createTechnology, updateTechnology } from '@/services/cms/contentTypes/technologies';

const TechnologyEditor: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { technologySlug } = useParams<{ technologySlug: string }>();
  const isNewTechnology = !technologySlug;
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  
  // If editing an existing technology, fetch it
  const { technology, isLoading, error } = useTechnologyData(technologySlug || '');

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
    // Show editor mode notification
    toast({
      title: isNewTechnology ? 'Creating New Technology' : 'Editing Technology',
      description: isNewTechnology
        ? 'You are creating a new technology. This will be visible on the site after saving.'
        : 'You are editing an existing technology. Changes will be visible on the site after saving.',
      duration: 5000,
    });
    
    console.log('TechnologyEditor mounted:', {
      isNewTechnology,
      technologySlug
    });
  }, [toast, isNewTechnology, technologySlug]);

  const handleSaveTechnology = async (formData: any) => {
    console.log('Technology Editor: handleSaveTechnology called with data:', formData);
    setSaveError(null);
    try {
      setIsSaving(true);
      
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
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/technology')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Technologies
          </Button>
          
          <h1 className="text-3xl font-bold">
            {isNewTechnology ? 'Create New Technology' : 'Edit Technology'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNewTechnology
              ? 'Add a new technology to your platform'
              : `Editing: ${isLoading ? '...' : technology?.title}`}
          </p>
        </div>

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
      </div>
    </Layout>
  );
};

export default TechnologyEditor;
