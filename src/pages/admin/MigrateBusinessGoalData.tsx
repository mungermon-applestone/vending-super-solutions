
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { migrateBusinessGoalData } from '@/utils/businessGoalMigration';

const MigrateBusinessGoalData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[] | null>(null);

  const handleMigrateData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResults(null);
      setIsSuccess(false);
      
      const migratedData = await migrateBusinessGoalData();
      console.log('Migration complete:', migratedData);
      
      setResults(migratedData);
      setIsSuccess(true);
    } catch (err) {
      console.error('Migration error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Business Goal Data Migration</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Migrate Business Goals Data</CardTitle>
            <CardDescription>
              This utility will migrate business goal data to the CMS. Use with caution as it may create duplicate entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This will take the business goal data from the local data files and migrate it to the CMS system.
              Ensure that you have the proper CMS configuration set up before proceeding.
            </p>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isSuccess && (
              <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Successfully migrated {results?.length || 0} business goals to the CMS.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleMigrateData} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating Data...
                </>
              ) : (
                'Start Migration'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {results && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Migration Results</CardTitle>
              <CardDescription>Successfully migrated {results.length} business goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96">
                <pre className="text-xs p-4 bg-gray-50 rounded-md">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MigrateBusinessGoalData;
