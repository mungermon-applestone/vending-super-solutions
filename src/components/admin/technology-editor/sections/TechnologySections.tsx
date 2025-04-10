
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, LayoutList, MoveUp, MoveDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FeatureItemsEditor from './FeatureItemsEditor';
import { TechnologyFormValues } from '../TechnologyEditorForm';

interface TechnologySectionsProps {
  form: any; // Using any due to generics complexity with useFormContext
}

const SECTION_TYPES = ['feature', 'integration', 'security', 'architecture', 'benefit'];

const TechnologySections: React.FC<TechnologySectionsProps> = ({ form }) => {
  const { control, formState } = form;
  const { fields: sectionFields, append: appendSection, remove: removeSection, move: moveSection } = 
    useFieldArray({
      control,
      name: 'sections',
    });

  const addNewSection = () => {
    appendSection({
      title: '',
      description: '',
      section_type: 'feature',
      display_order: sectionFields.length,
      features: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Technology Sections</h3>
          <p className="text-sm text-muted-foreground">
            Add sections to organize features of this technology.
          </p>
        </div>
        <Button onClick={addNewSection} type="button">
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>
      </div>

      {sectionFields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <LayoutList className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No Sections Added</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Add your first section to organize technology features
            </p>
            <Button onClick={addNewSection} type="button">
              <Plus className="h-4 w-4 mr-2" /> Add First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="w-full">
          {sectionFields.map((section, sectionIndex) => (
            <AccordionItem key={section.id} value={`section-${sectionIndex}`}>
              <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                <span className="flex items-center">
                  {form.watch(`sections.${sectionIndex}.title`) || `Section ${sectionIndex + 1}`}
                  {form.watch(`sections.${sectionIndex}.section_type`) && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                      {form.watch(`sections.${sectionIndex}.section_type`)}
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name={`sections.${sectionIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Cloud Architecture" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`sections.${sectionIndex}.section_type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || 'feature'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SECTION_TYPES.map(type => (
                              <SelectItem key={type} value={type} className="capitalize">
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`sections.${sectionIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this section of features..."
                          className="resize-y min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SectionFeaturesEditor 
                  sectionIndex={sectionIndex}
                  form={form}
                />

                <div className="flex justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveSection(sectionIndex, Math.max(0, sectionIndex - 1))}
                      disabled={sectionIndex === 0}
                    >
                      <MoveUp className="h-4 w-4 mr-1" /> Move Up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveSection(sectionIndex, Math.min(sectionFields.length - 1, sectionIndex + 1))}
                      disabled={sectionIndex === sectionFields.length - 1}
                    >
                      <MoveDown className="h-4 w-4 mr-1" /> Move Down
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove Section
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

interface SectionFeaturesEditorProps {
  sectionIndex: number;
  form: any;
}

const SectionFeaturesEditor: React.FC<SectionFeaturesEditorProps> = ({ sectionIndex, form }) => {
  const { control } = form;
  const { fields: featureFields, append: appendFeature, remove: removeFeature, move: moveFeature } = 
    useFieldArray({
      control,
      name: `sections.${sectionIndex}.features`,
    });

  const addFeature = () => {
    appendFeature({
      title: '',
      description: '',
      icon: '',
      display_order: featureFields.length,
      items: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-base font-medium">Features</h4>
        <Button onClick={addFeature} type="button" size="sm" variant="outline">
          <Plus className="h-3 w-3 mr-1" /> Add Feature
        </Button>
      </div>

      {featureFields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Add features to display in this section
            </p>
            <Button onClick={addFeature} type="button" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Feature
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {featureFields.map((feature, featureIndex) => (
            <Card key={feature.id} className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between">
                  <span>
                    {form.watch(`sections.${sectionIndex}.features.${featureIndex}.title`) || 
                      `Feature ${featureIndex + 1}`}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFeature(featureIndex, Math.max(0, featureIndex - 1))}
                      disabled={featureIndex === 0}
                      className="h-7 w-7 p-0"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFeature(featureIndex, Math.min(featureFields.length - 1, featureIndex + 1))}
                      disabled={featureIndex === featureFields.length - 1}
                      className="h-7 w-7 p-0"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(featureIndex)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`sections.${sectionIndex}.features.${featureIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Feature Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`sections.${sectionIndex}.features.${featureIndex}.icon`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input placeholder="LucideIcon name (e.g. Cloud)" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Use Lucide icon names like: Cloud, Shield, Code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`sections.${sectionIndex}.features.${featureIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this feature..."
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />
                
                <FeatureItemsEditor 
                  sectionIndex={sectionIndex} 
                  featureIndex={featureIndex}
                  form={form}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnologySections;
