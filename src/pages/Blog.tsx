
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useContentfulBlogPosts, ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';
import { useContentfulInit } from '@/hooks/useContentfulInit';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Blog = () => {
  const { isInitialized, error: initError } = useContentfulInit();
  const { data: posts = [], isLoading, error: postsError, refetch } = useContentfulBlogPosts({
    order: '-fields.publishDate' // Explicitly set reverse chronological order
  });

  console.log('[Blog] Contentful initialization status:', { isInitialized, error: initError?.message });
  console.log('[Blog] Posts fetch status:', { 
    isLoading, 
    postsCount: posts.length,
    postDates: posts.map(post => post.publishDate)
  });

  if (initError || postsError) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error Loading Blog Posts</AlertTitle>
            <AlertDescription>
              {initError?.message || postsError?.message || 'An unknown error occurred'}
            </AlertDescription>
          </Alert>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  if (!isInitialized || isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
        <p className="text-gray-600 mb-8 text-lg">Latest updates and insights from our team</p>
        
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No blog posts found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

const BlogPostCard = ({ post }: { post: ContentfulBlogPost }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {post.featuredImage && (
          <div className="mb-4">
            <AspectRatio ratio={16/9} className="bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={post.featuredImage.url} 
                alt={post.featuredImage.title} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        )}
        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500">
        {post.publishDate && (
          <time dateTime={post.publishDate}>
            Published {formatDistanceToNow(new Date(post.publishDate), { addSuffix: true })}
          </time>
        )}
      </CardFooter>
    </Card>
  );
};

export default Blog;
