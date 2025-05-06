
import React, { useState, useEffect, useRef } from 'react';

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
  
  // Intersection observer for advanced lazy loading
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
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

  // Advanced intersection observer for smarter lazy loading
  useEffect(() => {
    // Skip if image is priority or not lazy loaded
    if (priority || !lazyLoad || !imgRef.current) return;
    
    const options = {
      rootMargin: '200px 0px', // Start loading 200px before the image enters viewport
      threshold: 0.01 // Trigger when 1% of the image is visible
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && imgRef.current) {
          // When image is about to enter viewport, set the src
          const img = imgRef.current;
          const optimizedSrc = optimizeUrl(imageUrl);
          
          if (img.dataset.src !== optimizedSrc) {
            img.src = optimizedSrc;
            img.dataset.src = optimizedSrc;
          }
          
          // Disconnect after loading
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      });
    };
    
    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(imgRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageUrl, lazyLoad, priority]);

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
      const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
      return widths.map(w => {
        const optimizedUrl = url.includes('?') 
          ? `${url}&w=${w}` 
          : `${url}?w=${w}&q=75&fm=webp`;
        return `${optimizedUrl} ${w}w`;
      }).join(', ');
    }
    
    if (isUnsplashImage) {
      const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
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

        // Report to core web vitals if this might be the LCP
        if ('PerformanceObserver' in window) {
          const entryTypes = ['largest-contentful-paint'];
          
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              // Check if this image is the LCP - safely use type assertion
              const lcpEntry = entry as any; // Use type assertion for safety
              if (lcpEntry.element && lcpEntry.element === e.target) {
                console.log('[LCP] Image is the Largest Contentful Paint', { 
                  image: imageUrl, 
                  lcpTime: entry.startTime 
                });
              }
            });
          });
          
          try {
            lcpObserver.observe({ entryTypes });
          } catch (err) {
            console.error('[LCP] Failed to observe LCP', err);
          }
        }
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
      className={`image-container ${!isLoaded ? 'bg-gray-100' : ''}`} 
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
      {/* Native lazy loading with optional JavaScript enhancement */}
      <img 
        ref={imgRef}
        src={optimizeUrl(imageUrl)} 
        alt={alt}
        className={`${objectFitClass} ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} will-change-opacity`}
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
        data-src={optimizeUrl(imageUrl)} // For custom lazy loading
        data-thumbnail={isThumbnail ? 'true' : undefined}
        data-priority={priority ? 'true' : undefined}
        data-load-attempts={loadAttempts}
        decoding={priority ? 'sync' : 'async'}
        {...props}
      />
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(Image);
