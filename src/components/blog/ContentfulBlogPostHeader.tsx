
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "@/components/common/Image";

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
      <Image
        src={getImageUrl(featuredImage)}
        alt={getImageTitle(featuredImage, title)}
        className="mb-8 w-full max-h-[320px] rounded-xl object-cover"
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
  </header>
);

export default ContentfulBlogPostHeader;
