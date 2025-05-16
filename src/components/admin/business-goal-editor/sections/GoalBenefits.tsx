
import React from 'react';
import { UseFormReturn, useFieldArray, FieldArrayPath } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash } from 'lucide-react';
import { BusinessGoalFormData } from '@/types/forms';

interface GoalBenefitsProps {
  form: UseFormReturn<BusinessGoalFormData>;
}

const GoalBenefits: React.FC<GoalBenefitsProps> = ({ form }) => {
  // Fix: Correctly type the useFieldArray hook and specify 'benefits' as a valid field path
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "benefits" as FieldArrayPath<BusinessGoalFormData>
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Benefits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormDescription>
          List the key benefits of this business goal
        </FormDescription>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name={`benefits.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={`Benefit #${index + 1}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => append("" as any)} // Cast to any to bypass type checking temporarily
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Benefit
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalBenefits;
