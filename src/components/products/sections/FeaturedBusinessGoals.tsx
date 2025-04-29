
import { useFeaturedBusinessGoals } from '@/hooks/cms/useFeaturedBusinessGoals';
import { Loader2 } from 'lucide-react';
import BusinessGoalsCompact from '@/components/businessGoals/BusinessGoalsCompact';
import ContentfulConfigWarning from '@/components/machines/ContentfulConfigWarning';
import { isContentfulConfigured } from '@/config/cms';

const FeaturedBusinessGoals = ({ entryId }: { entryId: string }) => {
  const { data: goals, isLoading, error, refetch } = useFeaturedBusinessGoals(entryId);
  const isConfigured = isContentfulConfigured();

  // Show warning if Contentful is not configured or there's a connection error
  if ((error || !isConfigured) && !isLoading) {
    return (
      <>
        <ContentfulConfigWarning onRetry={refetch} />
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
