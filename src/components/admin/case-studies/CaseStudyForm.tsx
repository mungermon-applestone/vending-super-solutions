import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import MediaSelector from '@/components/admin/media/MediaSelector';
import { CaseStudyFormData } from '@/types/caseStudy';
import { useNavigate } from 'react-router-dom';

interface CaseStudyFormProps {
  initialData?: CaseStudyFormData;
  onSubmit: (data: CaseStudyFormData) => Promise<void>;
  isSubmitting: boolean;
  isEditing?: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().min(1, 'Summary is required'),
  content: z.string().min(1, 'Content is required'),
  solution: z.string().min(1, 'Solution is required'),
  industry: z.string().optional(),
  image_url: z.string().optional(),
  image_alt: z.string().optional(),
  visible: z.boolean().default(true),
  results: z.array(z.object({
    text: z.string().min(1, 'Result text is required'),
  })),
  testimonial: z.object({
    quote: z.string().optional(),
    author: z.string().optional(),
    company: z.string().optional(),
    position: z.string().optional(),
  }),
});

const CaseStudyForm: React.FC<CaseStudyFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  
  const defaultValues = initialData || {
    title: '',
    slug: '',
    summary: '',
    content: '',
    solution: '',
    industry: '',
    image_url: '',
    image_alt: '',
    visible: true,
    results: [{ text: '' }],
    testimonial: {
      quote: '',
      author: '',
      company: '',
      position: '',
    },
  };

  const form = useForm<CaseStudyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const results = form.watch('results');

  const addResult = () => {
    const currentResults = form.getValues('results');
    form.setValue('results', [...currentResults, { text: '' }]);
  };

  const removeResult = (index: number) => {
    const currentResults = form.getValues('results');
    form.setValue(
      'results',
      currentResults.filter((_, i) => i !== index)
    );
  };

  const handleTitleChange = (title: string) => {
    if (!isEditing && !form.getValues('slug')) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slug);
    }
  };

  const handleCancel = () => {
    navigate('/admin/case-studies');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter case study title" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          handleTitleChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="enter-slug-here" {...field} />
                    </FormControl>
                    <FormDescription>
                      Used in the URL: /case-studies/your-slug
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Healthcare, Technology, Education" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Visible</FormLabel>
                      <FormDescription>
                        Show this case study on the website
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of the case study" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A short description that appears in listings and previews
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Full case study content" 
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="solution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solution</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the solution implemented for this case" 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Explain what solution was implemented to address the client's needs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Featured Image</h3>
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <MediaSelector
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="mt-4">
              <FormField
                control={form.control}
                name="image_alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Alt Text</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Descriptive text for the image" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Results</h3>
              <Button type="button" variant="outline" size="sm" onClick={addResult}>
                <Plus className="h-4 w-4 mr-2" /> Add Result
              </Button>
            </div>
            
            {results.map((_, index) => (
              <div key={index} className="flex items-start gap-2 mb-3">
                <FormField
                  control={form.control}
                  name={`results.${index}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder="e.g., 30% improvement in satisfaction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {results.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeResult(index)}
                    className="mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Testimonial</h3>
            
            <FormField
              control={form.control}
              name="testimonial.quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Client testimonial quote" 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-4 mt-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="testimonial.author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of person" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="testimonial.position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="testimonial.company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Organization name" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Create'} Case Study
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CaseStudyForm;
