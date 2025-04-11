
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
  
  const handleSaveDraft = () => {
    form.setValue('status', 'draft');
    setIsDraft(true);
    form.handleSubmit(async (data) => {
      try {
        await onSubmit({
          ...data,
          status: 'draft',
        });
        toast({
          title: "Draft saved",
          description: "Your blog post has been saved as a draft.",
        });
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    })();
  };
  
  const handlePublish = () => {
    form.setValue('status', 'published');
    setIsDraft(false);
    form.handleSubmit(async (data) => {
      try {
        await onSubmit({
          ...data,
          status: 'published',
        });
        toast({
          title: "Post published",
          description: "Your blog post has been published.",
        });
      } catch (error) {
        console.error("Error publishing post:", error);
      }
    })();
  };
  
  return (
    <Form {...form}>
      <form>
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
              onClick={handleSaveDraft}
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
              onClick={handlePublish}
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
