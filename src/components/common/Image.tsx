
import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className = '', ...props }) => {
  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

export default Image;
