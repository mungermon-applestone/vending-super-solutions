
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { MachineFormValues } from '@/utils/machineMigration/types';
import MediaSelector from '@/components/admin/media/MediaSelector';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface MachineImagesProps {
  form: UseFormReturn<MachineFormValues>;
}

const MachineImages: React.FC<MachineImagesProps> = ({ form }) => {
  const addImage = () => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', [...currentImages, { url: '', alt: '' }]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    if (currentImages.length > 1) {
      form.setValue('images', currentImages.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Images</h2>
          <Button type="button" variant="outline" size="sm" onClick={addImage}>
            <Plus className="h-4 w-4 mr-2" /> Add Image
          </Button>
        </div>
        
        {form.watch('images')?.map((_, index) => (
          <div key={index} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Image {index + 1}</h3>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => removeImage(index)}
                disabled={form.watch('images')?.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name={`images.${index}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <MediaSelector
                      value={field.value}
                      onChange={(url) => {
                        form.setValue(`images.${index}.url`, url);
                        console.log("[MachineImages] Selected image URL:", url);
                      }}
                      buttonLabel="Select Machine Image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`images.${index}.alt`}
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Image description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MachineImages;
