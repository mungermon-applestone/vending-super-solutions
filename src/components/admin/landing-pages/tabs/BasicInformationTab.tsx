
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LandingPageFormData } from '@/types/landingPage';
import * as z from 'zod';

interface BasicInformationTabProps {
  form: UseFormReturn<z.infer<any>>;
}

const BasicInformationTab: React.FC<BasicInformationTabProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter the basic information for this landing page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="page_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Key</FormLabel>
              <FormControl>
                <Input placeholder="e.g., home, products" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="page_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Homepage, Products Page" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInformationTab;
