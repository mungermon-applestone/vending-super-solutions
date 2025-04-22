
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useContentfulBlogPosts, ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Blog = () => {
  const { data: posts = [], isLoading, error } = useContentfulBlogPosts();

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6">Our Blog</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-8">
            <p className="text-red-600">Error loading blog posts. Please try again later.</p>
          </div>
        ) : posts.length > 0 ? (
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
    <Card className="h-full flex flex-col">
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
            <img 
              src={post.featuredImage.url} 
              alt={post.featuredImage.title} 
              className="w-full h-48 object-cover rounded-md"
            />
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
