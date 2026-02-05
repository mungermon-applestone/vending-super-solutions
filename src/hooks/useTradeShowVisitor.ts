import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const TRADE_SHOW_STORAGE_KEY = 'tradeshow-visitor';
const TRADE_SHOW_DISMISSED_KEY = 'tradeshow-banner-dismissed';

interface TradeShowConfig {
  param: string;
  message: string;
}

// Configure different trade shows here
const TRADE_SHOW_CONFIGS: Record<string, TradeShowConfig> = {
  tradeshow: {
    param: 'tradeshow',
    message: "Welcome, Trade Show Visitors! Glad you stopped by our booth!",
  },
  nama2025: {
    param: 'nama2025',
    message: "Welcome, NAMA 2025 Attendees! Great to meet you at the show!",
  },
};

export interface UseTradeShowVisitorReturn {
  isTradeShowVisitor: boolean;
  message: string;
  tradeShowId: string | null;
  isDismissed: boolean;
  dismiss: () => void;
}

export function useTradeShowVisitor(): UseTradeShowVisitorReturn {
  const [searchParams] = useSearchParams();
  const [isTradeShowVisitor, setIsTradeShowVisitor] = useState(false);
  const [message, setMessage] = useState('');
  const [tradeShowId, setTradeShowId] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem(TRADE_SHOW_DISMISSED_KEY);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    // Check URL parameter first
    const refParam = searchParams.get('ref');
    
    if (refParam && TRADE_SHOW_CONFIGS[refParam]) {
      // New trade show visitor detected via URL
      const config = TRADE_SHOW_CONFIGS[refParam];
      sessionStorage.setItem(TRADE_SHOW_STORAGE_KEY, refParam);
      setIsTradeShowVisitor(true);
      setMessage(config.message);
      setTradeShowId(refParam);
      return;
    }

    // Check if previously identified as trade show visitor this session
    const storedTradeShow = sessionStorage.getItem(TRADE_SHOW_STORAGE_KEY);
    if (storedTradeShow && TRADE_SHOW_CONFIGS[storedTradeShow]) {
      const config = TRADE_SHOW_CONFIGS[storedTradeShow];
      setIsTradeShowVisitor(true);
      setMessage(config.message);
      setTradeShowId(storedTradeShow);
    }
  }, [searchParams]);

  const dismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem(TRADE_SHOW_DISMISSED_KEY, 'true');
  };

  return {
    isTradeShowVisitor,
    message,
    tradeShowId,
    isDismissed,
    dismiss,
  };
}
