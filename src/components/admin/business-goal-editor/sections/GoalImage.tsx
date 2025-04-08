
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessGoalFormData } from '@/types/forms';

interface GoalImageProps {
  form: UseFormReturn<BusinessGoalFormData>;
}

const GoalImage: React.FC<GoalImageProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="image.url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                URL for the main image representing this business goal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image.alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Alt Text</FormLabel>
              <FormControl>
                <Input placeholder="Brief description of the image" {...field} />
              </FormControl>
              <FormDescription>
                Accessibility text describing the image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('image.url') && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="border rounded-lg overflow-hidden bg-gray-100 p-2">
              <img 
                src={form.watch('image.url')} 
                alt={form.watch('image.alt') || 'Preview'} 
                className="max-h-64 object-contain mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalImage;
