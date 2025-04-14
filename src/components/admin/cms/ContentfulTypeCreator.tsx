
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
import { ContentTypeProps } from '@/services/cms/types/contentfulTypes';
import { Trash2, Plus, FileCode, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample content type templates
const contentTypeTemplates: Record<string, ContentTypeProps> = {
  blogPost: {
    id: 'blogPost',
    name: 'Blog Post',
    description: 'A blog post with rich text content',
    displayField: 'title',
    publish: true,
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        required: true,
        validations: [
          {
            unique: true,
            regexp: {
              pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
              flags: ''
            },
            message: 'Slug must contain only lowercase letters, numbers, and hyphens'
          }
        ]
      },
      {
        id: 'publishDate',
        name: 'Publish Date',
        type: 'Date',
        required: false,
      },
      {
        id: 'featuredImage',
        name: 'Featured Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
      },
      {
        id: 'content',
        name: 'Content',
        type: 'RichText',
        required: true,
      },
      {
        id: 'excerpt',
        name: 'Excerpt',
        type: 'Text',
        required: false,
      },
      {
        id: 'author',
        name: 'Author',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'tags',
        name: 'Tags',
        type: 'Array',
        items: {
          type: 'Symbol'
        },
        required: false,
      }
    ]
  },
  productType: {
    id: 'productType',
    name: 'Product Type',
    description: 'A vending machine product type',
    displayField: 'title',
    publish: true,
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        required: true,
        validations: [
          {
            unique: true,
          }
        ]
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true,
      },
      {
        id: 'image',
        name: 'Main Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
      },
      {
        id: 'benefits',
        name: 'Benefits',
        type: 'Array',
        items: {
          type: 'Symbol',
        },
        required: false,
      },
      {
        id: 'features',
        name: 'Features',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['feature']
            }
          ]
        },
        required: false,
      },
      {
        id: 'visible',
        name: 'Visible',
        type: 'Boolean',
        required: false,
      }
    ]
  },
  feature: {
    id: 'feature',
    name: 'Feature',
    description: 'A feature for products or business goals',
    displayField: 'title',
    publish: true,
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true,
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'screenshot',
        name: 'Screenshot',
        type: 'Link',
        linkType: 'Asset',
        required: false,
      }
    ]
  },
  businessGoal: {
    id: 'businessGoal',
    name: 'Business Goal',
    description: 'A business goal',
    displayField: 'title',
    publish: true,
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        required: true,
        validations: [
          {
            unique: true,
          }
        ]
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true,
      },
      {
        id: 'image',
        name: 'Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'Symbol',
        required: false,
      },
      {
        id: 'benefits',
        name: 'Benefits',
        type: 'Array',
        items: {
          type: 'Symbol',
        },
        required: false,
      },
      {
        id: 'features',
        name: 'Features',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['feature']
            }
          ]
        },
        required: false,
      },
      {
        id: 'visible',
        name: 'Visible',
        type: 'Boolean',
        required: false,
      }
    ]
  },
};

const ContentfulTypeCreator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    contentTypeId?: string;
  } | null>(null);
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
      const template = contentTypeTemplates[selectedTemplate];
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
            {Object.entries(contentTypeTemplates).map(([id, template]) => (
              <Button
                key={id}
                variant={selectedTemplate === id ? "default" : "outline"}
                className={`justify-start text-left h-auto py-3 ${
                  selectedTemplate === id ? "" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedTemplate(id)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{template.description}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {template.fields.length} fields • ID: {template.id}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {selectedTemplate && (
          <div className="border rounded-md p-3 bg-muted/30">
            <h4 className="font-medium mb-2 text-sm">
              Template Details: {contentTypeTemplates[selectedTemplate].name}
            </h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p><strong>ID:</strong> {contentTypeTemplates[selectedTemplate].id}</p>
              <p><strong>Display Field:</strong> {contentTypeTemplates[selectedTemplate].displayField}</p>
              <p><strong>Fields:</strong> {contentTypeTemplates[selectedTemplate].fields.length}</p>
              <details>
                <summary className="cursor-pointer hover:text-foreground">View Fields</summary>
                <ul className="ml-2 mt-1 space-y-1">
                  {contentTypeTemplates[selectedTemplate].fields.map((field) => (
                    <li key={field.id}>
                      <strong>{field.name}</strong> ({field.type})
                      {field.required && <span className="text-red-500">*</span>}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
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
