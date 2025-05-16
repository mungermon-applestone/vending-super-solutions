
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { MachineFormValues } from '@/utils/machineMigration/types';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface MachineFeaturesProps {
  form: UseFormReturn<MachineFormValues>;
}

const MachineFeatures: React.FC<MachineFeaturesProps> = ({ form }) => {
  const addFeature = () => {
    const currentFeatures = form.getValues('features') || [];
    form.setValue('features', [...currentFeatures, { text: '' }]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features') || [];
    if (currentFeatures.length > 1) {
      form.setValue('features', currentFeatures.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Features</h2>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4 mr-2" /> Add Feature
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.watch('features')?.map((_, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Feature {index + 1}</h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeFeature(index)}
                  disabled={form.watch('features')?.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name={`features.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Touchscreen interface" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineFeatures;
