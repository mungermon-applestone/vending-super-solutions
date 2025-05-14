
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import BlogPostContent from '@/components/blog/BlogPostContent';
import ContentfulBlogPostContent from '@/components/blog/ContentfulBlogPostContent';
import { useBlogPostBySlug, useAdjacentPosts } from '@/hooks/useBlogData';
import { SimpleContactCTA } from '@/components/common';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';

// Helper function to convert adjacent posts to the format expected by ContentfulBlogPostContent
const convertAdjacentPostToContentful = (post: any) => {
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title
  };
};

// Convert Contentful blog post to compatible BlogPost format
const convertContentfulBlogPostToBlogPost = (contentfulPost: ContentfulBlogPost | null) => {
  if (!contentfulPost) return null;
  
  return {
    id: contentfulPost.id,
    title: contentfulPost.title,
    slug: contentfulPost.slug,
    content: contentfulPost.content,
    excerpt: contentfulPost.excerpt,
    status: 'published',
    published_at: contentfulPost.publishDate || contentfulPost.published_at,
    created_at: contentfulPost.created_at || '',
    updated_at: contentfulPost.updated_at || '',
    featuredImage: contentfulPost.featuredImage,
    author: contentfulPost.author,
    tags: contentfulPost.tags
  };
};

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading: isLoadingPost, error } = useBlogPostBySlug(slug);
  const { data: adjacentPosts, isLoading: isLoadingAdjacent } = useAdjacentPosts(slug);
  
  const isLoading = isLoadingPost || isLoadingAdjacent;
  
  // Convert Contentful blog post to compatible format if needed
  const compatiblePost = post ? convertContentfulBlogPostToBlogPost(post) : null;
  
  // Handle 404 for non-existent or non-published posts
  React.useEffect(() => {
    if (!isLoading && (!post || (compatiblePost?.status !== 'published' && !window.location.pathname.includes('/admin')))) {
      navigate('/not-found', { replace: true });
    }
  }, [post, compatiblePost, isLoading, navigate]);

  // Convert adjacent posts to Contentful format for ContentfulBlogPostContent
  const contentfulPreviousPost = adjacentPosts?.previous 
    ? convertAdjacentPostToContentful(adjacentPosts.previous)
    : null;
  
  const contentfulNextPost = adjacentPosts?.next
    ? convertAdjacentPostToContentful(adjacentPosts.next)
    : null;

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
            post.fields ? (
              <ContentfulBlogPostContent 
                post={post} 
                previousPost={contentfulPreviousPost} 
                nextPost={contentfulNextPost} 
              />
            ) : (
              <BlogPostContent 
                post={compatiblePost} 
                previousPost={adjacentPosts?.previous} 
                nextPost={adjacentPosts?.next} 
              />
            )
          ) : null}
        </div>
        
        {/* Full-width SimpleContactCTA at the bottom */}
        <SimpleContactCTA 
          className="w-full mt-auto"
          title="Have Questions About This Article?"
          description="Our team is ready to help you implement these insights in your business."
          formType={`Blog Post: ${compatiblePost?.title || post?.fields?.title || slug}`}
          initialValues={{
            subject: `Question about: ${compatiblePost?.title || post?.fields?.title || slug}`
          }}
        />
      </div>
    </Layout>
  );
};

export default BlogPostDetail;
