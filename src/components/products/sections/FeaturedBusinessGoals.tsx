
import { useFeaturedBusinessGoals } from '@/hooks/cms/useFeaturedBusinessGoals';
import { Loader2 } from 'lucide-react';
import BusinessGoalsCompact from '@/components/businessGoals/BusinessGoalsCompact';
import ContentfulConfigWarning from '@/components/machines/ContentfulConfigWarning';
import { isContentfulConfigured } from '@/config/cms';
import { useCallback } from 'react';
import { validateContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';

const FeaturedBusinessGoals = ({ entryId }: { entryId: string }) => {
  const { data: goals, isLoading, error, refetch } = useFeaturedBusinessGoals(entryId);
  const isConfigured = isContentfulConfigured();

  const handleRetry = useCallback(async () => {
    console.log('[FeaturedBusinessGoals] Retrying content fetch');

    // Validate client first, refresh if needed
    const isValid = await validateContentfulClient();
    if (!isValid) {
      await refreshContentfulClient();
    }
    
    refetch();
  }, [refetch]);

  // Show warning if Contentful is not configured or there's a connection error
  if ((error || !isConfigured) && !isLoading) {
    return (
      <>
        <ContentfulConfigWarning onRetry={handleRetry} showDetails={false} />
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
