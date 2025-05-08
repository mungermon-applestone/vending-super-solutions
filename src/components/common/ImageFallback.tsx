
import React, { useState } from 'react';
import Image from './Image';

interface ImageFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  isThumbnail?: boolean;
}

/**
 * ImageFallback component that provides fallback images 
 * when the primary image doesn't load
 */
const ImageFallback: React.FC<ImageFallbackProps> = ({ 
  src, 
  alt, 
  className,
  objectFit = 'cover',
  isThumbnail
}) => {
  const [imgError, setImgError] = useState(false);
  
  // List of fallback placeholder images
  const fallbackImages = [
    '/images/placeholder-machine.jpg',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  ];
  
  // Select a random fallback image from the list
  const getRandomFallback = () => {
    const index = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[index];
  };
  
  // If no source provided or there was an error loading the image, use a fallback
  const imgSrc = imgError || !src ? getRandomFallback() : src;
  
  // For debugging
  if (!src) {
    console.log('[ImageFallback] No source provided for image with alt:', alt);
  }

  return (
    <Image 
      src={imgSrc}
      alt={alt}
      className={className || ''}
      objectFit={objectFit}
      onError={() => {
        console.log(`[ImageFallback] Error loading image: ${src}`);
        setImgError(true);
      }}
      // Don't pass fetchPriority prop to avoid warning
      isThumbnail={isThumbnail}
    />
  );
};

export default ImageFallback;
