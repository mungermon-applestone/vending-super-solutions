
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
  // Create a slug formatter function
  const formatSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  // Log form values for debugging
  console.log('[BasicInformation] Form values:', form.getValues());

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
            render={({ field }) => {
              console.log('[BasicInformation] Title field value:', field.value);
              return (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Product Title"
                      {...field}
                      onChange={(e) => {
                        console.log('[BasicInformation] Title changed to:', e.target.value);
                        field.onChange(e);
                      }}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
                      const formattedValue = formatSlug(e.target.value);
                      console.log('[BasicInformation] Slug changed to:', formattedValue);
                      field.onChange(formattedValue);
                    }}
                    value={field.value || ''}
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
                      console.log('[BasicInformation] Description changed to:', e.target.value);
                      field.onChange(e);
                    }}
                    value={field.value || ''}
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
