
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MediaSelector from '@/components/admin/media/MediaSelector';
import BackgroundPreview from '@/components/admin/landing-pages/BackgroundPreview';
import * as z from 'zod';

interface HeroContentTabProps {
  form: UseFormReturn<z.infer<any>>;
  backgroundOptions: Array<{value: string, label: string}>;
}

const HeroContentTab: React.FC<HeroContentTabProps> = ({ form, backgroundOptions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Content</CardTitle>
        <CardDescription>
          Configure the hero section content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="hero.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Title</FormLabel>
              <FormControl>
                <Input placeholder="Main heading for the hero section" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hero.subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Subtitle</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Supporting text for the hero section" 
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hero.background_class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Style</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {backgroundOptions.map((option) => (
                  <BackgroundPreview
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    isSelected={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="hero.image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Image</FormLabel>
                <FormControl>
                  <MediaSelector
                    value={field.value}
                    onChange={(url) => {
                      form.setValue("hero.image_url", url);
                    }}
                    buttonLabel="Select Hero Image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hero.image_alt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Alt Text</FormLabel>
                <FormControl>
                  <Input placeholder="Alt text for accessibility" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroContentTab;
