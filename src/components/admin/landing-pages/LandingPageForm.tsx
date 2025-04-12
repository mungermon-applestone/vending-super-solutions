
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LandingPageFormData } from '@/types/landingPage';
import BackgroundPreview from '@/components/admin/landing-pages/BackgroundPreview';

const formSchema = z.object({
  page_key: z.string().min(1, "Page key is required"),
  page_name: z.string().min(1, "Page name is required"),
  hero: z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    image_url: z.string().min(1, "Image URL is required"),
    image_alt: z.string().min(1, "Image alt text is required"),
    cta_primary_text: z.string().optional(),
    cta_primary_url: z.string().optional(),
    cta_secondary_text: z.string().optional(),
    cta_secondary_url: z.string().optional(),
    background_class: z.string().optional(),
  })
});

interface LandingPageFormProps {
  initialData?: LandingPageFormData;
  onSubmit: (data: LandingPageFormData) => void;
  isSubmitting: boolean;
}

const backgroundOptions = [
  {
    value: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
    label: 'Blue to Teal Gradient'
  },
  {
    value: 'bg-gradient-to-r from-slate-50 to-slate-100',
    label: 'Light Gray Gradient'
  },
  {
    value: 'bg-white',
    label: 'Plain White'
  },
  {
    value: 'bg-vending-blue-dark text-white',
    label: 'Dark Blue'
  },
  {
    value: 'bg-vending-teal text-white',
    label: 'Teal'
  },
];

const LandingPageForm: React.FC<LandingPageFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      page_key: '',
      page_name: '',
      hero: {
        title: '',
        subtitle: '',
        image_url: '',
        image_alt: '',
        cta_primary_text: 'Request a Demo',
        cta_primary_url: '/contact',
        cta_secondary_text: 'Explore Products',
        cta_secondary_url: '/products',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      }
    }
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data as LandingPageFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="hero">Hero Content</TabsTrigger>
            <TabsTrigger value="cta">Call to Action</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
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
          </TabsContent>
          
          <TabsContent value="hero">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hero.image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="URL of the hero image" {...field} />
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
          </TabsContent>
          
          <TabsContent value="cta">
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
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Preview how your hero section will look.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-6 rounded-lg mb-6 ${form.watch('hero.background_class')}`}>
                  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold">{form.watch('hero.title') || 'Hero Title'}</h2>
                      <p>{form.watch('hero.subtitle') || 'Hero subtitle goes here with more details about the page and what users can expect.'}</p>
                      <div className="flex flex-wrap gap-3">
                        {form.watch('hero.cta_primary_text') && (
                          <div className="bg-vending-blue text-white px-4 py-2 rounded">
                            {form.watch('hero.cta_primary_text')}
                          </div>
                        )}
                        {form.watch('hero.cta_secondary_text') && (
                          <div className="bg-white border border-gray-300 px-4 py-2 rounded">
                            {form.watch('hero.cta_secondary_text')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {form.watch('hero.image_url') ? (
                        <img 
                          src={form.watch('hero.image_url')} 
                          alt={form.watch('hero.image_alt')} 
                          className="w-full h-64 object-cover rounded" 
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Error";
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                          <p className="text-gray-500">Image Preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Landing Page"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LandingPageForm;
