
import React, { useEffect, useRef } from 'react';
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
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    console.log('[BasicInformation] Component mounted');
    
    // Log refs after render
    setTimeout(() => {
      console.log('[BasicInformation] Title input ref:', titleRef.current);
      if (titleRef.current) {
        console.log('[BasicInformation] Title readOnly:', titleRef.current.readOnly);
        console.log('[BasicInformation] Title disabled:', titleRef.current.disabled);
        console.log('[BasicInformation] Title value:', titleRef.current.value);
      }
      
      console.log('[BasicInformation] Slug input ref:', slugRef.current);
      if (slugRef.current) {
        console.log('[BasicInformation] Slug readOnly:', slugRef.current.readOnly);
        console.log('[BasicInformation] Slug disabled:', slugRef.current.disabled);
      }
    }, 500);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Product Title" 
                  {...field} 
                  ref={titleRef}
                  readOnly={false}
                  disabled={false}
                  onClick={(e) => {
                    console.log('[BasicInformation] Title input clicked', e.currentTarget.value);
                  }}
                  onFocus={(e) => {
                    console.log('[BasicInformation] Title input focused', e.currentTarget.value);
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
              <FormLabel>Slug (URL-friendly name)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="product-slug" 
                  {...field}
                  ref={slugRef}
                  readOnly={false}
                  disabled={false}
                  onChange={(e) => {
                    const value = e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '');
                    field.onChange(value);
                    console.log('[BasicInformation] Slug changed to:', value);
                  }}
                  onClick={(e) => {
                    console.log('[BasicInformation] Slug input clicked', e.currentTarget.value);
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
                  ref={descriptionRef}
                  readOnly={false}
                  disabled={false}
                  onClick={(e) => {
                    console.log('[BasicInformation] Description input clicked', e.currentTarget.value);
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
