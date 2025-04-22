
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt?: string;
  publishDate?: string;
  featuredImage?: {
    url: string;
    title: string;
  };
  author?: string;
  tags?: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const client = await getContentfulClient();
        
        // Build query parameters as an object with explicitly typed string values
        const queryParams = {
          content_type: "blogPost",
          order: "-fields.publishDate",
          limit: "10",
          skip: "0"
        };
        
        const response = await client.getEntries(queryParams);
        
        const processedPosts = response.items.map(item => {
          const fields = item.fields as any;
          
          // Process featured image if it exists
          const featuredImage = fields.featuredImage
            ? {
                url: fields.featuredImage.fields?.file?.url
                  ? `https:${fields.featuredImage.fields.file.url}`
                  : undefined,
                title: fields.featuredImage.fields?.title || ""
              }
            : undefined;
          
          // Map Contentful entry to our BlogPostItem interface
          return {
            id: item.sys.id,
            title: fields.title || "Untitled",
            slug: fields.slug || "",
            content: fields.content || {},
            excerpt: fields.excerpt || "",
            publishDate: fields.publishDate || null,
            featuredImage,
            author: fields.author || "",
            tags: fields.tags || []
          };
        });
        
        setPosts(processedPosts);
        setError(null);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError(error instanceof Error ? error : new Error('Unknown error occurred'));
        toast.error("Failed to load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
        <p className="text-gray-600 mb-8 text-lg">Latest updates and insights from our team</p>
        
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

const BlogPostCard = ({ post }: { post: BlogPostItem }) => {
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
