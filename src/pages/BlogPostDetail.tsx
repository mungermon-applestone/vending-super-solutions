
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import BlogPostContent from '@/components/blog/BlogPostContent';
import { useBlogPostBySlug, useAdjacentPosts } from '@/hooks/useBlogData';
import { SimpleContactCTA } from '@/components/common';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading: isLoadingPost, error } = useBlogPostBySlug(slug);
  const { data: adjacentPosts, isLoading: isLoadingAdjacent } = useAdjacentPosts(slug);
  
  const isLoading = isLoadingPost || isLoadingAdjacent;
  
  // Handle 404 for non-existent or non-published posts
  React.useEffect(() => {
    if (!isLoading && (!post || (post.status !== 'published' && !window.location.pathname.includes('/admin')))) {
      navigate('/not-found', { replace: true });
    }
  }, [post, isLoading, navigate]);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto py-12 flex-grow">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500">Something went wrong. Please try again later.</p>
            </div>
          ) : post ? (
            <BlogPostContent 
              post={post} 
              previousPost={adjacentPosts?.previous} 
              nextPost={adjacentPosts?.next} 
            />
          ) : null}
        </div>
        
        {/* Full-width SimpleContactCTA at the bottom */}
        <SimpleContactCTA 
          className="w-full mt-auto"
          title="Have Questions About This Article?"
          description="Our team is ready to help you implement these insights in your business."
          formType={`Blog Post: ${post?.title || slug}`}
          initialValues={{
            subject: `Question about: ${post?.title || slug}`
          }}
        />
      </div>
    </Layout>
  );
};

export default BlogPostDetail;
