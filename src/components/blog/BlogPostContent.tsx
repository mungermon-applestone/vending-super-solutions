import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BlogPostContentProps {
  post: BlogPost;
  previousPost?: BlogPost | null;
  nextPost?: BlogPost | null;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ 
  post, 
  previousPost, 
  nextPost 
}) => {
  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-500 mb-4">
          {post.status === 'published' && post.published_at ? (
            <time dateTime={post.published_at}>
              Published {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
            </time>
          ) : (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Draft</span>
          )}
        </div>
      </header>
      
      <div className="prose max-w-none prose-slate">
        <div dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(post.content, {
            ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'blockquote', 'img', 'br', 'hr', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
            ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class'],
            ALLOW_DATA_ATTR: false
          })
        }} />
      </div>
      
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          {previousPost ? (
            <Button variant="outline" asChild>
              <Link to={`/blog/${previousPost.slug}`} className="flex items-center">
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Previous:</span> {previousPost.title}
              </Link>
            </Button>
          ) : (
            <div></div>
          )}
          
          {nextPost ? (
            <Button variant="outline" asChild>
              <Link to={`/blog/${nextPost.slug}`} className="flex items-center">
                <span className="hidden md:inline">Next:</span> {nextPost.title}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </footer>
    </article>
  );
};

export default BlogPostContent;
