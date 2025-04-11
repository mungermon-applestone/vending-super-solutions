
import React from 'react';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn, ControllerRenderProps } from 'react-hook-form';

/**
 * FormFieldWrapper - A reusable component to standardize form field handling
 * 
 * This component ensures consistent handling of form fields, especially
 * after operations like cloning where field editability can be affected.
 * 
 * Always using this wrapper helps maintain explicit value handling.
 */
interface FormFieldWrapperProps<T> {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  renderInput: (field: ControllerRenderProps<any, any>) => React.ReactNode;
  onChangeOverride?: (e: any, field: ControllerRenderProps<any, any>) => void;
}

const FormFieldWrapper = <T,>({ 
  form, 
  name, 
  label, 
  placeholder, 
  className = '',
  renderInput,
  onChangeOverride
}: FormFieldWrapperProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Add explicit logging for debugging
        console.log(`[FormFieldWrapper] Rendering field: ${name}, value:`, field.value);
        
        // If there's a custom onChange handler, wrap the field with it
        const enhancedField = onChangeOverride ? {
          ...field,
          onChange: (e: any) => {
            console.log(`[FormFieldWrapper] Field ${name} changed:`, e.target?.value);
            onChangeOverride(e, field);
          }
        } : field;
        
        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {renderInput(enhancedField)}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormFieldWrapper;
