import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { runCMSDiagnostics, getCMSDiagnosticsReport } from '@/services/cms/utils/diagnostics';
import { AlertTriangle, CheckCircle, Info, XCircle, RefreshCw, Database } from 'lucide-react';
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
  
  const [tablesCheck, setTablesCheck] = useState<{
    [key: string]: {
      exists: boolean;
      rowCount: number;
    }
  }>({});

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const result = await runCMSDiagnostics();
      setDiagnostics(result);
      
      const report = await getCMSDiagnosticsReport();
      setDetailedReport(report);
      
      const tables = ['product_types', 'business_goals', 'technologies', 'machines'];
      const tableChecks: any = {};
      
      for (const table of tables) {
        try {
          const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact' })
            .range(0, 0);
            
          tableChecks[table] = {
            exists: !error,
            rowCount: count || 0
          };
        } catch (err) {
          console.error(`Error checking ${table} table:`, err);
          tableChecks[table] = {
            exists: false,
            rowCount: 0
          };
        }
      }
      
      setTablesCheck(tableChecks);
      
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
        <CardDescription>Comprehensive diagnostic check of your Supabase CMS configuration</CardDescription>
      </CardHeader>
      <CardContent>
        {isRunning ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
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
                  <AlertTitle>Supabase CMS Status</AlertTitle>
                  <AlertDescription>
                    Overall Status: {diagnostics.status.toUpperCase()}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Database Tables Status</h3>
              <div className="space-y-2">
                {Object.entries(tablesCheck).map(([table, status]) => (
                  <Alert 
                    key={table}
                    variant={status.exists && status.rowCount > 0 ? 'default' : 'destructive'}
                  >
                    {status.exists && status.rowCount > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : status.exists ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertTitle>{table.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Table</AlertTitle>
                    <AlertDescription>
                      {status.exists 
                        ? `Table exists with ${status.rowCount} rows` 
                        : 'Table is missing or inaccessible'}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
            
            {detailedReport && (
              <div>
                <h3 className="font-semibold mb-2">Detailed Report</h3>
                <div 
                  className="border rounded p-4 bg-gray-50 max-h-64 overflow-y-auto text-xs"
                  dangerouslySetInnerHTML={{ __html: detailedReport }}
                />
              </div>
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
