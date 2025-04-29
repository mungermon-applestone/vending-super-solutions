
import { useFeaturedBusinessGoals } from '@/hooks/cms/useFeaturedBusinessGoals';
import { Loader2 } from 'lucide-react';
import BusinessGoalsCompact from '@/components/businessGoals/BusinessGoalsCompact';

const FeaturedBusinessGoals = ({ entryId }: { entryId: string }) => {
  const { data: goals, isLoading } = useFeaturedBusinessGoals(entryId);

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
