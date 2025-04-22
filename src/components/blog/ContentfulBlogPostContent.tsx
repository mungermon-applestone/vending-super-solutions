
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ContentfulBlogPost } from "@/hooks/useContentfulBlogPostBySlug";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "@/components/common/Image";

interface AdjacentBlogPost {
  slug: string;
  title: string;
}

interface ContentfulBlogPostContentProps {
  post: ContentfulBlogPost;
  previousPost?: AdjacentBlogPost | null;
  nextPost?: AdjacentBlogPost | null;
}

const ContentfulBlogPostContent: React.FC<ContentfulBlogPostContentProps> = ({
  post,
  previousPost,
  nextPost,
}) => {
  const { title, content, excerpt, publishDate, featuredImage } = post.fields;

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        {featuredImage?.fields?.file?.url && (
          <Image
            src={featuredImage.fields.file.url}
            alt={featuredImage.fields.title || title}
            className="mb-6 w-full max-h-[320px] rounded-xl object-cover"
          />
        )}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
        <div className="flex items-center text-gray-500 mb-4">
          {publishDate ? (
            <time dateTime={publishDate}>
              Published {formatDistanceToNow(new Date(publishDate), { addSuffix: true })}
            </time>
          ) : (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Draft</span>
          )}
        </div>
        {excerpt && (
          <p className="text-lg text-gray-600 italic">{excerpt}</p>
        )}
      </header>
      <div className="prose max-w-none prose-slate mb-12">
        {/* Contentful rich text to React */}
        {content
          ? documentToReactComponents(content as any)
          : <p>No content available for this blog post.</p>}
      </div>
      <footer className="pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          {previousPost ? (
            <Button variant="outline" asChild>
              <Link to={`/blog/${previousPost.slug}`} className="flex items-center">
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Previous:</span> {previousPost.title}
              </Link>
            </Button>
          ) : <div></div>}
          {nextPost ? (
            <Button variant="outline" asChild>
              <Link to={`/blog/${nextPost.slug}`} className="flex items-center">
                <span className="hidden md:inline">Next:</span> {nextPost.title}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : <div></div>}
        </div>
      </footer>
    </article>
  );
};

export default ContentfulBlogPostContent;
