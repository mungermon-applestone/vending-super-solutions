
import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  isThumbnail?: boolean;
}

const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  objectFit = 'cover',
  aspectRatio,
  isThumbnail = false,
  loading = 'lazy',
  fetchPriority = 'auto',
  ...props 
}) => {
  // Apply object fit class based on the prop
  const objectFitClass = `object-${objectFit}`;
  
  // Check if image URL is valid
  const isValidUrl = src && (src.startsWith('http') || src.startsWith('//') || src.startsWith('/'));
  
  // Process URL to ensure it has proper protocol
  let imageUrl = isValidUrl ? src : "https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80";
  
  // Add https: if the URL starts with // (protocol-relative URL)
  if (imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }
  
  // Apply aspect ratio style if provided
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : {};
  
  // Optimize image loading
  const optimizeUrl = (url: string) => {
    // If it's already a Contentful image with defined parameters, don't modify
    if (url.includes('images.ctfassets.net') && url.includes('?')) {
      return url;
    }
    
    // If it's a Contentful image without parameters, add optimization
    if (url.includes('images.ctfassets.net')) {
      return `${url}?w=800&q=80&fm=webp&fit=fill`;
    }
    
    // For other images, return as is
    return url;
  };

  return (
    <img 
      src={optimizeUrl(imageUrl)} 
      alt={alt}
      className={`${objectFitClass} ${className}`}
      loading={loading}
      fetchPriority={fetchPriority}
      style={{
        ...aspectRatioStyle,
        ...props.style
      }}
      data-thumbnail={isThumbnail ? 'true' : undefined}
      onError={(e) => {
        console.error(`Failed to load image: ${src}`);
        if (props.onError) {
          props.onError(e);
        }
      }}
      {...props}
    />
  );
};

export default Image;
