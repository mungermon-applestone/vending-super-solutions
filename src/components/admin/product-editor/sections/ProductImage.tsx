
import React from 'react';
import { FormField } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaSelector from '@/components/admin/media/MediaSelector';

const ProductImage = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <FormField
              control={form.control}
              name="image.url"
              render={({ field }) => (
                <MediaSelector
                  value={field.value}
                  onChange={field.onChange}
                  buttonLabel="Select Product Image"
                />
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="image.alt"
            render={({ field }) => (
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Alt Text
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Description for accessibility"
                  {...field}
                />
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImage;
