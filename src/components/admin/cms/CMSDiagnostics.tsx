
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { runCMSDiagnostics, getCMSDiagnosticsReport } from '@/services/cms/utils/diagnostics';
import { AlertTriangle, CheckCircle, Info, XCircle, RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';

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

  // Define the list of tables we know exist in the Supabase schema
  const existingTables = [
    'admin_users',
    'business_goals',
    'contentful_config', 
    'machines', 
    'product_types',
    'technologies'
  ];

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const result = await runCMSDiagnostics();
      setDiagnostics(result);
      
      const report = await getCMSDiagnosticsReport();
      setDetailedReport(report);
      
      const tableChecks: any = {};

      // Only check tables that we know exist in the schema
      // Skip checking CMS tables if they are disabled
      for (const table of existingTables) {
        // Skip checking Supabase CMS tables if they are disabled
        if (!USE_SUPABASE_CMS && ['business_goals'].includes(table)) {
          tableChecks[table] = {
            exists: false,
            rowCount: 0
          };
          continue;
        }

        try {
          // Use as const to tell TypeScript this is a valid string literal
          const tableAsLiteral = table as const;
          
          const { data, error, count } = await supabase
            .from(tableAsLiteral)
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
      
      // Only check product_types if Supabase CMS is enabled
      if (USE_SUPABASE_CMS) {
        const { data, error, count } = await supabase
          .from('product_types')
          .select('*', { count: 'exact' })
          .range(0, 0);
        
        setProductTypeCheck({
          exists: !error,
          rowCount: count || 0,
          firstRow: data?.[0]
        });
      } else {
        setProductTypeCheck({
          exists: false,
          rowCount: 0
        });
      }
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
                    {!USE_SUPABASE_CMS && (
                      <div className="mt-1 text-yellow-600 font-medium">
                        Note: Supabase CMS is disabled via feature flag
                      </div>
                    )}
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
                    variant={(status.exists && status.rowCount > 0) || !USE_SUPABASE_CMS ? 'default' : 'destructive'}
                  >
                    {(status.exists && status.rowCount > 0) || !USE_SUPABASE_CMS ? (
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
                      {['business_goals'].includes(table) && !USE_SUPABASE_CMS && (
                        <div className="mt-1 text-yellow-600">
                          Note: This table check is skipped (Supabase CMS disabled)
                        </div>
                      )}
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
