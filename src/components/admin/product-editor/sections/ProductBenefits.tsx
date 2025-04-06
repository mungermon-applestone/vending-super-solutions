
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash } from 'lucide-react';
import { ProductFormData } from '@/types/forms';

interface ProductBenefitsProps {
  form: UseFormReturn<ProductFormData>;
}

const ProductBenefits = ({ form }: ProductBenefitsProps) => {
  const addBenefit = () => {
    const currentBenefits = form.getValues('benefits');
    form.setValue('benefits', [...currentBenefits, '']);
  };

  const removeBenefit = (index: number) => {
    const currentBenefits = form.getValues('benefits');
    if (currentBenefits.length > 1) {
      form.setValue('benefits', currentBenefits.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Benefits</span>
          <Button 
            type="button" 
            onClick={addBenefit} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Benefit
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {form.watch('benefits').map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 mb-4">
            <FormField
              control={form.control}
              name={`benefits.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={`Benefit ${index + 1}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="button" 
              onClick={() => removeBenefit(index)}
              variant="ghost"
              size="icon"
              disabled={form.watch('benefits').length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProductBenefits;
