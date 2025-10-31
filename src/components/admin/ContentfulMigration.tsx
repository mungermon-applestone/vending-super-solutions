import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Database, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MigrationResult {
  success: boolean;
  entryId: string;
  entryTitle?: string;
  message: string;
  sourceTextLength?: number;
}

interface MigrationSummary {
  success: boolean;
  totalEntries: number;
  successCount: number;
  skipCount: number;
  errorCount: number;
  results: MigrationResult[];
  errors: string[];
}

export const ContentfulMigration: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<MigrationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async () => {
    setIsRunning(true);
    setError(null);
    setSummary(null);
    
    toast.info('Starting Contentful migration...');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'migrate-contentful-hero',
        {
          body: {}
        }
      );

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!data) {
        throw new Error('No response from migration function');
      }

      setSummary(data);
      
      if (data.success) {
        toast.success(`Migration completed! ${data.successCount} entries migrated successfully.`);
      } else {
        toast.error(`Migration completed with errors. ${data.errorCount} entries failed.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Migration failed: ${errorMessage}`);
      console.error('Migration error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Migration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Contentful Hero Description Migration
          </CardTitle>
          <CardDescription>
            Copy content from <code className="text-xs bg-muted px-1 py-0.5 rounded">heroDescription</code> to{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">heroDescription2</code> (RichText format)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Before you start</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Make sure you've completed the following in Contentful:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Added a new field <code className="bg-muted px-1 py-0.5 rounded">heroDescription2</code> with type <strong>RichText</strong></li>
                <li>Published the content type changes</li>
              </ul>
              <p className="mt-3 text-sm">
                This migration will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Convert plain text to RichText Document format</li>
                <li>Preserve paragraph breaks (splits on double line breaks)</li>
                <li>Skip entries where source is empty or target already has content</li>
                <li>Publish updated entries automatically</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <Button 
              onClick={runMigration} 
              disabled={isRunning}
              size="lg"
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Spinner size="sm" />
                  Running Migration...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  Run Migration
                </>
              )}
            </Button>
            
            {summary && (
              <Button 
                onClick={runMigration} 
                variant="outline"
                disabled={isRunning}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Migration Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Display */}
      {summary && (
        <Card className={summary.success ? 'border-green-500' : 'border-amber-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {summary.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              Migration Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {summary.totalEntries}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {summary.successCount}
                </div>
                <div className="text-sm text-muted-foreground">Migrated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.skipCount}
                </div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {summary.errorCount}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>

            {/* Results Details */}
            {summary.results.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Details:</h4>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {summary.results.map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-sm"
                    >
                      {result.success ? (
                        result.message.includes('Skipped') ? (
                          <Badge variant="secondary" className="shrink-0">Skip</Badge>
                        ) : (
                          <Badge variant="default" className="shrink-0 bg-green-500">OK</Badge>
                        )
                      ) : (
                        <Badge variant="destructive" className="shrink-0">Err</Badge>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {result.entryTitle || result.entryId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.message}
                          {result.sourceTextLength && ` (${result.sourceTextLength} chars)`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {summary.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Errors Encountered</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    {summary.errors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Next Steps */}
            {summary.successCount > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription>
                  <ol className="list-decimal list-inside text-sm space-y-1 mt-2">
                    <li>Verify the migrated content in Contentful</li>
                    <li>Delete the old <code className="bg-muted px-1 py-0.5 rounded">heroDescription</code> field</li>
                    <li>Rename <code className="bg-muted px-1 py-0.5 rounded">heroDescription2</code> to{' '}
                      <code className="bg-muted px-1 py-0.5 rounded">heroDescription</code></li>
                    <li>Deploy code changes to use RichText rendering</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentfulMigration;
