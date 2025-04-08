
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { migrateMachinesData } from '@/utils/machineMigration';
import { Link } from 'react-router-dom';

const MigrateMachinesData = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: any;
  } | null>(null);

  const handleMigrate = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const migrationResult = await migrateMachinesData();
      setResult(migrationResult);
      
      if (migrationResult.success) {
        toast({
          title: "Migration Successful",
          description: "Machine data has been successfully imported",
          variant: "default",
        });
      } else {
        toast({
          title: "Migration Failed",
          description: migrationResult.message || "An error occurred during migration",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during migration:", error);
      setResult({
        success: false,
        message: "An unexpected error occurred",
        error
      });
      
      toast({
        title: "Migration Failed",
        description: "An unexpected error occurred during migration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Machine Data Migration</CardTitle>
              <CardDescription>
                Import sample machine data from placeholder pages into the database
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  This tool will extract data from the placeholder machine pages and import it into your database.
                  This gives you a great starting point to edit existing content instead of creating it from scratch.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-amber-800">Important Note</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        This action will add new machines to your database. If you've already run this migration
                        before, you may end up with duplicate entries. This tool is intended to be run once to
                        seed your database with initial content.
                      </p>
                    </div>
                  </div>
                </div>
                
                {result && (
                  <div className={`border rounded-md p-4 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex">
                      {result.success ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                      )}
                      <div>
                        <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                          {result.success ? "Migration Successful" : "Migration Failed"}
                        </h3>
                        <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/admin/machines">Back to Machines</Link>
              </Button>
              
              <Button 
                onClick={handleMigrate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Migrating Data...
                  </>
                ) : (
                  "Start Migration"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MigrateMachinesData;
