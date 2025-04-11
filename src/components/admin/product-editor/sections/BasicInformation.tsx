
import React from 'react';
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
  console.log('[BasicInformation] Form is read-only:', form.formState.isReadOnly);
  console.log('[BasicInformation] Form is disabled:', form.formState.disabled);

  return (
    <Card>
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
                    readOnly={false}
                    disabled={false}
                    data-force-editable="true"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      console.log('[BasicInformation] Title changed to:', e.target.value);
                      
                      // Auto-generate slug if slug is empty
                      const currentSlug = form.getValues('slug');
                      if (!currentSlug) {
                        form.setValue('slug', formatSlug(e.target.value), {
                          shouldDirty: true
                        });
                      }
                    }}
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
                    readOnly={false}
                    disabled={false}
                    data-force-editable="true"
                    onChange={(e) => {
                      const formattedValue = formatSlug(e.target.value);
                      field.onChange(formattedValue);
                      console.log('[BasicInformation] Slug changed to:', formattedValue);
                    }}
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
                    readOnly={false}
                    disabled={false}
                    data-force-editable="true"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      console.log('[BasicInformation] Description changed to:', e.target.value);
                    }}
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
