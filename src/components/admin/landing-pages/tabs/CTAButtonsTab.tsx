
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';

interface CTAButtonsTabProps {
  form: UseFormReturn<z.infer<any>>;
}

const CTAButtonsTab: React.FC<CTAButtonsTabProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call to Action Buttons</CardTitle>
        <CardDescription>
          Configure the call to action buttons for this hero section.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Primary Button</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hero.cta_primary_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Get Started" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hero.cta_primary_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button URL</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., /contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Secondary Button</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hero.cta_secondary_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Learn More" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hero.cta_secondary_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button URL</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., /about" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CTAButtonsTab;
