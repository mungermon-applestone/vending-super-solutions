import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import TranslationDisclaimer from '@/components/language/TranslationDisclaimer';

interface TranslationProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

/**
 * TranslationProvider Component
 * 
 * Wraps the app with all necessary translation-related providers:
 * - QueryClient for translation caching
 * - LanguageProvider for language context
 * - TranslationDisclaimer for non-English languages
 */
const TranslationProvider: React.FC<TranslationProviderProps> = ({ 
  children, 
  queryClient 
}) => {
  // Use provided QueryClient or create a default one
  const client = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={client}>
      <LanguageProvider>
        <TranslationDisclaimer />
        {children}
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default TranslationProvider;