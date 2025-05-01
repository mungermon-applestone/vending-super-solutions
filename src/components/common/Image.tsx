
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
  ...props 
}) => {
  // Apply object fit class based on the prop
  const objectFitClass = `object-${objectFit}`;
  
  // Add debugging information
  console.log(`[Image] Rendering image: ${alt}, objectFit: ${objectFit}, isThumbnail: ${isThumbnail}`);
  
  // Apply aspect ratio style if provided
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : {};

  return (
    <img 
      src={src} 
      alt={alt}
      className={`${objectFitClass} ${className}`}
      loading="lazy"
      style={{
        ...aspectRatioStyle,
        ...props.style
      }}
      data-thumbnail={isThumbnail ? 'true' : undefined}
      {...props}
    />
  );
};

export default Image;
