
import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  const { translated: loadingText } = useTranslation("Loading", { 
    context: "ui-components",
    fallbackToOriginal: true 
  });

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-2 border-vending-blue",
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label={loadingText}
      />
    </div>
  );
};
