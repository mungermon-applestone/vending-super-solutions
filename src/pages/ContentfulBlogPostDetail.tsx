
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulBlogPostBySlug } from '@/hooks/useContentfulBlogPostBySlug';
import ContentfulBlogPostContent from '@/components/blog/ContentfulBlogPostContent';
import ContentfulInitializer from '@/components/blog/ContentfulInitializer';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { Loader2 } from 'lucide-react';
import { SimpleContactCTA } from '@/components/common';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';

const ContentfulBlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <Layout>
      <ContentfulInitializer
        fallback={
          <div className="container mx-auto p-4">
            <ContentfulFallbackMessage
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
  const { data: post, isLoading, error } = useContentfulBlogPostBySlug(slug);
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
          message={`We couldn't find the blog post "${slug}" in our database.`}
          contentType="blog post"
          actionText="Return to Blog"
          actionHref="/blog"
          showAdmin={false}
        />
      </div>
    );
  }

  // Properly format the data for the ContentfulBlogPostContent component
  const adjacentPosts = {
    previous: null,
    next: null
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-12 flex-grow">
        <ContentfulBlogPostContent 
          post={post as ContentfulBlogPost} 
          previousPost={adjacentPosts.previous}
          nextPost={adjacentPosts.next}
        />
      </div>
      <SimpleContactCTA className="w-full mt-auto" />
    </div>
  );
};

export default ContentfulBlogPostDetail;
