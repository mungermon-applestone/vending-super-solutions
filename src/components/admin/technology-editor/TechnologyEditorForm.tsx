
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInformation from './sections/BasicInformation';
import TechnologySections from './sections/TechnologySections';
import { CMSTechnology } from '@/types/cms';
import { AlertCircle, Loader2 } from 'lucide-react';

// Define the schema for technology form data
const technologyFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  image_url: z.string().optional(),
  image_alt: z.string().optional(),
  visible: z.boolean().default(false),
  sections: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, 'Section title is required'),
      description: z.string().optional(),
      section_type: z.string().optional(),
      display_order: z.number().default(0),
      features: z.array(
        z.object({
          id: z.string().optional(),
          title: z.string().min(1, 'Feature title is required'),
          description: z.string().optional(),
          icon: z.string().optional(),
          display_order: z.number().default(0),
          items: z.array(
            z.object({
              id: z.string().optional(),
              text: z.string().min(1, 'Item text is required'),
              display_order: z.number().default(0),
            })
          ).optional().default([]),
        })
      ).optional().default([]),
    })
  ).optional().default([]),
});

export type TechnologyFormValues = z.infer<typeof technologyFormSchema>;

interface TechnologyEditorFormProps {
  initialData?: CMSTechnology | null;
  onSave: (data: TechnologyFormValues) => Promise<void>;
  isLoading: boolean;
}

const TechnologyEditorForm: React.FC<TechnologyEditorFormProps> = ({
  initialData,
  onSave,
  isLoading,
}) => {
  const { toast } = useToast();
  const isNew = !initialData;
  const [formState, setFormState] = React.useState<'idle' | 'submitting' | 'error'>('idle');
  const [formError, setFormError] = React.useState<string | null>(null);
  
  console.log('Form initialization - isLoading:', isLoading);
  console.log('Form initialization - formState:', formState);
  
  // Set up form with default values or existing technology data
  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologyFormSchema),
    defaultValues: initialData ? {
      title: initialData.title || '',
      slug: initialData.slug || '',
      description: initialData.description || '',
      image_url: initialData.image_url || '',
      image_alt: initialData.image_alt || '',
      visible: initialData.visible || false,
      sections: initialData.sections || [],
    } : {
      title: '',
      slug: '',
      description: '',
      image_url: '',
      image_alt: '',
      visible: false,
      sections: [],
    },
    mode: "onChange",
  });

  // Monitor form validity state
  const formIsValid = form.formState.isValid;
  const formIsDirty = form.formState.isDirty;
  
  React.useEffect(() => {
    console.log('Form state updated:', { 
      isValid: formIsValid, 
      isDirty: formIsDirty, 
      errors: form.formState.errors 
    });
  }, [formIsValid, formIsDirty, form.formState.errors]);

  // Handle form submission
  const handleSubmit = async (data: TechnologyFormValues) => {
    console.log('Form submission initiated, button clicked');
    try {
      setFormState('submitting');
      setFormError(null);
      
      console.log('Submitting form data:', data);
      await onSave(data);
      
      setFormState('idle');
      toast({
        title: isNew ? "Technology created" : "Technology updated",
        description: isNew 
          ? "Your new technology has been created successfully." 
          : "Your technology has been updated successfully.",
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setFormState('error');
      setFormError(error instanceof Error ? error.message : "Failed to save technology");
      
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Failed to save technology",
      });
    }
  };

  // Create a direct click handler for debugging
  const handleButtonClick = () => {
    console.log('Button clicked directly!');
    console.log('Form is valid:', formIsValid);
    console.log('Form errors:', form.formState.errors);
    console.log('Current form values:', form.getValues());
    
    // This doesn't submit the form, just logs info
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        console.log('Form onSubmit triggered');
        form.handleSubmit(handleSubmit)(e);
      }}>
        {formError && (
          <div className="bg-destructive/15 p-3 rounded-md mb-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive">Error saving technology</h4>
              <p className="text-sm text-destructive/90">{formError}</p>
            </div>
          </div>
        )}
        
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-amber-50 p-3 rounded-md mb-4 border border-amber-200">
            <h4 className="font-medium text-amber-800">Form has validation errors</h4>
            <ul className="list-disc pl-5 mt-2 text-sm text-amber-700">
              {Object.entries(form.formState.errors).map(([key, value]) => (
                <li key={key}>{key}: {value?.message?.toString()}</li>
              ))}
            </ul>
          </div>
        )}
        
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basics">Basic Information</TabsTrigger>
            <TabsTrigger value="sections">Sections & Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-4 mt-4">
            <Card className="p-6">
              <BasicInformation form={form} />
            </Card>
          </TabsContent>
          
          <TabsContent value="sections" className="space-y-4 mt-4">
            <Card className="p-6">
              <TechnologySections form={form} />
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className="px-6"
          >
            Debug Form
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading || formState === 'submitting'}
            className="px-6"
          >
            {formState === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isNew ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              isNew ? 'Create Technology' : 'Update Technology'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TechnologyEditorForm;
