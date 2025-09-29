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
        staleTime: 30 * 60 * 1000, // 30 minutes - translations are stable
        gcTime: 60 * 60 * 1000, // 60 minutes - keep translations cached longer
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Don't refetch if data is still fresh
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