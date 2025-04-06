
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash } from 'lucide-react';
import { ProductFormData } from '@/types/forms';

interface ProductFeaturesProps {
  form: UseFormReturn<ProductFormData>;
}

const ProductFeatures = ({ form }: ProductFeaturesProps) => {
  const addFeature = () => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', [...currentFeatures, {
      title: '',
      description: '',
      icon: 'check',
      screenshotUrl: '',
      screenshotAlt: ''
    }]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features');
    if (currentFeatures.length > 1) {
      form.setValue('features', currentFeatures.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Features</span>
          <Button 
            type="button" 
            onClick={addFeature} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Feature
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {form.watch('features').map((feature, index) => (
          <div key={index} className="border rounded p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Feature {index + 1}</h3>
              <Button 
                type="button" 
                onClick={() => removeFeature(index)}
                variant="ghost"
                size="icon"
                disabled={form.watch('features').length <= 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name={`features.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Feature Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`features.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`features.${index}.icon`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="check, shoppingbag, shieldcheck, etc." 
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available icons: check, shoppingbag, shieldcheck, utensils, tags, truck, clock
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`features.${index}.screenshotUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screenshot URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`features.${index}.screenshotAlt`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screenshot Alt Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Description of screenshot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch(`features.${index}.screenshotUrl`) && (
                <div className="mt-2">
                  <p className="text-sm mb-1">Screenshot Preview:</p>
                  <img 
                    src={form.watch(`features.${index}.screenshotUrl`)} 
                    alt={form.watch(`features.${index}.screenshotAlt`)} 
                    className="max-w-[200px] border rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProductFeatures;
