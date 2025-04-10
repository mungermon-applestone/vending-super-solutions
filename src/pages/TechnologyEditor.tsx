
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import { Skeleton } from '@/components/ui/skeleton';

const TechnologyEditor: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { technologySlug } = useParams<{ technologySlug: string }>();
  const isNewTechnology = !technologySlug;
  
  // If editing an existing technology, fetch it
  const { technology, isLoading, error } = useTechnologyData(technologySlug || '');

  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading technology",
        description: error.message
      });
    }
  }, [error, toast]);

  React.useEffect(() => {
    // Show editor mode notification
    toast({
      title: isNewTechnology ? 'Creating New Technology' : 'Editing Technology',
      description: isNewTechnology
        ? 'You are creating a new technology. This will be visible on the site after saving.'
        : 'You are editing an existing technology. Changes will be visible on the site after saving.',
      duration: 5000,
    });
  }, [toast, isNewTechnology]);

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isNewTechnology ? 'Create New Technology' : 'Edit Technology'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNewTechnology
              ? 'Add a new technology to your platform'
              : `Editing: ${isLoading ? '...' : technology?.title}`}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Technology Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isNewTechnology ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center py-12 text-muted-foreground">
                  Technology editor coming soon. This feature is currently under development.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  In this editor, you will be able to create and edit technology details, sections, and features.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TechnologyEditor;
