
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';

interface DisplayOrderFieldsProps {
  form: UseFormReturn<any>;
  showDescription?: boolean;
}

const DisplayOrderFields: React.FC<DisplayOrderFieldsProps> = ({ form, showDescription = true }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value, 10) : null;
                    field.onChange(value);
                  }}
                />
              </FormControl>
              {showDescription && (
                <FormDescription>
                  Controls the display order on the main listing page. Lower numbers appear first.
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showOnHomepage"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Show on Homepage
                </FormLabel>
                {showDescription && (
                  <FormDescription>
                    Display this item in featured sections on the homepage
                  </FormDescription>
                )}
              </div>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="homepageOrder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Homepage Order</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0"
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value, 10) : null;
                  field.onChange(value);
                }}
              />
            </FormControl>
            {showDescription && (
              <FormDescription>
                Controls the display order on the homepage. Only applies if "Show on Homepage" is checked.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
    </>
  );
};

export default DisplayOrderFields;
