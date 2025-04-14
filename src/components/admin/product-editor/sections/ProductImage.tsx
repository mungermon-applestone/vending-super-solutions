
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaSelector from '@/components/admin/media/MediaSelector';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const ProductImage = ({ form }) => {
  console.log("[ProductImage] Rendering with image URL:", form.watch("image.url"));
  
  useEffect(() => {
    // Ensure image object is properly initialized
    if (!form.getValues("image")) {
      form.setValue("image", { url: "", alt: "" }, { shouldDirty: true });
    }
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
                      console.log("[ProductImage] Selected new image URL:", url);
                      
                      // Use a more direct approach to update form values
                      form.setValue("image.url", url, { 
                        shouldDirty: true, 
                        shouldTouch: true,
                        shouldValidate: true 
                      });
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
                    onChange={(e) => {
                      // Use a more direct approach to update form values
                      form.setValue("image.alt", e.target.value, { 
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true
                      });
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

export default ProductImage;
