import React from 'react';
import { useTranslationStatus } from '@/hooks/useTranslationStatus';
import { Progress } from '@/components/ui/progress';
import { Languages, Check, Loader2 } from 'lucide-react';
import TranslatableText from './TranslatableText';

interface TranslationProgressIndicatorProps {
  /** Sample texts to check translation coverage */
  sampleTexts?: string[];
  /** Context for the translation check */
  context?: string;
  /** Whether to show the indicator even when translations are ready */
  alwaysShow?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * TranslationProgressIndicator Component
 * 
 * Shows translation loading progress and status to users
 * Only displays when translations are needed and loading
 */
const TranslationProgressIndicator: React.FC<TranslationProgressIndicatorProps> = ({
  sampleTexts = [],
  context = 'page',
  alwaysShow = false,
  className = ''
}) => {
  const { 
    isLoading, 
    showTranslationUI, 
    translationsReady, 
    coveragePercentage,
    currentLanguage 
  } = useTranslationStatus({ sampleTexts, context });

  // Don't show if translations aren't needed
  if (!showTranslationUI) return null;

  // Don't show if ready and not always showing
  if (translationsReady && !alwaysShow && !isLoading) return null;

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (translationsReady) return <Check className="h-4 w-4 text-green-600" />;
    return <Languages className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isLoading) return "Loading translations...";
    if (translationsReady) return "Translations ready";
    return "Preparing translations...";
  };

  return (
    <div className={`bg-accent/50 border border-accent rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-accent-foreground">
            <TranslatableText context="translation-status">
              {getStatusText()}
            </TranslatableText>
          </p>
          {coveragePercentage !== undefined && (
            <div className="mt-2">
              <Progress 
                value={coveragePercentage} 
                className="h-2"
                aria-label={`Translation progress: ${coveragePercentage}%`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                <TranslatableText context="translation-status">
                  {`${coveragePercentage}% cached`}
                </TranslatableText>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationProgressIndicator;