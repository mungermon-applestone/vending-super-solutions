
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { useBusinessGoals } from '@/hooks/cms/useBusinessGoals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';

const BusinessGoals = () => {
  const { data: businessGoals, isLoading, error, refetch } = useBusinessGoals();
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['businessGoals'] });
  };
  
  console.log("Business goals data:", businessGoals);
  
  return (
    <Layout>
      {/* Hero Section from Database */}
      <PageHero 
        pageKey="business-goals" 
        fallbackTitle="" 
        fallbackSubtitle="" 
        fallbackImage="" 
        fallbackImageAlt="" 
      />

      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Business Goals</h1>
            <p className="text-muted-foreground mt-1">
              Explore business goals that our products can help you achieve
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="mt-4 md:mt-0">
            Refresh Data
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-500 mb-2">Error Loading Business Goals</h3>
                <p className="text-gray-600">
                  {error instanceof Error ? error.message : 'An unknown error occurred'}
                </p>
                <Button onClick={() => refetch()} className="mt-4" variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : businessGoals && businessGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessGoals.map((goal) => (
              <Card key={goal.id} className="overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  {goal.image_url ? (
                    <img 
                      src={goal.image_url} 
                      alt={goal.image_alt || goal.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{goal.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/goals/${goal.slug}`}>
                      Learn More <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No Business Goals Found</h3>
                <p className="text-gray-600">
                  There are no business goals in the database.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BusinessGoals;
