
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaSelector from '@/components/admin/media/MediaSelector';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const ProductImage = ({ form }) => {
  const imageUrl = form.watch("image.url");
  console.log("[ProductImage] Rendering with image URL:", imageUrl);
  
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
          {/* Show image preview if it exists */}
          {imageUrl && (
            <div className="rounded-md overflow-hidden border border-gray-200">
              <img 
                src={imageUrl} 
                alt={form.watch("image.alt") || "Product"} 
                className="w-full h-auto max-h-[200px] object-cover"
              />
            </div>
          )}
          
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
                      
                      // Use form.setValue to properly update form values
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
