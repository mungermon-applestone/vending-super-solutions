import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useMachineById, useCreateMachine, useUpdateMachine } from '@/hooks/useMachinesData';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';

const machineFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: "Slug must contain only lowercase letters, numbers, and hyphens."
    }),
  type: z.string().min(1, { message: "Type is required." }),
  temperature: z.string().min(1, { message: "Temperature is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  images: z.array(
    z.object({
      url: z.string().url({ message: "Please enter a valid URL." }),
      alt: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
  ).optional(),
  specs: z.array(
    z.object({
      key: z.string().min(1, { message: "Spec key is required." }),
      value: z.string().min(1, { message: "Spec value is required." }),
    })
  ).optional(),
  features: z.array(
    z.object({
      text: z.string().min(3, { message: "Feature text must be at least 3 characters." }),
    })
  ).optional(),
});

type MachineFormValues = z.infer<typeof machineFormSchema>;

const MachineEditor = () => {
  const { machineId } = useParams<{ machineId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCreating = !machineId;

  const { data: machine, isLoading } = useMachineById(machineId);
  const createMachineMutation = useCreateMachine();
  const updateMachineMutation = useUpdateMachine();
  
  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      type: '',
      temperature: '',
      description: '',
      images: [{ url: '', alt: '' }],
      specs: [{ key: '', value: '' }],
      features: [{ text: '' }],
    },
  });

  useEffect(() => {
    if (machine && !isCreating) {
      const images = machine.machine_images?.map(img => ({
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height,
      })) || [{ url: '', alt: '' }];
      
      const specs = machine.machine_specs?.map(spec => ({
        key: spec.key,
        value: spec.value,
      })) || [{ key: '', value: '' }];
      
      const features = machine.machine_features?.map(feature => ({
        text: feature.feature,
      })) || [{ text: '' }];
      
      form.reset({
        title: machine.title,
        slug: machine.slug,
        type: machine.type,
        temperature: machine.temperature,
        description: machine.description,
        images,
        specs,
        features,
      });
    }
  }, [machine, form, isCreating]);

  const onSubmit = async (data: MachineFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isCreating) {
        await createMachineMutation.mutateAsync(data);
      } else if (machineId) {
        await updateMachineMutation.mutateAsync({ id: machineId, machineData: data });
      }
      
      navigate('/admin/machines');
    } catch (error) {
      console.error('Error saving machine:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', [...currentImages, { url: '', alt: '' }]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    if (currentImages.length > 1) {
      form.setValue('images', currentImages.filter((_, i) => i !== index));
    }
  };

  const addSpec = () => {
    const currentSpecs = form.getValues('specs') || [];
    form.setValue('specs', [...currentSpecs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    const currentSpecs = form.getValues('specs') || [];
    if (currentSpecs.length > 1) {
      form.setValue('specs', currentSpecs.filter((_, i) => i !== index));
    }
  };

  const addFeature = () => {
    const currentFeatures = form.getValues('features') || [];
    form.setValue('features', [...currentFeatures, { text: '' }]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features') || [];
    if (currentFeatures.length > 1) {
      form.setValue('features', currentFeatures.filter((_, i) => i !== index));
    }
  };

  if (isLoading && !isCreating) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {isCreating ? "Add New Machine" : `Edit Machine: ${machine?.title}`}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Machine Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter machine title" {...field} />
                          </FormControl>
                          <FormDescription>The display name for this machine.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="machine-slug" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL-friendly identifier (e.g., option-4-refrigerated)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Machine Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select machine type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="vending">Vending</SelectItem>
                                <SelectItem value="locker">Locker</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select temperature" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ambient">Ambient</SelectItem>
                                <SelectItem value="refrigerated">Refrigerated</SelectItem>
                                <SelectItem value="frozen">Frozen</SelectItem>
                                <SelectItem value="multi">Multi-temp</SelectItem>
                                <SelectItem value="controlled">Temperature Controlled</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter machine description"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Images</h2>
                      <Button type="button" variant="outline" size="sm" onClick={addImage}>
                        <Plus className="h-4 w-4 mr-2" /> Add Image
                      </Button>
                    </div>
                    
                    {form.watch('images')?.map((_, index) => (
                      <div key={index} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Image {index + 1}</h3>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeImage(index)}
                            disabled={form.watch('images')?.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`images.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`images.${index}.alt`}
                          render={({ field }) => (
                            <FormItem className="mt-2">
                              <FormLabel>Alt Text</FormLabel>
                              <FormControl>
                                <Input placeholder="Image description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Specifications</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                      <Plus className="h-4 w-4 mr-2" /> Add Specification
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {form.watch('specs')?.map((_, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Spec {index + 1}</h3>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeSpec(index)}
                            disabled={form.watch('specs')?.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name={`specs.${index}.key`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Key</FormLabel>
                                <FormControl>
                                  <Input placeholder="Dimensions" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`specs.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                  <Input placeholder='72" x 80" x 35"' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Features</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="h-4 w-4 mr-2" /> Add Feature
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {form.watch('features')?.map((_, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Feature {index + 1}</h3>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFeature(index)}
                            disabled={form.watch('features')?.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`features.${index}.text`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feature Text</FormLabel>
                              <FormControl>
                                <Input placeholder="Touchscreen interface" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/machines')}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isCreating ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    isCreating ? "Create Machine" : "Update Machine"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default MachineEditor;
