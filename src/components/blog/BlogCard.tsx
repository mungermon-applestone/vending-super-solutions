
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/contentful';
import { formatDistanceToNow } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const publishedDate = post.published_date ? new Date(post.published_date) : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/blog/${post.slug}`}>
        {post.featured_image && (
          <img 
            src={post.featured_image} 
            alt={post.title} 
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
          
          {post.summary && (
            <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            {publishedDate ? (
              <span>{formatDistanceToNow(publishedDate, { addSuffix: true })}</span>
            ) : (
              <span>Draft</span>
            )}
            
            {post.category && (
              <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
