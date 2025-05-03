
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
  
  // Detect image service type (Contentful, etc)
  const isContentfulImage = imageUrl.includes('images.ctfassets.net');
  const isUnsplashImage = imageUrl.includes('unsplash.com');
  
  // Optimize image loading based on service
  const optimizeUrl = (url: string) => {
    // If it's already a Contentful image with defined parameters, don't modify
    if (isContentfulImage && url.includes('?')) {
      return url;
    }
    
    // If it's a Contentful image without parameters, add optimization
    if (isContentfulImage) {
      const width = isThumbnail ? 400 : 800;
      return `${url}?w=${width}&q=80&fm=webp&fit=fill`;
    }
    
    // For Unsplash images, use their optimization API
    if (isUnsplashImage && !url.includes('&auto=format')) {
      return `${url}${url.includes('?') ? '&' : '?'}auto=format&q=80&w=${isThumbnail ? '400' : '800'}&fit=crop`;
    }
    
    // For other images, return as is
    return url;
  };

  // Prefetch important images 
  React.useEffect(() => {
    if (fetchPriority === 'high' && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizeUrl(imageUrl);
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [imageUrl, fetchPriority]);

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
      decoding="async" 
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

export default React.memo(Image);
