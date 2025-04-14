
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { runCMSDiagnostics, getCMSDiagnosticsReport } from '@/services/cms/utils/diagnostics';
import { AlertTriangle, CheckCircle, Info, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CMSDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [detailedReport, setDetailedReport] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [productTypeCheck, setProductTypeCheck] = useState<{
    exists: boolean;
    rowCount: number;
    firstRow?: any;
  } | null>(null);
  
  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      // Run general CMS diagnostics
      const result = await runCMSDiagnostics();
      setDiagnostics(result);
      
      // Get detailed HTML report
      const report = await getCMSDiagnosticsReport();
      setDetailedReport(report);
      
      // Perform specific product type table check
      const { data, error, count } = await supabase
        .from('product_types')
        .select('*', { count: 'exact' })
        .range(0, 0);
      
      setProductTypeCheck({
        exists: !error,
        rowCount: count || 0,
        firstRow: data?.[0]
      });
    } catch (error) {
      console.error("Diagnostics error:", error);
    } finally {
      setIsRunning(false);
    }
  };
  
  useEffect(() => {
    runDiagnostics();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>CMS Diagnostics</CardTitle>
        <CardDescription>Comprehensive diagnostic check of your CMS configuration</CardDescription>
      </CardHeader>
      <CardContent>
        {isRunning ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* General Diagnostics */}
            <div>
              <h3 className="font-semibold mb-2">CMS Connection</h3>
              {diagnostics && (
                <Alert 
                  variant={diagnostics.status === 'healthy' ? 'default' : 'destructive'}
                  className={diagnostics.status === 'issues' ? 'border-yellow-200 bg-yellow-50' : ''}
                >
                  {diagnostics.status === 'healthy' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : diagnostics.status === 'issues' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>{diagnostics.provider} CMS Status</AlertTitle>
                  <AlertDescription>
                    Overall Status: {diagnostics.status.toUpperCase()}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {/* Product Types Table Check */}
            <div>
              <h3 className="font-semibold mb-2">Product Types Table</h3>
              {productTypeCheck && (
                <Alert 
                  variant={productTypeCheck.exists && productTypeCheck.rowCount > 0 ? 'default' : 'destructive'}
                >
                  {productTypeCheck.exists && productTypeCheck.rowCount > 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>Product Types Table</AlertTitle>
                  <AlertDescription>
                    {productTypeCheck.exists 
                      ? `Table exists with ${productTypeCheck.rowCount} rows` 
                      : 'Table is missing or inaccessible'}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {/* Detailed Report */}
            {detailedReport && (
              <div 
                className="border rounded p-4 bg-gray-50 max-h-64 overflow-y-auto text-xs"
                dangerouslySetInnerHTML={{ __html: detailedReport }}
              />
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Rerun Diagnostics'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CMSDiagnostics;
