
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type MigrationResult = {
  success?: boolean;
  message?: string;
  count?: number;
  error?: any;
  errors?: string[];
  machinesInDb?: any[];
};

const MigrateMachinesData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult>({});

  const handleMigrate = async () => {
    setIsLoading(true);
    setResult({});

    try {
      // Mock migration process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const migrationResult = {
        success: true,
        message: "Successfully migrated 5 machines",
        count: 5,
        machinesInDb: []
      };
      
      setResult(migrationResult);
    } catch (error) {
      console.error('Error migrating machines data:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Migrate Machines Data</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Machines Data Migration</CardTitle>
          <CardDescription>
            Migrate machines data from JSON files to your CMS database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This will import machine data from the JSON sources into your CMS. 
            This includes machine specifications, images, and related product types.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleMigrate} disabled={isLoading}>
            {isLoading ? 'Migrating...' : 'Start Migration'}
          </Button>
        </CardFooter>
      </Card>
      
      {result.success !== undefined && (
        <Card className={result.success ? "border-green-500" : "border-red-500"}>
          <CardHeader>
            <CardTitle className={result.success ? "text-green-600" : "text-red-600"}>
              {result.success ? 'Migration Completed' : 'Migration Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{result.message}</p>
            {result.count !== undefined && result.success && (
              <p className="font-medium">Successfully migrated {result.count} machines.</p>
            )}
            {result.errors && result.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Errors:</h4>
                <ul className="list-disc pl-5">
                  {result.errors.map((error, index) => (
                    <li key={index} className="text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MigrateMachinesData;
