
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost, BlogPostFormData } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

interface BlogPostFormProps {
  post?: BlogPost | null;
  isCreating: boolean;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  isSaving: boolean;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  post,
  isCreating,
  onSubmit,
  isSaving,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDraft, setIsDraft] = useState(true);
  
  const form = useForm<BlogPostFormData>({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      status: post?.status || 'draft',
    },
  });
  
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        status: post.status,
      });
      
      setIsDraft(post.status === 'draft');
    }
  }, [post, form]);
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Only auto-generate slug if we're creating a new post and slug is empty or was auto-generated
    if (isCreating && (!form.getValues('slug') || form.getValues('slug') === generateSlug(form.getValues('title')))) {
      form.setValue('slug', generateSlug(title));
    }
  };
  
  const handleSave = async (status: 'draft' | 'published') => {
    try {
      // Check for required fields manually
      const title = form.getValues('title');
      const slug = form.getValues('slug');
      const content = form.getValues('content');
      
      if (!title) {
        form.setError('title', { message: 'Title is required' });
        toast({
          title: "Missing required fields",
          description: "Please provide a title for your post.",
          variant: "destructive",
        });
        return;
      }
      
      if (!slug) {
        form.setError('slug', { message: 'Slug is required' });
        toast({
          title: "Missing required fields",
          description: "Please provide a slug for your post.",
          variant: "destructive",
        });
        return;
      }
      
      if (!content) {
        form.setError('content', { message: 'Content is required' });
        toast({
          title: "Missing required fields",
          description: "Please provide content for your post.",
          variant: "destructive",
        });
        return;
      }
      
      // Get all form values
      const data = form.getValues();
      
      // Update status to match the button clicked
      data.status = status;
      setIsDraft(status === 'draft');
      
      console.log("Submitting form data:", data);
      await onSubmit(data);
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-8">
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter post title" 
                        {...field}
                        onChange={handleTitleChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                rules={{ required: "Slug is required" }}
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="enter-url-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used in the post URL: /blog/your-slug
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of the post (optional)" 
                        className="resize-y h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short summary that appears in the blog listing.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="content"
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your post content here..." 
                        className="min-h-[300px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Supports HTML for formatting. You can add headings, lists, links, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/blog')}
              disabled={isSaving}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
            >
              {isSaving && isDraft ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save as Draft
            </Button>
            
            <Button
              type="button"
              variant="default"
              onClick={() => handleSave('published')}
              disabled={isSaving}
            >
              {isSaving && !isDraft ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <></>
              )}
              Publish
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default BlogPostForm;
