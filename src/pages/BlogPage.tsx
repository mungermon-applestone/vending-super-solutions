
import React from 'react';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useContentfulBlogPageContent } from '@/hooks/useContentfulBlogPageContent';
import { useBlogPosts } from '@/hooks/useBlogData';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';

const BlogPage: React.FC = () => {
  const { data: pageContent, isLoading: isLoadingContent, error: contentError } = useContentfulBlogPageContent();
  const { data: blogPosts = [], isLoading: isLoadingPosts, error: postsError } = useBlogPosts({ 
    status: 'published',
    limit: 9
  });

  const isLoading = isLoadingContent || isLoadingPosts;
  const error = contentError || postsError;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">
            {pageContent?.introTitle || "Our Blog"}
          </h1>
          <p className="text-lg text-gray-600">
            {pageContent?.introDescription || "Insights, news, and updates from our team."}
          </p>
        </div>

        {/* Blog Posts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-8">
            {pageContent?.latestArticlesTitle || "Latest Articles"}
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error loading blog posts</h3>
              <p className="text-red-600">{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No blog posts found. Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        {pageContent?.newsletterTitle && (
          <div className="mt-20 py-12 px-8 bg-gray-50 rounded-lg">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">{pageContent.newsletterTitle}</h2>
              <p className="text-gray-600 mb-6">{pageContent.newsletterDescription}</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={pageContent.newsletterPlaceholder || "Your email address"}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="submit">
                  {pageContent.newsletterButtonText || "Subscribe"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogPage;
