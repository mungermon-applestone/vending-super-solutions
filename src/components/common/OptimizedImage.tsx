
import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * OptimizedImage component with advanced performance features:
 * - Responsive image loading with srcset
 * - Lazy loading with Intersection Observer
 * - Proper format detection and optimization
 * - Priority loading for LCP images
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  objectFit = 'cover',
  aspectRatio,
  priority = false,
  sizes = '100vw',
  loading: propLoading,
  fetchPriority: propFetchPriority,
  onLoad,
  ...props 
}) => {
  // State for tracking image load status
  const [isLoaded, setIsLoaded] = useState(false);
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
  
  // Determine loading strategy - priority images load eagerly, others lazy load
  const loading = priority ? 'eager' : propLoading || 'lazy';
  
  // Determine fetchPriority based on importance
  const fetchPriority = priority ? 'high' : propFetchPriority || 'auto';

  // Advanced intersection observer for smarter lazy loading
  useEffect(() => {
    // Skip if image is priority or already loaded
    if (priority || loading === 'eager' || !imgRef.current || isLoaded) return;
    
    const options = {
      rootMargin: '200px 0px', // Start loading 200px before the image enters viewport
      threshold: 0.01 // Trigger when 1% of the image is visible
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && imgRef.current) {
          // When image is about to enter viewport, set full resolution src
          const img = imgRef.current;
          if (img.dataset.src && !isLoaded) {
            img.src = img.dataset.src;
            if (img.srcset === '') {
              img.srcset = img.dataset.srcset || '';
            }
          }
          
          // Disconnect after loading starts
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      });
    };
    
    // Create observer
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(handleIntersection, options);
      observerRef.current.observe(imgRef.current);
    } else {
      // Fallback for browsers without IntersectionObserver
      if (imgRef.current && imgRef.current.dataset.src) {
        imgRef.current.src = imgRef.current.dataset.src;
      }
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageUrl, loading, priority, isLoaded]);

  // Optimize image loading based on service
  const optimizeUrl = (url: string) => {
    try {
      // If it's already a Contentful image with defined parameters, don't modify
      if (isContentfulImage && url.includes('?')) {
        return url;
      }
      
      // If it's a Contentful image without parameters, add optimization
      if (isContentfulImage) {
        return `${url}?w=1200&q=80&fm=webp&fit=pad`;
      }
      
      // For Unsplash images, use their optimization API
      if (isUnsplashImage && !url.includes('&auto=format')) {
        return `${url}${url.includes('?') ? '&' : '?'}auto=format&q=80&w=1200&fit=max`;
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
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              // Check if this image is the LCP
              const lcpEntry = entry as any;
              if (lcpEntry.element && lcpEntry.element === e.target) {
                console.log('[LCP] Image is the Largest Contentful Paint', { 
                  image: imageUrl, 
                  lcpTime: entry.startTime 
                });
              }
            });
          });
          
          try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          } catch (err) {
            console.error('[LCP] Failed to observe LCP', err);
          }
        }
      } catch (err) {
        // Ignore errors
      }
    }
  };

  // Generate srcSet only for images that would benefit from it
  const srcSet = (isContentfulImage || isUnsplashImage) ? generateSrcSet(imageUrl) : undefined;

  // Apply object fit class based on the prop
  const objectFitClass = `object-${objectFit}`;
  
  // Low quality image placeholder for instant rendering
  const lowQualityUrl = isContentfulImage ? 
    `${imageUrl.split('?')[0]}?w=20&blur=100&q=10` : 
    (isUnsplashImage ? `${imageUrl.split('?')[0]}?w=20&blur=true&q=10` : undefined);
  
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
      {/* Low quality placeholder shown while loading */}
      {!isLoaded && lowQualityUrl && (
        <img 
          src={lowQualityUrl}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full ${objectFitClass} blur-lg scale-110`}
          style={{ opacity: 0.4 }}
        />
      )}
      
      {/* Main image */}
      <img 
        ref={imgRef}
        src={priority ? optimizeUrl(imageUrl) : (loading === 'lazy' ? 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' : optimizeUrl(imageUrl))}
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
        srcSet={srcSet}
        sizes={sizes}
        data-src={optimizeUrl(imageUrl)}
        data-srcset={srcSet}
        data-priority={priority ? 'true' : undefined}
        decoding={priority ? 'sync' : 'async'}
        {...props}
      />
    </div>
  );
};

export default React.memo(OptimizedImage);
