
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

interface MachineSpecificationsProps {
  form: UseFormReturn<MachineFormValues>;
}

const MachineSpecifications: React.FC<MachineSpecificationsProps> = ({ form }) => {
  const addSpec = () => {
    const currentSpecs = form.getValues('specs') || [];
    form.setValue('specs', [...currentSpecs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    const currentSpecs = form.getValues('specs') || [];
    if (currentSpecs.length > 1) {
      form.setValue('specs', currentSpecs.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Specifications</h2>
          <Button type="button" variant="outline" size="sm" onClick={addSpec}>
            <Plus className="h-4 w-4 mr-2" /> Add Specification
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.watch('specs')?.map((_, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Spec {index + 1}</h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeSpec(index)}
                  disabled={form.watch('specs')?.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`specs.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Dimensions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`specs.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder='72" x 80" x 35"' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineSpecifications;
