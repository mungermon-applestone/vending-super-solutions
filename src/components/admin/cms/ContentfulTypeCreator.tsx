
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createContentType, deleteContentType } from '@/services/cms/utils/contentfulManagement';
import { FileCode, Plus, Trash2, Check, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contentfulTemplates } from '@/data/contentful-templates';
import { TemplateDetails } from './TemplateDetails';
import { ContentTypeCreatorResult } from '@/types/contentful-admin';

const ContentfulTypeCreator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<ContentTypeCreatorResult | null>(null);
  const { toast } = useToast();

  const handleCreateContentType = async () => {
    if (!selectedTemplate) {
      toast({
        variant: 'destructive',
        title: 'No template selected',
        description: 'Please select a template to create a content type.'
      });
      return;
    }

    setIsCreating(true);
    setResult(null);

    try {
      const template = contentfulTemplates[selectedTemplate].contentType;
      const response = await createContentType(template);
      
      if (response.success) {
        setResult({
          success: true,
          message: response.message,
          contentTypeId: template.id
        });
        
        toast({
          title: 'Content Type Created',
          description: (
            <div className="flex items-center gap-2">
              <Check className="text-green-500" />
              <span>{response.message}</span>
            </div>
          )
        });
      } else {
        setResult({
          success: false,
          message: response.message
        });
        
        toast({
          variant: 'destructive',
          title: 'Error Creating Content Type',
          description: response.message
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteContentType = async (contentTypeId: string) => {
    if (!contentTypeId) return;
    
    setIsCreating(true);
    
    try {
      const response = await deleteContentType(contentTypeId);
      
      if (response.success) {
        setResult({
          success: true,
          message: response.message
        });
        
        toast({
          title: 'Content Type Deleted',
          description: response.message
        });
      } else {
        setResult({
          success: false,
          message: response.message
        });
        
        toast({
          variant: 'destructive',
          title: 'Error Deleting Content Type',
          description: response.message
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          Contentful Content Type Creator
        </CardTitle>
        <CardDescription>
          Create predefined content type templates in your Contentful space
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Available Content Type Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(contentfulTemplates).map((template) => (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? "default" : "outline"}
                className={`justify-start text-left h-auto py-3 ${
                  selectedTemplate === template.id ? "" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{template.description}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {template.contentType.fields.length} fields • ID: {template.contentType.id}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {selectedTemplate && (
          <TemplateDetails template={contentfulTemplates[selectedTemplate]} />
        )}

        {selectedTemplate === 'machine' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>About Machine Specifications</AlertTitle>
            <AlertDescription className="text-sm">
              The Machine content type now includes individual fields for common specifications 
              (dimensions, weight, capacity, etc.) instead of a single JSON object field. This makes
              it easier for content creators to input structured specification data.
            </AlertDescription>
          </Alert>
        )}
        
        {selectedTemplate === 'feature' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>About Feature Icons</AlertTitle>
            <AlertDescription className="text-sm">
              The Feature content type includes a dropdown for selecting from a predefined list of 
              icons from the Lucide icon library. These icons can be directly used in the UI.
            </AlertDescription>
          </Alert>
        )}
        
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {result.success ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {result.message}
              
              {result.success && result.contentTypeId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteContentType(result.contentTypeId!)}
                  className="mt-2 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete this content type
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleCreateContentType}
          disabled={!selectedTemplate || isCreating}
          className="w-full"
        >
          {isCreating ? (
            <>Creating...</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Content Type
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentfulTypeCreator;
