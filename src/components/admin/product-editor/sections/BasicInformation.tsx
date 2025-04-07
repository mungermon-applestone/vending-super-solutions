
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
  // Add debugging to see when component re-renders
  console.log('[BasicInformation] Rendering with form values:', {
    title: form.watch('title'),
    slug: form.watch('slug'),
    description: form.watch('description')
  });

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
                      console.log('[BasicInformation] Title onChange:', e.target.value);
                      field.onChange(e);
                    }}
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
              <FormLabel>Slug (URL-friendly name)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="product-slug" 
                  {...field}
                  onChange={(e) => {
                    console.log('[BasicInformation] Slug onChange before processing:', e.target.value);
                    const value = e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '');
                    console.log('[BasicInformation] Slug onChange after processing:', value);
                    field.onChange(value);
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the product category..." 
                  className="min-h-[100px]"
                  {...field}
                  onChange={(e) => {
                    console.log('[BasicInformation] Description onChange:', e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
