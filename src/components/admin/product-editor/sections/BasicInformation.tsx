import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductFormData } from '@/types/forms';

interface BasicInformationProps {
  form: UseFormReturn<ProductFormData>;
}

const BasicInformation = ({ form }: BasicInformationProps) => {
  // Log the current form values for debugging
  console.log('[BasicInformation] Current form values:', {
    title: form.watch('title'),
    slug: form.watch('slug'),
    description: form.watch('description')
  });

  // Create a slug formatter function
  const formatSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  // Debug the form state
  console.log('[BasicInformation] Form state:', form.formState);
  
  // Make sure form fields are editable on mount and when form changes
  useEffect(() => {
    const makeEditable = () => {
      console.log('[BasicInformation] Ensuring form fields are editable');
      setTimeout(() => {
        // Target just the inputs in this component for better performance
        document.querySelectorAll('#basic-info-section input, #basic-info-section textarea').forEach(el => {
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            el.readOnly = false;
            el.disabled = false;
            // Remove attributes as a backup in case properties are being overridden
            el.removeAttribute('readonly');
            el.removeAttribute('disabled');
            console.log(`[BasicInformation] Made ${el.id || 'unnamed'} field editable`);
          }
        });
      }, 100);
    };
    
    makeEditable();
    
    // Set up a small interval to keep checking
    const interval = setInterval(makeEditable, 1000);
    
    return () => clearInterval(interval);
  }, [form]);

  return (
    <Card id="basic-info-section">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    placeholder="Product Title"
                    {...field}
                    onChange={(e) => {
                      // Directly update the field value
                      field.onChange(e);
                      console.log('[BasicInformation] Title changed to:', e.target.value);
                      
                      // Auto-generate slug if slug is empty
                      const currentSlug = form.getValues('slug');
                      if (!currentSlug) {
                        form.setValue('slug', formatSlug(e.target.value), {
                          shouldDirty: true
                        });
                      }
                    }}
                    // Explicitly ensure the field is editable
                    readOnly={false}
                    disabled={false}
                    data-force-editable="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="slug">Slug (URL-friendly name)</FormLabel>
                <FormControl>
                  <Input
                    id="slug"
                    placeholder="product-slug"
                    {...field}
                    onChange={(e) => {
                      // Apply slug formatting and update the field
                      const formattedValue = formatSlug(e.target.value);
                      // Use direct value assignment to ensure it updates
                      field.onChange(formattedValue);
                      console.log('[BasicInformation] Slug changed to:', formattedValue);
                    }}
                    // Explicitly ensure the field is editable
                    readOnly={false}
                    disabled={false}
                    data-force-editable="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder="Describe the product..."
                    className="min-h-[100px]"
                    {...field}
                    onChange={(e) => {
                      // Directly update the field value
                      field.onChange(e);
                      console.log('[BasicInformation] Description changed to:', e.target.value);
                    }}
                    // Explicitly ensure the field is editable
                    readOnly={false}
                    disabled={false}
                    data-force-editable="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
