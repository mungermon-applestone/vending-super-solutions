
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { purgeProductData } from '@/utils/dataPurgeUtils';

const DataPurgePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [purgeResult, setPurgeResult] = useState<{
    success?: boolean;
    tablesAffected?: string[];
    recordsDeleted?: Record<string, number>;
    error?: string;
  }>({});

  const handlePurgeData = async () => {
    setIsLoading(true);
    try {
      const result = await purgeProductData();
      setPurgeResult(result);
      
      if (result.success) {
        // Invalidate any related queries to ensure UI is refreshed
        queryClient.invalidateQueries({ queryKey: ['productTypes'] });
        
        toast({
          title: "Data Purge Successful",
          description: `Successfully purged data from ${result.tablesAffected?.length} tables.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Data Purge Failed",
          description: result.error || "An unknown error occurred during the data purge.",
        });
      }
    } catch (error) {
      console.error("Error purging data:", error);
      setPurgeResult({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete the data purge operation.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Data Management</h1>
        
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
              Data Purge Operations
            </CardTitle>
            <CardDescription className="text-amber-700">
              Use these tools with extreme caution. Data deletions are permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md border border-amber-200">
                <h3 className="font-medium text-lg mb-2">Product Data Purge</h3>
                <p className="text-slate-600 mb-4">
                  This will permanently delete ALL product types and their related data from the database,
                  including all product benefits, features, and images. This action cannot be undone.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Purge All Product Data"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently delete ALL product types and related data from the database.
                        <span className="font-bold block mt-2">This action cannot be undone.</span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handlePurgeData();
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        I understand, purge all product data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {Object.keys(purgeResult).length > 0 && (
          <Card className={purgeResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            <CardHeader>
              <CardTitle className={`flex items-center ${purgeResult.success ? "text-green-800" : "text-red-800"}`}>
                {purgeResult.success ? (
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="mr-2 h-5 w-5 text-red-600" />
                )}
                Data Purge Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {purgeResult.success ? (
                <div className="space-y-4">
                  <p className="text-green-700">The data purge completed successfully!</p>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Tables Affected:</h4>
                    <ul className="list-disc pl-5 text-slate-800">
                      {purgeResult.tablesAffected?.map(table => (
                        <li key={table}>{table}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Records Deleted:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(purgeResult.recordsDeleted || {}).map(([table, count]) => (
                        <div key={table} className="bg-white rounded p-2 border border-green-200">
                          <span className="font-mono">{table}:</span> {count}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-red-700">
                  <p className="font-medium">Error during data purge:</p>
                  <p className="mt-1">{purgeResult.error}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button
                  variant={purgeResult.success ? "default" : "secondary"}
                  onClick={() => navigate('/admin/products')}
                >
                  Go to Products
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPurgeResult({})}
                >
                  Clear Results
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DataPurgePage;
