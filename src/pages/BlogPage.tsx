
import React from "react";
import Layout from "@/components/layout/Layout";
import { useContentfulBlogPosts } from "@/hooks/useContentfulBlogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import BlogHeroCard from "@/components/blog/BlogHeroCard";
import Image from "@/components/common/Image";
import ContentfulErrorBoundary from "@/components/common/ContentfulErrorBoundary";
import ContentfulFallbackMessage from "@/components/common/ContentfulFallbackMessage";
import ContentfulInitializer from "@/components/contentful/ContentfulInitializer";
import { SimpleContactCTA } from "@/components/common";
import { ContentfulBlogPost } from "@/hooks/useContentfulBlogPosts";

const BlogPage: React.FC = () => {
  return (
    <Layout>
      <ContentfulInitializer
        fallback={
          <div className="container mx-auto p-4">
            <ContentfulFallbackMessage
              message="We're having trouble loading the blog content. Please configure Contentful in the Admin area."
              contentType="blog"
              showRefresh={true}
            />
          </div>
        }
      >
        <BlogPageContent />
      </ContentfulInitializer>
    </Layout>
  );
};

const BlogPageContent: React.FC = () => {
  const { 
    data: blogPosts = [], 
    isLoading: isLoadingPosts,
    error: postsError 
  } = useContentfulBlogPosts();

  // Enhanced logging for debugging
  React.useEffect(() => {
    console.log("[BlogPageContent] Current state:", {
      blogPosts,
      totalPosts: blogPosts?.length || 0,
      postDates: blogPosts?.map(post => post.publishDate)
    });
  }, [blogPosts]);

  if (isLoadingPosts) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="container mx-auto p-4">
        <ContentfulFallbackMessage
          message="We're having trouble loading the blog content. Please try again later."
          contentType="blog"
          showRefresh={true}
        />
      </div>
    );
  }

  // Process blog posts to ensure they have the needed properties
  const processedPosts = blogPosts.map(post => {
    const title = typeof post.title === 'string' ? post.title : 
      (post.fields?.title || 'Untitled Post');
    const slug = post.slug || post.fields?.slug || '';
    const excerpt = post.excerpt || post.fields?.excerpt || '';
    const publishDate = post.publishDate || post.fields?.publishDate || post.published_at || '';
    const featuredImage = post.featuredImage || 
      (post.fields?.featuredImage ? {
        url: `https:${post.fields.featuredImage.fields?.file?.url || ''}`,
        title: post.fields.featuredImage.fields?.title || ''
      } : undefined);
      
    return {
      ...post,
      title,
      slug,
      excerpt,
      publishDate,
      featuredImage
    } as ContentfulBlogPost;
  });

  // Safely handle blog posts data - ensure they're ordered by publishDate
  const latestPost = processedPosts && processedPosts.length > 0 ? processedPosts[0] : null;
  const olderPosts = processedPosts && processedPosts.length > 1 ? processedPosts.slice(1) : [];

  return (
    <ContentfulErrorBoundary contentType="blog">
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-5">Our Blog</h1>
            <p className="text-lg text-gray-600">
              Insights, news, and updates from our team.
            </p>
          </div>

          {latestPost && (
            <div className="mb-12">
              <BlogHeroCard post={latestPost} />
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
            
            {olderPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {olderPosts.map((post) => (
                  <Card key={post.id || post.sys?.id} className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
                    {post.featuredImage?.url && (
                      <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.title || String(post.title)}
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
        </div>
        
        {/* Full-width SimpleContactCTA placed outside the container */}
        <SimpleContactCTA 
          title="Want to learn more about our vending solutions?" 
          description="Subscribe to our newsletter or reach out directly with your questions."
          className="w-full mt-auto"
          formType="Blog Page Inquiry"
          formVariant="inline"
        />
      </div>
    </ContentfulErrorBoundary>
  );
};

export default BlogPage;
