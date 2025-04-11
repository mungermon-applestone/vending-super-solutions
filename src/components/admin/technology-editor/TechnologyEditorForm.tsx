import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateSlug } from '@/lib/utils';
import { UseToast } from '@/hooks/use-toast';
import TechnologyImage from './sections/TechnologyImage';

interface TechnologyFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  image_alt: z.string().optional(),
  content: z.string().optional(),
});

const TechnologyEditorForm: React.FC<TechnologyFormProps> = ({ initialData, onSave, isLoading }) => {
  const { toast } = UseToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      description: '',
      image_url: '',
      image_alt: '',
      content: '',
    },
    mode: "onChange"
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSave(values);
      toast({
        title: "Success!",
        description: "Technology saved successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Failed to save technology.",
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Technology Title" {...form.register("title", {
                onChange: (e) => {
                  // Set slug based on title
                  form.setValue("slug", generateSlug(e.target.value));
                },
              })} />
              {errors?.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="technology-slug" {...form.register("slug")} readOnly />
              {errors?.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Technology Description" {...form.register("description")} />
              {errors?.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <TechnologyImage form={form} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="content">Content</Label>
            <Input id="content" placeholder="Technology Content" {...form.register("content")} />
            {errors?.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Technology"}
        </Button>
      </div>
    </form>
  );
};

export default TechnologyEditorForm;
