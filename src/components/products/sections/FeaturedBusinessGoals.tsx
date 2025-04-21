
import { CMSBusinessGoal } from '@/types/cms';
import { useFeaturedBusinessGoals } from '@/hooks/cms/useFeaturedBusinessGoals';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';

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
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Business Goals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how our products can help you achieve these key business objectives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/goals/${goal.slug}`}>
                    Learn More <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinessGoals;
