import React from 'react';
import { cn } from '@/lib/utils';
import { getWordCount } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface NavigationButtonWrapperProps {
  children: React.ReactNode;
  originalText: string;
  context?: string;
  className?: string;
}

/**
 * Wrapper component that conditionally applies text wrapping to navigation buttons
 * when the translated text exceeds 3 words in non-English languages
 */
const NavigationButtonWrapper: React.FC<NavigationButtonWrapperProps> = ({
  children,
  originalText,
  context,
  className
}) => {
  const { currentLanguage } = useLanguage();
  const { translated } = useTranslation(originalText, { context, enabled: !!originalText });
  
  // Use the translated text or fallback to original text for word counting
  const textToCount = translated || originalText;
  const shouldWrap = currentLanguage !== 'en' && getWordCount(textToCount) > 3;
  
  return (
    <div className={cn(
      shouldWrap 
        ? "text-center leading-tight whitespace-normal" 
        : "whitespace-nowrap",
      className
    )}>
      {children}
    </div>
  );
};

export default NavigationButtonWrapper;