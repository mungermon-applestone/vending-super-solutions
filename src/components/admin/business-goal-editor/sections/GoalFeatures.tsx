
import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash, Check, Star, Zap, ArrowRight, Award, Shield } from 'lucide-react';
import { BusinessGoalFormData } from '@/types/forms';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GoalFeaturesProps {
  form: UseFormReturn<BusinessGoalFormData>;
}

const iconOptions = [
  { value: 'check', label: 'Check', icon: <Check className="h-4 w-4" /> },
  { value: 'star', label: 'Star', icon: <Star className="h-4 w-4" /> },
  { value: 'zap', label: 'Zap', icon: <Zap className="h-4 w-4" /> },
  { value: 'arrow-right', label: 'Arrow', icon: <ArrowRight className="h-4 w-4" /> },
  { value: 'award', label: 'Award', icon: <Award className="h-4 w-4" /> },
  { value: 'shield', label: 'Shield', icon: <Shield className="h-4 w-4" /> },
];

const GoalFeatures: React.FC<GoalFeaturesProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'features'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormDescription>
          Add key features that help businesses achieve this goal
        </FormDescription>

        <Accordion type="multiple" className="w-full">
          {fields.map((field, index) => (
            <AccordionItem key={field.id} value={`feature-${index}`}>
              <AccordionTrigger className="px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100">
                <div className="flex items-center">
                  <span className="font-semibold">
                    {form.watch(`features.${index}.title`) || `Feature #${index + 1}`}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-4 p-2">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remove Feature
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`features.${index}.title`}
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feature Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Feature name" {...field} />
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
                        <FormLabel>Feature Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe this feature..." {...field} />
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
                        <FormLabel>Feature Icon</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {iconOptions.map(icon => (
                              <SelectItem key={icon.value} value={icon.value}>
                                <div className="flex items-center gap-2">
                                  {icon.icon}
                                  <span>{icon.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`features.${index}.screenshotUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feature Screenshot URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>Optional screenshot showing this feature</FormDescription>
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
                          <Input placeholder="Description of the screenshot" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch(`features.${index}.screenshotUrl`) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Screenshot Preview:</p>
                      <div className="border rounded-lg overflow-hidden bg-gray-100 p-2">
                        <img 
                          src={form.watch(`features.${index}.screenshotUrl`)} 
                          alt={form.watch(`features.${index}.screenshotAlt`) || 'Preview'} 
                          className="max-h-48 object-contain mx-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ 
            title: '', 
            description: '', 
            icon: 'check', 
            screenshotUrl: '', 
            screenshotAlt: '' 
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalFeatures;
