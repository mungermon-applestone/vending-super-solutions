import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TranslatableText from '@/components/translation/TranslatableText';

const TranslationDisclaimer: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissal when language changes
  useEffect(() => {
    setIsDismissed(false);
  }, [currentLanguage]);

  // Check if disclaimer was previously dismissed for this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem(`translation-disclaimer-dismissed-${currentLanguage}`);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, [currentLanguage]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem(`translation-disclaimer-dismissed-${currentLanguage}`, 'true');
  };

  // Only show for non-English languages
  if (currentLanguage === 'en' || isDismissed) {
    return null;
  }

  return (
    <div className="bg-accent border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-accent-foreground">
            <Languages className="h-4 w-4 flex-shrink-0" />
            <span>
              <TranslatableText context="translation-disclaimer">
                Automatically translated from English - you may see some translation errors.
              </TranslatableText>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 hover:bg-accent-foreground/10"
            aria-label="Dismiss translation notice"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TranslationDisclaimer;