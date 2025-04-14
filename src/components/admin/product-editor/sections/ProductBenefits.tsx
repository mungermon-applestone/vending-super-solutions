
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
  // Get current benefits array
  const benefits = form.watch('benefits') || [];
  
  // Add a new empty benefit
  const addBenefit = () => {
    console.log("[ProductBenefits] Adding new benefit");
    const currentBenefits = [...benefits];
    form.setValue('benefits', [...currentBenefits, ''], { shouldDirty: true });
  };

  // Remove a benefit by index
  const removeBenefit = (indexToRemove: number) => {
    console.log(`[ProductBenefits] Removing benefit at index ${indexToRemove}`);
    const filteredBenefits = benefits.filter((_, idx) => idx !== indexToRemove);
    
    // If we removed the last item, add an empty one for UX
    const newBenefits = filteredBenefits.length === 0 ? [''] : filteredBenefits;
    
    // Important: Create a completely new array to ensure React/form detect the change
    form.setValue('benefits', [...newBenefits], { shouldDirty: true });
  };

  // Watch for duplicate benefits and mark them as errors
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name?.startsWith('benefits')) {
        const currentBenefits = form.getValues('benefits');
        console.log('[ProductBenefits] Benefits changed:', currentBenefits);
        
        // Clear all existing errors first
        currentBenefits.forEach((_, index) => {
          form.clearErrors(`benefits.${index}`);
        });
        
        // Check for duplicates (only among non-empty values)
        const valuesSeen = new Map();
        currentBenefits.forEach((benefit, index) => {
          if (benefit && benefit.trim()) {
            const normalized = benefit.trim().toLowerCase();
            if (valuesSeen.has(normalized)) {
              // Set error on this field
              form.setError(`benefits.${index}`, { 
                type: 'duplicate', 
                message: 'Duplicate benefit' 
              });
              
              // Also mark the original occurrence
              form.setError(`benefits.${valuesSeen.get(normalized)}`, { 
                type: 'duplicate', 
                message: 'Duplicate benefit' 
              });
            } else {
              valuesSeen.set(normalized, index);
            }
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2">
            <span>Benefits</span>
            {form.formState.errors.benefits && (
              <div className="flex items-center text-destructive text-sm gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>Issues found with benefits</span>
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
        {benefits.map((benefit, index) => (
          <div key={`benefit-${index}`} className="flex items-center gap-2 mb-4">
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
              aria-label={`Remove benefit ${index + 1}`}
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
