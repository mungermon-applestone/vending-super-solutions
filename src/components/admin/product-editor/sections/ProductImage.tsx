
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaSelector from '@/components/admin/media/MediaSelector';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const ProductImage = ({ form }) => {
  console.log("[ProductImage] Rendering with image URL:", form.watch("image.url"));
  
  // Add effect to track image URL changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'image.url') {
        console.log("[ProductImage] Image URL changed in form:", value.image?.url);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="image.url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <MediaSelector
                    value={field.value || ""}
                    onChange={(url) => {
                      console.log("[ProductImage] Selected image URL explicitly updated to:", url);
                      // Force direct change to the form value with all flags active
                      form.setValue("image.url", url, { 
                        shouldDirty: true, 
                        shouldTouch: true, 
                        shouldValidate: true 
                      });
                      // Also set the field value directly to ensure it's registered
                      field.onChange(url);
                    }}
                    buttonLabel="Select Product Image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image.alt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alt Text</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Description for accessibility" 
                    {...field} 
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

export default ProductImage;
