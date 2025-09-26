
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TranslatableText from '@/components/translation/TranslatableText';

interface AdjacentBlogPost {
  slug: string;
  title: string;
}
interface ContentfulBlogPostFooterProps {
  previousPost?: AdjacentBlogPost | null;
  nextPost?: AdjacentBlogPost | null;
}

const ContentfulBlogPostFooter: React.FC<ContentfulBlogPostFooterProps> = ({
  previousPost,
  nextPost,
}) => (
  <footer className="pt-8 border-t border-gray-200">
    <div className="flex justify-between items-center">
      {previousPost ? (
        <Button variant="outline" asChild>
          <Link to={`/blog/${previousPost.slug}`} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              <TranslatableText context="blog-article-nav">Previous:</TranslatableText>
            </span> 
            <TranslatableText context="blog-article-nav">{previousPost.title}</TranslatableText>
          </Link>
        </Button>
      ) : <div></div>}
      {nextPost ? (
        <Button variant="outline" asChild>
          <Link to={`/blog/${nextPost.slug}`} className="flex items-center">
            <span className="hidden md:inline">
              <TranslatableText context="blog-article-nav">Next:</TranslatableText>
            </span> 
            <TranslatableText context="blog-article-nav">{nextPost.title}</TranslatableText>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      ) : <div></div>}
    </div>
  </footer>
);

export default ContentfulBlogPostFooter;
