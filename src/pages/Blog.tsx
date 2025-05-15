
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
    limit: 10,
    skip: 0
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
        <h1 className="text-4xl font-bold mb-2">Updates</h1>
        <p className="text-gray-600 mb-8 text-lg">The latest news, product notes, and insights from our team</p>
        
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id || post.sys?.id} post={post} />
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
  // Extract title safely from various possible formats
  const title = typeof post.title === 'string' ? post.title : 
    (post.fields?.title || 'Untitled Post');
  
  // Extract slug safely
  const slug = post.slug || post.fields?.slug || '';
  
  // Extract excerpt safely
  const excerpt = post.excerpt || post.fields?.excerpt || '';
  
  // Get publish date from various possible formats
  const publishDate = post.publishDate || post.fields?.publishDate || post.published_at || '';
  
  // Handle featured image in different formats
  const featuredImage = post.featuredImage || 
    (post.fields?.featuredImage ? {
      url: `https:${post.fields.featuredImage.fields?.file?.url || ''}`,
      title: post.fields.featuredImage.fields?.title || '',
    } : undefined);

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {featuredImage && featuredImage.url && (
          <div className="mb-4">
            <AspectRatio ratio={16/9} className="bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={featuredImage.url} 
                alt={featuredImage.title || title} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        )}
        <p className="text-gray-600 line-clamp-3">{excerpt}</p>
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500">
        {publishDate && (
          <time dateTime={publishDate}>
            Published {formatDistanceToNow(new Date(publishDate), { addSuffix: true })}
          </time>
        )}
      </CardFooter>
    </Card>
  );
};

export default Blog;
