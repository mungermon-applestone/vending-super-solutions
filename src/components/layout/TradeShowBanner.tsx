import React from 'react';
import { X, PartyPopper } from 'lucide-react';
import { useTradeShowVisitor } from '@/hooks/useTradeShowVisitor';

const TradeShowBanner: React.FC = () => {
  const { isTradeShowVisitor, message, isDismissed, dismiss } = useTradeShowVisitor();

  // Don't render if not a trade show visitor or if dismissed
  if (!isTradeShowVisitor || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-accent via-accent/95 to-accent text-accent-foreground relative overflow-hidden">
      <div className="px-4 py-3 relative flex items-center justify-center gap-2">
        <PartyPopper className="h-5 w-5 flex-shrink-0" />
        <span className="text-base font-semibold tracking-wide text-center">
          {message}
        </span>
        <PartyPopper className="h-5 w-5 flex-shrink-0 hidden sm:block" />
        <button
          onClick={dismiss}
          className="absolute right-2 md:right-4 p-1.5 hover:bg-accent-foreground/10 rounded-full transition-colors z-10"
          aria-label="Dismiss welcome banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TradeShowBanner;
