
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { fetchContentfulEntries } from '@/services/contentful/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const MachineDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: machine, isLoading, error } = useQuery({
    queryKey: ['machine', slug],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('machine', {
          'fields.slug': slug,
          include: 2
        });
        
        if (entries.items.length === 0) {
          throw new Error('Machine not found');
        }
        
        const machine = entries.items[0];
        return {
          id: machine.sys.id,
          ...machine.fields
        };
      } catch (error) {
        console.error(`Error fetching machine with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug
  });

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4">{machine?.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{machine?.description}</p>
            
            {/* Display machine details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {machine?.images?.[0] && (
                  <img
                    src={`https:${machine.images[0].fields.file.url}`}
                    alt={machine.title}
                    className="rounded-lg shadow-md w-full"
                  />
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Machine Details</h2>
                {machine?.type && (
                  <p className="mb-2">
                    <span className="font-medium">Type:</span> {machine.type}
                  </p>
                )}
                {machine?.temperature && (
                  <p className="mb-2">
                    <span className="font-medium">Temperature:</span> {machine.temperature}
                  </p>
                )}
                
                {machine?.features && machine.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {machine.features.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MachineDetail;
