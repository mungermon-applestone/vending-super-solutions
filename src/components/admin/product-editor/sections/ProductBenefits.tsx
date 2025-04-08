
import React, { useEffect } from 'react';
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
import { Plus, Trash, AlertCircle } from 'lucide-react';
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

  // Check for duplicate benefits and set form errors
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('benefits')) {
        const benefits = form.getValues('benefits');
        
        // Look for duplicates
        const duplicates = new Map();
        benefits.forEach((benefit, index) => {
          if (benefit.trim()) {
            const normalizedBenefit = benefit.trim().toLowerCase();
            if (duplicates.has(normalizedBenefit)) {
              // Set error on current field
              form.setError(`benefits.${index}`, { 
                type: 'duplicate', 
                message: 'Duplicate benefit' 
              });
              
              // Set error on the original field
              form.setError(`benefits.${duplicates.get(normalizedBenefit)}`, { 
                type: 'duplicate', 
                message: 'Duplicate benefit' 
              });
            } else {
              duplicates.set(normalizedBenefit, index);
              // Clear error if it was previously set
              form.clearErrors(`benefits.${index}`);
            }
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Find unique benefit count to provide user feedback
  const uniqueBenefitsCount = new Set(
    form.watch('benefits')
      .filter(benefit => benefit.trim() !== '')
      .map(benefit => benefit.trim().toLowerCase())
  ).size;

  const totalBenefitsCount = form.watch('benefits').filter(benefit => benefit.trim() !== '').length;
  const hasDuplicates = uniqueBenefitsCount < totalBenefitsCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2">
            <span>Benefits</span>
            {hasDuplicates && (
              <div className="flex items-center text-destructive text-sm gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>Duplicate benefits found</span>
              </div>
            )}
          </div>
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
