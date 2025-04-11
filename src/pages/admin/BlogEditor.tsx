
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { useBlogPostBySlug, useCreateBlogPost, useUpdateBlogPost } from '@/hooks/useBlogData';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';
import { BlogPostFormData } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

const BlogEditor = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // A post is in edit mode if postId exists and is not 'new'
  const isEditMode = !!postId && postId !== 'new';
  const isCreating = !isEditMode;
  
  console.log('[BlogEditor] Post ID from URL:', postId);
  console.log('[BlogEditor] Is edit mode:', isEditMode);

  const { data: post, isLoading } = useBlogPostBySlug(isEditMode ? postId : undefined);
  const createPostMutation = useCreateBlogPost();
  const updatePostMutation = useUpdateBlogPost();
  
  const handleFormSubmit = async (data: BlogPostFormData) => {
    try {
      console.log('[BlogEditor] Form submitted with data:', data);
      
      if (isCreating) {
        console.log('[BlogEditor] Creating new post');
        await createPostMutation.mutateAsync(data);
        toast({
          title: data.status === 'published' ? "Post published" : "Draft saved",
          description: data.status === 'published' 
            ? "Your blog post has been published successfully." 
            : "Your blog post draft has been saved.",
        });
      } else if (postId && post?.id) {
        console.log('[BlogEditor] Updating post:', post.id);
        await updatePostMutation.mutateAsync({ id: post.id, postData: data });
        toast({
          title: data.status === 'published' ? "Post updated and published" : "Draft updated",
          description: data.status === 'published' 
            ? "Your blog post has been updated and published." 
            : "Your blog post draft has been updated.",
        });
      }
      
      navigate('/admin/blog');
    } catch (error) {
      console.error('[BlogEditor] Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
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
            {isCreating ? "Create New Blog Post" : `Edit Post: ${post?.title}`}
          </h1>
        </div>

        <BlogPostForm 
          post={post} 
          isCreating={isCreating} 
          onSubmit={handleFormSubmit} 
          isSaving={createPostMutation.isPending || updatePostMutation.isPending} 
        />
      </div>
    </Layout>
  );
};

export default BlogEditor;
