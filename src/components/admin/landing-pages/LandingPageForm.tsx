
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandingPageFormData } from '@/types/landingPage';
import { useToast } from '@/hooks/use-toast';

// Import refactored tab components
import BasicInformationTab from './tabs/BasicInformationTab';
import HeroContentTab from './tabs/HeroContentTab';
import CTAButtonsTab from './tabs/CTAButtonsTab';
import PreviewTab from './tabs/PreviewTab';

const formSchema = z.object({
  page_key: z.string().min(1, "Page key is required"),
  page_name: z.string().min(1, "Page name is required"),
  hero: z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    image_url: z.string().min(1, "Image URL is required"),
    image_alt: z.string().min(1, "Image alt text is required"),
    cta_primary_text: z.string().optional(),
    cta_primary_url: z.string().optional(),
    cta_secondary_text: z.string().optional(),
    cta_secondary_url: z.string().optional(),
    background_class: z.string().optional(),
  })
});

interface LandingPageFormProps {
  initialData?: LandingPageFormData;
  onSubmit: (data: LandingPageFormData) => void;
  isSubmitting: boolean;
}

const backgroundOptions = [
  {
    value: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
    label: 'Blue to Teal Gradient'
  },
  {
    value: 'bg-gradient-to-r from-slate-50 to-slate-100',
    label: 'Light Gray Gradient'
  },
  {
    value: 'bg-white',
    label: 'Plain White'
  },
  {
    value: 'bg-vending-blue-dark text-white',
    label: 'Dark Blue'
  },
  {
    value: 'bg-vending-teal text-white',
    label: 'Teal'
  },
];

const LandingPageForm: React.FC<LandingPageFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const { toast } = useToast();
  
  // Set up default values
  const defaultValues = initialData || {
    page_key: '',
    page_name: '',
    hero: {
      title: '',
      subtitle: '',
      image_url: '',
      image_alt: '',
      cta_primary_text: 'Request a Demo',
      cta_primary_url: '/contact',
      cta_secondary_text: 'Explore Products',
      cta_secondary_url: '/products',
      background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
    }
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  // Debug form state
  useEffect(() => {
    console.log("LandingPageForm - Form state:", {
      values: form.getValues(),
      errors: form.formState.errors,
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
      defaultValues: form.formState.defaultValues
    });
  }, [form.formState]);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("LandingPageForm - Submitting form with data:", data);
    try {
      await onSubmit(data as LandingPageFormData);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please check the console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="hero">Hero Content</TabsTrigger>
            <TabsTrigger value="cta">Call to Action</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInformationTab form={form} />
          </TabsContent>
          
          <TabsContent value="hero">
            <HeroContentTab form={form} backgroundOptions={backgroundOptions} />
          </TabsContent>
          
          <TabsContent value="cta">
            <CTAButtonsTab form={form} />
          </TabsContent>
          
          <TabsContent value="preview">
            <PreviewTab form={form} />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => {
              console.log("Save button clicked");
              console.log("Form values:", form.getValues());
              console.log("Form errors:", form.formState.errors);
              
              if (!form.formState.isValid) {
                console.log("Form is invalid, not submitting");
                toast({
                  title: "Validation Error",
                  description: "Please check the form for errors and try again.",
                  variant: "destructive",
                });
              }
            }}
          >
            {isSubmitting ? "Saving..." : "Save Landing Page"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LandingPageForm;
