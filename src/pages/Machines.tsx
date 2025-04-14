
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { useMachines } from '@/hooks/cms/useMachines';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Machines = () => {
  const { data: machines, isLoading, error, refetch } = useMachines();
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['machines'] });
  };
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Machines</h1>
            <p className="text-muted-foreground mt-1">
              View all available machines from our database
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
                <h3 className="text-lg font-semibold text-red-500 mb-2">Error Loading Machines</h3>
                <p className="text-gray-600">
                  {error instanceof Error ? error.message : 'An unknown error occurred'}
                </p>
                <Button onClick={() => refetch()} className="mt-4" variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : machines && machines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <Card key={machine.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{machine.title}</CardTitle>
                  <CardDescription className="flex gap-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {machine.type}
                    </span>
                    {machine.temperature && (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {machine.temperature}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3 mb-4">{machine.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/machines/${machine.type}/${machine.slug}`}>
                      View Details <ExternalLink className="ml-2 h-4 w-4" />
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
                <h3 className="text-lg font-semibold mb-2">No Machines Found</h3>
                <p className="text-gray-600">
                  There are no machines in the database.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Machines;
