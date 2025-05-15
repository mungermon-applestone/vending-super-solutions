
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, Database, Server } from 'lucide-react';
import { migrateBusinessGoalData, checkIfBusinessGoalDataExists } from '@/utils/businessGoalMigration';
import { useQueryClient } from '@tanstack/react-query';

const MigrateBusinessGoalData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [dataExists, setDataExists] = useState<boolean | null>(null);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const checkExistingData = async () => {
    setIsLoading(true);
    try {
      const exists = await checkIfBusinessGoalDataExists();
      setDataExists(exists);
      if (exists) {
        toast({
          title: "Data exists",
          description: "Business goal data already exists in the database.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking data",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigration = async () => {
    setIsLoading(true);
    try {
      const success = await migrateBusinessGoalData();
      
      if (success) {
        setMigrationResult({
          success: true,
          message: "Business goal data has been successfully migrated to the database.",
        });
        toast({
          title: "Migration successful",
          description: "Business goal data has been migrated to the database.",
        });
      } else {
        setMigrationResult({
          success: false,
          message: "Failed to migrate business goal data. Check the console for details.",
        });
        toast({
          variant: "destructive",
          title: "Migration failed",
          description: "Failed to migrate business goal data. Check the console for details.",
        });
      }
    } catch (error) {
      setMigrationResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      });
      toast({
        variant: "destructive",
        title: "Migration error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
      // Check data existence again after migration attempt
      checkExistingData();
    }
  };

  const handleClearCache = () => {
    queryClient.invalidateQueries({ queryKey: ['business-goals'] });
    queryClient.refetchQueries({ queryKey: ['business-goals'] });
    
    toast({
      title: "Cache Cleared",
      description: "Business goal data cache has been cleared.",
    });
  };

  useEffect(() => {
    checkExistingData();
  }, []);

  return (
    <Layout>
      <div className="container max-w-4xl py-10">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/admin" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
          </Link>
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <CardTitle>Migrate Business Goal Data</CardTitle>
            </div>
            <CardDescription>
              Transfer Business Goal content to the CMS database
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert>
              <Server className="h-4 w-4" />
              <AlertTitle>Migration Tool</AlertTitle>
              <AlertDescription>
                This tool will extract data from the existing business goal static data and create corresponding records in the CMS database.
                This should only be run once to initialize the database with starter content.
              </AlertDescription>
            </Alert>
            
            {dataExists !== null && (
              <Alert variant={dataExists ? "destructive" : "default"}>
                {dataExists ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Data Already Exists</AlertTitle>
                    <AlertDescription>
                      Business goal data already exists in the database. Running the migration again may create duplicate entries.
                      Only proceed if you're sure you want to add more data.
                    </AlertDescription>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Ready to Migrate</AlertTitle>
                    <AlertDescription>
                      No existing business goal data detected. It's safe to proceed with the migration.
                    </AlertDescription>
                  </>
                )}
              </Alert>
            )}
            
            {migrationResult && (
              <Alert variant={migrationResult.success ? "default" : "destructive"}>
                {migrationResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{migrationResult.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{migrationResult.message}</AlertDescription>
              </Alert>
            )}
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">What will be migrated:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Business goal details with titles and descriptions</li>
                <li>Features for each business goal</li>
                <li>Icons (when possible to extract from JSX)</li>
                <li>Hero images</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClearCache}>
              Clear Cache
            </Button>
            <Button 
              onClick={handleMigration} 
              disabled={isLoading}
              variant={dataExists ? "destructive" : "default"}
            >
              {isLoading ? "Processing..." : "Migrate Business Goal Data"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default MigrateBusinessGoalData;
