
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "@/components/common/Image";
import TranslatableText from '@/components/translation/TranslatableText';

interface ContentfulBlogPostHeaderProps {
  title: string;
  publishDate?: string;
  featuredImage?: any;
  excerpt?: string;
}

const getImageUrl = (image: any): string => {
  if (!image?.fields?.file?.url) return "";
  return image.fields.file.url as string;
};

const getImageTitle = (image: any, fallback: string): string => {
  if (!image?.fields?.title) return fallback || "Blog image";
  return image.fields.title as string;
};

const ContentfulBlogPostHeader: React.FC<ContentfulBlogPostHeaderProps> = ({
  title,
  publishDate,
  featuredImage,
  excerpt,
}) => (
  <header className="mb-8">
    {featuredImage && (
      <div className="mb-8 w-full h-[320px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <Image
          src={getImageUrl(featuredImage)}
          alt={getImageTitle(featuredImage, title)}
          className="w-full h-full"
          objectFit="contain"
        />
      </div>
    )}
    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
      <TranslatableText context="blog-article-title">{title}</TranslatableText>
    </h1>
    <div className="flex items-center text-gray-500 mb-4">
      {publishDate ? (
        <time dateTime={publishDate}>
          <TranslatableText context="blog-article-meta">Published</TranslatableText> {formatDistanceToNow(new Date(publishDate), { addSuffix: true })}
        </time>
      ) : (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
          <TranslatableText context="blog-article-meta">Draft</TranslatableText>
        </span>
      )}
    </div>
  </header>
);

export default ContentfulBlogPostHeader;
