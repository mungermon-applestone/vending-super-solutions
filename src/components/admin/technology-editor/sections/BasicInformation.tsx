
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateSlug } from '@/lib/utils';
import MediaSelector from '@/components/admin/media/MediaSelector';

const BasicInformationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  image_url: z.string().optional(),
  image_alt: z.string().optional(),
});

const BasicInformation = ({ data, onDataChange }) => {
  const [autoSlug, setAutoSlug] = useState(!data?.slug);
  
  const form = useForm({
    resolver: zodResolver(BasicInformationSchema),
    defaultValues: {
      title: data?.title || '',
      slug: data?.slug || '',
      description: data?.description || '',
      image_url: data?.image_url || '',
      image_alt: data?.image_alt || '',
    },
  });
  
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && autoSlug) {
        const newSlug = generateSlug(value.title || '');
        form.setValue('slug', newSlug);
      }
      
      // Notify parent component of data changes
      onDataChange?.(value);
    });
    
    return () => subscription.unsubscribe();
  }, [form, autoSlug, onDataChange]);
  
  const handleSlugEdit = () => {
    setAutoSlug(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Technology title" {...field} />
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
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="url-friendly-slug" 
                      {...field} 
                      onFocus={handleSlugEdit}
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
                      placeholder="Technology description" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Featured Image</FormLabel>
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <MediaSelector
                    value={field.value}
                    onChange={field.onChange}
                    buttonLabel="Select Technology Image"
                  />
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="image_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Alt Text</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Alternative text for the image" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
