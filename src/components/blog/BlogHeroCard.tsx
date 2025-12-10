
import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { ContentfulBlogPost } from "@/hooks/useContentfulBlogPosts";
import Image from "@/components/common/Image";
import TranslatableText from '@/components/translation/TranslatableText';

const extractPlainText = (content: any): string => {
  if (!content?.content) return '';
  
  const extractText = (node: any): string => {
    if (node.nodeType === 'text') return node.value || '';
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join('');
    }
    return '';
  };
  
  return content.content.map(extractText).join(' ').trim();
};

interface BlogHeroCardProps {
  post: ContentfulBlogPost;
}

const placeholder = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

const BlogHeroCard: React.FC<BlogHeroCardProps> = ({ post }) => {
  const imageUrl =
    post.featuredImage?.url || placeholder;

  return (
    <div className="relative bg-white rounded-2xl shadow-lg md:flex mb-10 overflow-hidden min-h-[420px]">
      <div className="md:flex-shrink-0 w-full md:w-5/12 h-64 md:h-full min-h-[280px] relative bg-muted flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.featuredImage?.title || post.title}
          className="w-full h-full"
          objectFit="contain"
        />
      </div>
      <div className="flex flex-col p-8 justify-between md:w-7/12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1 inline" />
          {post.publishDate && (
            <time dateTime={post.publishDate}>
              {new Date(post.publishDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </time>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
          <Link to={`/blog/${post.slug}`} className="hover:underline">
            <TranslatableText context="blog-listing">{post.title}</TranslatableText>
          </Link>
        </h2>
        <div className="text-gray-600 text-base mb-6 flex-1 overflow-hidden">
          <p>
            <TranslatableText context="blog-listing">
              {post.excerpt || (() => {
                const plainText = typeof post.content === 'object' 
                  ? extractPlainText(post.content)
                  : typeof post.content === 'string' 
                    ? post.content 
                    : '';
                return plainText.length > 500 
                  ? plainText.slice(0, 500) + '...' 
                  : plainText || 'No excerpt available';
              })()}
            </TranslatableText>
          </p>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center mt-auto text-primary hover:underline text-base font-medium group"
        >
          <TranslatableText context="blog-listing">Read more</TranslatableText>
          <svg
            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BlogHeroCard;
