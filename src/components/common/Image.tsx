
import React, { useState, useEffect } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  isThumbnail?: boolean;
  lazyLoad?: boolean;
  priority?: boolean;
  sizes?: string;
}

const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  objectFit = 'cover',
  aspectRatio,
  isThumbnail = false,
  lazyLoad = true,
  priority = false,
  sizes = '100vw',
  loading: propLoading,
  fetchPriority: propFetchPriority,
  onLoad,
  ...props 
}) => {
  // State for tracking image load status
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxAttempts = 2;
  
  // Check if image URL is valid
  const isValidUrl = src && (src.startsWith('http') || src.startsWith('//') || src.startsWith('/'));
  
  // Process URL to ensure it has proper protocol
  let imageUrl = isValidUrl ? src : "https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80";
  
  // Add https: if the URL starts with // (protocol-relative URL)
  if (imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }
  
  // Detect image service type (Contentful, etc)
  const isContentfulImage = imageUrl.includes('images.ctfassets.net');
  const isUnsplashImage = imageUrl.includes('unsplash.com');
  
  // Determine loading strategy
  const loading = priority ? 'eager' : propLoading || (lazyLoad ? 'lazy' : 'eager');
  
  // Determine fetchPriority
  const fetchPriority = priority ? 'high' : propFetchPriority || (loading === 'eager' ? 'high' : 'auto');

  // Optimize image loading based on service
  const optimizeUrl = (url: string) => {
    try {
      // If it's already a Contentful image with defined parameters, don't modify
      if (isContentfulImage && url.includes('?')) {
        return url;
      }
      
      // If it's a Contentful image without parameters, add optimization
      if (isContentfulImage) {
        const width = isThumbnail ? 400 : 1200;
        return `${url}?w=${width}&q=80&fm=webp&fit=pad`;
      }
      
      // For Unsplash images, use their optimization API
      if (isUnsplashImage && !url.includes('&auto=format')) {
        return `${url}${url.includes('?') ? '&' : '?'}auto=format&q=80&w=${isThumbnail ? '400' : '1200'}&fit=max`;
      }
      
      return url;
    } catch (error) {
      console.error(`[Image] Error optimizing URL: ${url}`, error);
      return url;
    }
  };

  // Handle prefetching important images
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = optimizeUrl(imageUrl);
        link.imageSrcset = generateSrcSet(imageUrl);
        link.imageSizes = sizes;
        document.head.appendChild(link);
        
        return () => {
          document.head.removeChild(link);
        };
      } catch (error) {
        console.error(`[Image] Error prefetching image: ${imageUrl}`, error);
      }
    }
  }, [imageUrl, priority, sizes]);

  // Generate srcset for responsive images
  const generateSrcSet = (url: string): string => {
    if (isContentfulImage) {
      const widths = [640, 750, 828, 1080, 1200, 1920, 2048];
      return widths.map(w => {
        const optimizedUrl = url.includes('?') 
          ? `${url}&w=${w}` 
          : `${url}?w=${w}&q=75&fm=webp`;
        return `${optimizedUrl} ${w}w`;
      }).join(', ');
    }
    
    if (isUnsplashImage) {
      const widths = [640, 750, 828, 1080, 1200, 1920, 2048];
      return widths.map(w => {
        const optimizedUrl = url.includes('?') 
          ? `${url}&w=${w}` 
          : `${url}?w=${w}&q=75&auto=format`;
        return `${optimizedUrl} ${w}w`;
      }).join(', ');
    }
    
    return '';
  };

  // Handle load event
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
    
    // Performance monitoring for LCP candidates
    if (priority && 'PerformanceObserver' in window) {
      try {
        performance.mark(`image-loaded-${imageUrl.substring(0, 50)}`);
      } catch (err) {
        // Ignore errors
      }
    }
  };

  // Handle error event
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`[Image] Failed to load image (attempt ${loadAttempts + 1}): ${src}`);
    setLoadAttempts(prev => prev + 1);
    
    if (props.onError) {
      props.onError(e);
    }
  };

  // Generate srcSet only for images that would benefit from it
  const srcSet = (isContentfulImage || isUnsplashImage) ? generateSrcSet(imageUrl) : undefined;

  // Apply object fit class based on the prop
  const objectFitClass = `object-${objectFit}`;
  
  return (
    <div 
      className={`image-container ${!isLoaded ? 'bg-gray-100 animate-pulse' : ''}`} 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        aspectRatio: aspectRatio || undefined,
        position: 'relative'
      }}
    >
      <img 
        src={optimizeUrl(imageUrl)} 
        alt={alt}
        className={`${objectFitClass} ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        fetchPriority={fetchPriority as 'high' | 'low' | 'auto'}
        style={{
          width: '100%',
          height: '100%',
          transition: 'opacity 0.3s ease-in-out',
          ...props.style
        }}
        onLoad={handleLoad}
        onError={handleError}
        srcSet={srcSet}
        sizes={sizes}
        data-thumbnail={isThumbnail ? 'true' : undefined}
        data-load-attempts={loadAttempts}
        decoding="async"
        {...props}
      />
    </div>
  );
};

export default React.memo(Image);
