
import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Loader = ({ size = 'medium', className = '' }: LoaderProps) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Loader;
