
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPost } from '@/types/contentful';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.published_date
    ? formatDistanceToNow(new Date(post.published_date), { addSuffix: true })
    : 'Unpublished';
  
  const truncatedSummary = post.summary && post.summary.length > 160 
    ? `${post.summary.substring(0, 160)}...` 
    : post.summary;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          {post.author && (
            <span className="mr-2">{post.author}</span>
          )}
          <span className="mr-2">•</span>
          <span>{formattedDate}</span>
          {post.reading_time && (
            <>
              <span className="mx-2">•</span>
              <span>{post.reading_time} min read</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {post.featured_image && (
          <div className="mb-4">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
        )}
        <p className="text-muted-foreground">
          {truncatedSummary || "No summary available for this post."}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link to={`/blog/${post.slug}`}>
            Read More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BlogCard;
