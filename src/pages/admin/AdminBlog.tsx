
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBlogPosts, useDeleteBlogPost, useCloneBlogPost } from '@/hooks/useBlogData';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BlogHeader from '@/components/admin/blog/BlogHeader';
import BlogPostTableRow from '@/components/admin/blog/BlogPostTableRow';
import DeleteBlogPostDialog from '@/components/admin/blog/DeleteBlogPostDialog';
import { BlogPost } from '@/types/blog';

const AdminBlog = () => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{id: string, title: string} | null>(null);

  // For cloning functionality
  const cloneBlogPostMutation = useCloneBlogPost();
  const [cloningPostId, setCloningPostId] = useState<string | null>(null);

  const { data: posts = [], isLoading, refetch } = useBlogPosts();
  const deleteMutation = useDeleteBlogPost();

  const handleDeleteClick = (post: BlogPost) => {
    console.log("[AdminBlog] Delete clicked for post:", post);
    setPostToDelete({
      id: post.id,
      title: post.title
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      console.log("[AdminBlog] Confirming delete for post:", postToDelete);
      await deleteMutation.mutateAsync(postToDelete.id);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      toast({
        title: "Post deleted",
        description: `${postToDelete.title} has been deleted successfully.`
      });
    } catch (error) {
      console.error('[AdminBlog] Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleClonePost = async (post: BlogPost) => {
    try {
      setCloningPostId(post.id);
      const clonedPost = await cloneBlogPostMutation.mutateAsync(post.id);
      
      if (clonedPost) {
        toast({
          title: "Post cloned",
          description: `${post.title} has been cloned successfully.`
        });
      }
    } catch (error) {
      console.error('[AdminBlog] Error cloning post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clone post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCloningPostId(null);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing...",
      description: "Refreshing blog posts data from the database",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <BlogHeader onRefresh={handleRefresh} />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="bg-white rounded-md shadow overflow-x-auto">
            <div className="p-4 border-b">
              <p className="text-sm text-gray-500">
                Showing {posts.length} post{posts.length !== 1 && 's'}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <BlogPostTableRow
                    key={post.id}
                    post={post}
                    onDeleteClick={() => handleDeleteClick(post)}
                    onCloneClick={() => handleClonePost(post)}
                    isCloningId={cloningPostId}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No blog posts found</p>
            <Button asChild>
              <Link to="/admin/blog/new">
                <Plus className="h-4 w-4 mr-2" /> Create Your First Post
              </Link>
            </Button>
          </div>
        )}

        <DeleteBlogPostDialog
          isOpen={deleteDialogOpen}
          setIsOpen={setDeleteDialogOpen}
          postToDelete={postToDelete}
          onConfirmDelete={confirmDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default AdminBlog;
