
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulBlogPostBySlug } from '@/hooks/useContentfulBlogPostBySlug';
import ContentfulBlogPostContent from '@/components/blog/ContentfulBlogPostContent';
import ContentfulInitializer from '@/components/blog/ContentfulInitializer';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { Loader2 } from 'lucide-react';

const ContentfulBlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  return (
    <Layout>
      <ContentfulInitializer
        fallback={
          <div className="container mx-auto p-4">
            <ContentfulFallbackMessage
              title="Blog Post Not Available"
              message="We're having trouble loading this blog post. Please check your Contentful configuration."
              contentType="blog post"
              showRefresh={true}
              actionText="View All Blog Posts"
              actionHref="/blog"
            />
          </div>
        }
      >
        <BlogPostContent slug={slug} />
      </ContentfulInitializer>
    </Layout>
  );
};

const BlogPostContent = ({ slug }: { slug: string | undefined }) => {
  const { data: post, isLoading, error } = useContentfulBlogPostBySlug({ slug });
  const navigate = useNavigate();
  
  React.useEffect(() => {
    console.log("[BlogPostContent] Content loaded:", {
      slug,
      post: post?.sys?.id,
      loading: isLoading,
      error: error?.message
    });
    
    // Handle 404 for non-existent posts after loading
    if (!isLoading && !error && !post) {
      console.log("[BlogPostContent] Post not found, navigating to 404");
      navigate('/not-found', { replace: true });
    }
  }, [post, isLoading, error, navigate, slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <ContentfulFallbackMessage
          title="Error Loading Blog Post"
          message={error instanceof Error ? error.message : 'An unknown error occurred'}
          contentType="blog post"
          actionText="Return to Blog"
          actionHref="/blog"
          showAdmin={false}
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12">
        <ContentfulFallbackMessage
          title="Blog Post Not Found"
          message={`We couldn't find the blog post "${slug}" in our database.`}
          contentType="blog post"
          actionText="Return to Blog"
          actionHref="/blog"
          showAdmin={false}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <ContentfulBlogPostContent post={post} />
    </div>
  );
};

export default ContentfulBlogPostDetail;
