
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
    
    // Force inputs to be editable
    const makeInputsEditable = () => {
      console.log('[BasicInformation] Ensuring inputs are editable');
      if (titleRef.current) {
        titleRef.current.readOnly = false;
        titleRef.current.disabled = false;
        console.log('[BasicInformation] Title input made editable:', titleRef.current.value);
      }
      
      if (slugRef.current) {
        slugRef.current.readOnly = false;
        slugRef.current.disabled = false;
        console.log('[BasicInformation] Slug input made editable:', slugRef.current.value);
      }
      
      if (descriptionRef.current) {
        descriptionRef.current.readOnly = false;
        descriptionRef.current.disabled = false;
        console.log('[BasicInformation] Description input made editable:', descriptionRef.current.value);
      }
    };
    
    // Run immediately and then every second to ensure inputs remain editable
    makeInputsEditable();
    const interval = setInterval(makeInputsEditable, 1000);
    
    return () => clearInterval(interval);
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
                  ref={(e) => {
                    titleRef.current = e;
                    if (e) {
                      e.readOnly = false;
                      e.disabled = false;
                    }
                  }}
                  readOnly={false}
                  disabled={false}
                  onFocus={(e) => {
                    console.log('[BasicInformation] Title input focused', e.currentTarget.value);
                    e.currentTarget.readOnly = false;
                    e.currentTarget.disabled = false;
                  }}
                  onClick={(e) => {
                    console.log('[BasicInformation] Title input clicked');
                    e.currentTarget.readOnly = false;
                    e.currentTarget.disabled = false;
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
                  ref={(e) => {
                    slugRef.current = e;
                    if (e) {
                      e.readOnly = false;
                      e.disabled = false;
                    }
                  }}
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
                  onFocus={(e) => {
                    console.log('[BasicInformation] Slug input focused', e.currentTarget.value);
                    e.currentTarget.readOnly = false;
                    e.currentTarget.disabled = false;
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
                  ref={(e) => {
                    descriptionRef.current = e;
                    if (e) {
                      e.readOnly = false;
                      e.disabled = false;
                    }
                  }}
                  readOnly={false}
                  disabled={false}
                  onFocus={(e) => {
                    console.log('[BasicInformation] Description input focused', e.currentTarget.value);
                    e.currentTarget.readOnly = false;
                    e.currentTarget.disabled = false;
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
