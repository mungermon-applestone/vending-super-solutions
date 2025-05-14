
import { useFeaturedBusinessGoals } from '@/hooks/cms/useFeaturedBusinessGoals';
import { Loader2 } from 'lucide-react';
import BusinessGoalsCompact from '@/components/businessGoals/BusinessGoalsCompact';
import ContentfulConfigWarning from '@/components/machines/ContentfulConfigWarning';
import { isContentfulConfigured } from '@/config/cms';
import { useCallback, useEffect } from 'react';
import { validateContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

const FeaturedBusinessGoals = ({ entryId }: { entryId: string }) => {
  const { data: goals, isLoading, error, refetch } = useFeaturedBusinessGoals(entryId);
  const isConfigured = isContentfulConfigured();

  // Auto-initialize on component mount if needed
  useEffect(() => {
    if (!goals && !isLoading && (error || !isConfigured)) {
      console.log('[FeaturedBusinessGoals] Auto-initializing content on mount');
      handleRetry();
    }
  }, []);

  const handleRetry = useCallback(async () => {
    console.log('[FeaturedBusinessGoals] Retrying content fetch');

    try {
      // Validate client first, refresh if needed
      const isValid = await validateContentfulClient();
      if (!isValid) {
        console.log('[FeaturedBusinessGoals] Client invalid, refreshing...');
        await refreshContentfulClient();
        toast.success('Content connection refreshed', { id: 'contentful-refresh' });
      }
      
      // Force refetch data
      await refetch();
      console.log('[FeaturedBusinessGoals] Content refetched successfully');
    } catch (refreshError) {
      console.error('[FeaturedBusinessGoals] Error refreshing client:', refreshError);
    }
  }, [refetch]);

  // Show warning if Contentful is not configured or there's a connection error
  if ((error || !isConfigured) && !isLoading) {
    return (
      <>
        <ContentfulConfigWarning 
          onRetry={handleRetry} 
          showDetails={false}
          message="Unable to load business goals content."
        />
        {/* Show mock data as fallback */}
        {!goals || goals.length === 0 ? null : (
          <BusinessGoalsCompact goals={goals} columnCount={3} />
        )}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return null;
  }

  return (
    <BusinessGoalsCompact goals={goals} columnCount={3} />
  );
};

export default FeaturedBusinessGoals;
