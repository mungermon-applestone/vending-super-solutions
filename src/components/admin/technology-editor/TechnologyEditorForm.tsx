
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
  });

  // Handle form submission
  const handleSubmit = async (data: TechnologyFormValues) => {
    try {
      await onSave(data);
      toast({
        title: isNew ? "Technology created" : "Technology updated",
        description: isNew 
          ? "Your new technology has been created successfully." 
          : "Your technology has been updated successfully.",
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Failed to save technology",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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
            type="submit"
            disabled={isLoading}
            className="px-6"
          >
            {isLoading ? 'Saving...' : (isNew ? 'Create Technology' : 'Update Technology')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TechnologyEditorForm;
