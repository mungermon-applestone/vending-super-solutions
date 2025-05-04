
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
  fetchPriority,
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
  
  // Keep track of load attempts to prevent infinite retry loops
  const [loadAttempts, setLoadAttempts] = React.useState(0);
  const maxAttempts = 2;

  // Fix fetchPriority to use valid values only
  const validatedFetchPriority = fetchPriority === 'high' || fetchPriority === 'low' ? fetchPriority : undefined;
  
  // Optimize image loading based on service
  const optimizeUrl = (url: string) => {
    try {
      // If it's already a Contentful image with defined parameters, don't modify
      if (isContentfulImage && url.includes('?')) {
        return url;
      }
      
      // If it's a Contentful image without parameters, add optimization
      if (isContentfulImage) {
        const width = isThumbnail ? 400 : 800;
        const fit = isThumbnail ? 'fill' : 'pad';
        return `${url}?w=${width}&q=80&fm=webp&fit=${fit}`;
      }
      
      // For Unsplash images, use their optimization API
      if (isUnsplashImage && !url.includes('&auto=format')) {
        return `${url}${url.includes('?') ? '&' : '?'}auto=format&q=80&w=${isThumbnail ? '400' : '800'}&fit=max`;
      }
      
      // For other images, return as is
      return url;
    } catch (error) {
      console.error(`[Image] Error optimizing URL: ${url}`, error);
      return url; // Return original URL if optimization fails
    }
  };

  // Handle prefetching important images
  React.useEffect(() => {
    if (validatedFetchPriority === 'high' && typeof window !== 'undefined') {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = optimizeUrl(imageUrl);
        document.head.appendChild(link);
        
        return () => {
          document.head.removeChild(link);
        };
      } catch (error) {
        console.error(`[Image] Error prefetching image: ${imageUrl}`, error);
      }
    }
  }, [imageUrl, validatedFetchPriority]);

  // Handle error event
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`[Image] Failed to load image (attempt ${loadAttempts + 1}): ${src}`);
    
    // Increment attempts counter
    setLoadAttempts(prev => prev + 1);
    
    // Call the onError callback if provided
    if (props.onError) {
      props.onError(e);
    }
  };

  return (
    <img 
      src={optimizeUrl(imageUrl)} 
      alt={alt}
      className={`${objectFitClass} ${className}`}
      loading={loading}
      fetchPriority={validatedFetchPriority}
      style={{
        ...aspectRatioStyle,
        ...props.style
      }}
      data-thumbnail={isThumbnail ? 'true' : undefined}
      data-load-attempts={loadAttempts}
      decoding="async" 
      onError={handleError}
      {...props}
    />
  );
};

export default React.memo(Image);
