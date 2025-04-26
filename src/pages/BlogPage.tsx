
import React from "react";
import { Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useContentfulBlogPageContent } from "@/hooks/useContentfulBlogPageContent";
import { useContentfulBlogPosts } from "@/hooks/useContentfulBlogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import BlogHeroCard from "@/components/blog/BlogHeroCard";
import Image from "@/components/common/Image";
import InquiryForm from "@/components/machines/contact/InquiryForm";
import ContentfulErrorBoundary from "@/components/common/ContentfulErrorBoundary";

const BlogPage: React.FC = () => {
  const { 
    data: pageContent, 
    isLoading: isLoadingContent, 
    error: contentError 
  } = useContentfulBlogPageContent();
  
  const { 
    data: blogPosts = [], 
    isLoading: isLoadingPosts, 
    error: postsError 
  } = useContentfulBlogPosts({ 
    limit: 9,
    order: "-fields.publishDate" 
  });

  const isLoading = isLoadingContent || isLoadingPosts;
  const error = contentError || postsError;

  // Enhanced logging for debugging
  React.useEffect(() => {
    console.log("Blog posts data state:", {
      blogPosts,
      pageContent,
      isLoading,
      contentError,
      postsError,
      totalPosts: blogPosts?.length || 0
    });
  }, [blogPosts, pageContent, isLoading, contentError, postsError]);

  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </Layout>
    );
  }

  // Handle error state with more detail
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-8">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error loading blog content</h2>
            <p className="text-red-600">{error instanceof Error ? error.message : 'An error occurred loading the blog'}</p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 p-2 bg-red-100 rounded text-xs overflow-auto">
                {JSON.stringify({ contentError, postsError }, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Safely handle blog posts data
  const latestPost = blogPosts && blogPosts.length > 0 ? blogPosts[0] : null;
  const olderPosts = blogPosts && blogPosts.length > 1 ? blogPosts.slice(1) : [];

  return (
    <Layout>
      <ContentfulErrorBoundary contentType="blog">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-5">
              {pageContent?.introTitle || "Our Blog"}
            </h1>
            <p className="text-lg text-gray-600">
              {pageContent?.introDescription || "Insights, news, and updates from our team."}
            </p>
          </div>

          {latestPost && (
            <div className="mb-12">
              <BlogHeroCard post={latestPost} />
            </div>
          )}

          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8">
              {pageContent?.latestArticlesTitle || "Latest Articles"}
            </h2>
            
            {olderPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {olderPosts.map((post) => (
                  <Card key={post.id} className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
                    {post.featuredImage?.url && (
                      <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.title || post.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-lg leading-tight mb-1">
                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow px-4 py-1">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.excerpt || 'Read more about this post...'}
                      </p>
                    </CardContent>
                    {post.publishDate && (
                      <CardFooter className="px-4 pb-3 pt-0 flex items-center gap-2 text-xs text-gray-500">
                        <time dateTime={post.publishDate}>
                          {format(new Date(post.publishDate), "MMM d, yyyy")}
                        </time>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            ) : !latestPost ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">We're working on creating great content for you!</p>
                <Button asChild variant="outline">
                  <Link to="/">Return to Homepage</Link>
                </Button>
              </div>
            ) : null}
          </div>

          <InquiryForm title="Ready to transform your vending operations?" />
        </div>
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default BlogPage;
