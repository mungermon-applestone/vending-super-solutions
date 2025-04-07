
import React, { useState, useEffect } from 'react';
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
  // Initialize state with form values
  const [title, setTitle] = useState(form.getValues('title') || '');
  const [slug, setSlug] = useState(form.getValues('slug') || '');
  const [description, setDescription] = useState(form.getValues('description') || '');

  // Update local state when form values change (especially when populated from API)
  useEffect(() => {
    console.log('[BasicInformation] Form values changed, updating local state:', {
      formTitle: form.getValues('title'),
      formSlug: form.getValues('slug'),
      formDescription: form.getValues('description')
    });
    
    // Only update if the form values are not empty and different from current state
    const formTitle = form.getValues('title');
    const formSlug = form.getValues('slug');
    const formDescription = form.getValues('description');
    
    if (formTitle && formTitle !== title) {
      setTitle(formTitle);
    }
    
    if (formSlug && formSlug !== slug) {
      setSlug(formSlug);
    }
    
    if (formDescription && formDescription !== description) {
      setDescription(formDescription);
    }
  }, [form.formState.defaultValues]);

  // Update React Hook Form whenever local state changes
  useEffect(() => {
    // We need this effect to ensure form values are set properly
    form.setValue('title', title, { shouldDirty: true, shouldTouch: true });
    
    // Apply slug formatting rules
    const formattedSlug = slug
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    form.setValue('slug', formattedSlug, { shouldDirty: true, shouldTouch: true });
    form.setValue('description', description, { shouldDirty: true, shouldTouch: true });
    
    // Log updated form values after setting
    console.log('[BasicInformation] Updated form values:', {
      title: form.getValues('title'),
      slug: form.getValues('slug'),
      description: form.getValues('description')
    });
  }, [title, slug, description, form]);

  // Log current values for debugging
  console.log('[BasicInformation] Rendering with local state values:', {
    title,
    slug,
    description
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              placeholder="Product Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="mt-1 w-full"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="slug">Slug (URL-friendly name)</FormLabel>
            <Input
              id="slug"
              placeholder="product-slug"
              value={slug}
              onChange={(e) => {
                const value = e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '');
                setSlug(value);
              }}
              className="mt-1 w-full"
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              placeholder="Describe the product..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="mt-1 w-full min-h-[100px]"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
