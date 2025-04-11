
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPost } from '@/types/blog';
import { Badge } from '@/components/ui/button';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const isPublished = post.status === 'published' && post.published_at;
  const dateToUse = isPublished ? post.published_at : post.created_at;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            <Link to={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </CardTitle>
          
          {!isPublished && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Draft
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {post.excerpt ? (
          <p className="text-gray-600">{post.excerpt}</p>
        ) : (
          <p className="text-gray-600">
            {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
        )}
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500">
        {dateToUse && (
          <time dateTime={dateToUse}>
            {isPublished ? 'Published ' : 'Last modified '}
            {formatDistanceToNow(new Date(dateToUse), { addSuffix: true })}
          </time>
        )}
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
