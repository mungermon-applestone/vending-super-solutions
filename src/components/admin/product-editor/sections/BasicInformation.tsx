
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
  // Add debug logging
  useEffect(() => {
    console.log('[BasicInformation] Component mounted with form values:', form.getValues());
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            console.log('[BasicInformation] Rendering title field with value:', field.value);
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Product Title" 
                    {...field} 
                    onChange={(e) => {
                      console.log('[BasicInformation] Title changed:', e.target.value);
                      field.onChange(e);
                    }}
                    onFocus={() => console.log('[BasicInformation] Title field focused')}
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
          render={({ field }) => {
            console.log('[BasicInformation] Rendering slug field with value:', field.value);
            return (
              <FormItem>
                <FormLabel>Slug (URL-friendly name)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="product-slug" 
                    value={field.value || ''}
                    onChange={(e) => {
                      console.log('[BasicInformation] Slug changed:', e.target.value);
                      const value = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');
                      field.onChange(value);
                    }}
                    onFocus={() => console.log('[BasicInformation] Slug field focused')}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            console.log('[BasicInformation] Rendering description field with value:', field.value ? 'has value' : 'empty');
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the product category..." 
                    className="min-h-[100px]"
                    value={field.value || ''}
                    onChange={(e) => {
                      console.log('[BasicInformation] Description changed');
                      field.onChange(e);
                    }}
                    onFocus={() => console.log('[BasicInformation] Description field focused')}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
