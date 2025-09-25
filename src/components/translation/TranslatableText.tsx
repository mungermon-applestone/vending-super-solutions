import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';

interface TranslatableTextProps {
  children: string;
  context?: string;
  fallback?: string;
  showLoader?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * TranslatableText Component
 * 
 * Automatically translates text content based on the current language.
 * Provides loading states and fallbacks for a smooth user experience.
 */
const TranslatableText: React.FC<TranslatableTextProps> = ({
  children,
  context,
  fallback = children,
  showLoader = false,
  className = '',
  as: Component = 'span'
}) => {
  const { translated, isLoading, error } = useTranslation(children, {
    context,
    fallbackToOriginal: true,
    enabled: !!children?.trim()
  });

  // Show loading state if enabled and currently translating
  if (isLoading && showLoader && children.length > 20) {
    return (
      <Component className={`inline-flex items-center gap-2 ${className}`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        {fallback}
      </Component>
    );
  }

  // Show error fallback or original text
  if (error) {
    console.warn('Translation failed:', error.message);
    return <Component className={className}>{fallback}</Component>;
  }

  return <Component className={className}>{translated || fallback}</Component>;
};

export default TranslatableText;