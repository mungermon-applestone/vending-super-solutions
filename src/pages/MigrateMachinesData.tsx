
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle, Database, RefreshCcw, List } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { migrateMachinesData } from '@/utils/machineMigration';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const MigrateMachinesData = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    count?: number;
    error?: any;
    errors?: string[];
    machinesInDb?: any[];
  } | null>(null);

  const handleMigrate = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // Clear any cached machine data before migration
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      console.log("Starting machine data migration...");
      
      const migrationResult = await migrateMachinesData();
      console.log("Migration completed with result:", migrationResult);
      setResult(migrationResult);
      
      if (migrationResult.success) {
        toast({
          title: "Migration Successful",
          description: `${migrationResult.count || 0} machines were successfully imported`,
          variant: "default",
        });
        
        // Invalidate queries to ensure fresh data is fetched
        queryClient.invalidateQueries({ queryKey: ['machines'] });
        queryClient.refetchQueries({ queryKey: ['machines'] });
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
  
  const handleCheckDatabase = () => {
    // Invalidate all machine-related queries to force a fresh fetch
    queryClient.invalidateQueries({ queryKey: ['machines'] });
    queryClient.refetchQueries({ queryKey: ['machines'] });
    
    toast({
      title: "Cache Cleared",
      description: "Machine data cache has been cleared. You can now check the admin page.",
      variant: "default",
    });
  };
  
  const handleForceClearCache = async () => {
    // More aggressive cache clearing
    await queryClient.resetQueries();
    window.localStorage.removeItem('tanstack-query-cache');
    
    toast({
      title: "Complete Cache Reset",
      description: "The entire query cache has been reset. You may need to reload the page.",
      variant: "default",
    });
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
                        before, duplicate entries will be skipped. This tool is intended to seed your database 
                        with initial content.
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
                          {result.success && result.count !== undefined && (
                            <span className="block mt-1">
                              <Database className="inline h-4 w-4 mr-1" /> 
                              {result.count} machines were imported into the database
                            </span>
                          )}
                        </p>
                        
                        {result.errors && result.errors.length > 0 && (
                          <Accordion type="single" collapsible className="mt-2">
                            <AccordionItem value="errors">
                              <AccordionTrigger className="text-sm text-red-800 font-medium">
                                View Error Details ({result.errors.length})
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="text-xs text-red-700 list-disc pl-5 mt-2 space-y-1">
                                  {result.errors.map((err, index) => (
                                    <li key={index}>{err}</li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                        
                        {result.machinesInDb && result.machinesInDb.length > 0 && (
                          <Accordion type="single" collapsible className="mt-2">
                            <AccordionItem value="machines">
                              <AccordionTrigger className="text-sm text-green-800 font-medium">
                                View Machines in Database ({result.machinesInDb.length})
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="text-xs text-green-700 list-disc pl-5 mt-2 space-y-1">
                                  {result.machinesInDb.map((machine, index) => (
                                    <li key={machine.id}>
                                      {machine.title} ({machine.slug})
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {result?.success && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                    <div className="flex">
                      <RefreshCcw className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <h3 className="font-medium text-blue-800">Next Steps</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          After migration, you need to clear the data cache before the new machines appear in the admin interface.
                          Click the button below to clear the cache, then check the admin page.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={handleCheckDatabase}
                          >
                            <RefreshCcw className="h-4 w-4 mr-2" /> Clear Cache & Refresh Data
                          </Button>
                          
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100"
                            onClick={handleForceClearCache}
                          >
                            <Database className="h-4 w-4 mr-2" /> Force Reset All Cache
                          </Button>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          If you still don't see machines after clearing the cache, try reloading the page or 
                          try the "Force Reset" option which clears all cached data.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="flex">
                    <List className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-gray-800">Debugging Tips</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        If you're experiencing issues with the migration:
                      </p>
                      <ul className="text-sm text-gray-700 list-disc pl-5 mt-1">
                        <li>Check the browser console for detailed logs</li>
                        <li>Make sure you have admin privileges on your Supabase instance</li>
                        <li>Try running the migration and then force reset the cache</li>
                        <li>Check the RLS policies for the machines table</li>
                        <li>Verify Supabase connection is working properly</li>
                      </ul>
                    </div>
                  </div>
                </div>
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
                ) : result?.success ? (
                  "Run Migration Again"
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
