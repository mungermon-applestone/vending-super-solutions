
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, AlertTriangle, Database, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { migrateBusinessGoalData } from '@/utils/businessGoalMigration';
import { migrateMachinesData } from '@/utils/machineMigration';
import { migrateTechnologyData } from '@/utils/technologyMigration';
import { useCMSSynchronization, syncableContentTypes, SyncSummary } from '@/services/cms/utils/dataSynchronization';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { ContentProviderType } from '@/services/cms/adapters/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { testCMSConnection } from '@/services/cms/utils/connection';

const MigrateCmsData = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResults, setMigrationResults] = useState<Record<string, any>>({});
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [syncDirection, setSyncDirection] = useState<'push' | 'pull'>('push');
  const [syncProgress, setSyncProgress] = useState<{
    contentType: string;
    current: number;
    total: number;
  } | null>(null);
  const [syncErrors, setSyncErrors] = useState<Array<{
    contentType: string;
    message: string;
  }>>([]);
  const [syncSummary, setSyncSummary] = useState<SyncSummary | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  }>({ tested: false, success: false, message: '' });
  
  const cmsInfo = getCMSInfo();
  const { synchronizeData, canSynchronizeData } = useCMSSynchronization();

  // Handle content type selection
  const handleContentTypeToggle = (contentTypeId: string) => {
    setSelectedContentTypes(prev => 
      prev.includes(contentTypeId)
        ? prev.filter(type => type !== contentTypeId)
        : [...prev, contentTypeId]
    );
  };

  // Handle connection test
  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testCMSConnection();
      setConnectionStatus({
        tested: true,
        success: result.success,
        message: result.message
      });
      
      toast({
        title: result.success ? "Connection Successful" : "Connection Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error testing connection:", error);
      setConnectionStatus({
        tested: true,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      });
      
      toast({
        title: "Connection Test Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start migration for the specified content type
  const handleMigrate = async (contentType: string) => {
    setIsLoading(true);
    try {
      let result;
      
      switch (contentType) {
        case 'machines':
          result = await migrateMachinesData();
          break;
        case 'technologies':
          result = await migrateTechnologyData();
          break;
        case 'business_goals':
          result = await migrateBusinessGoalData();
          break;
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }
      
      setMigrationResults(prev => ({
        ...prev,
        [contentType]: result
      }));
      
      toast({
        title: "Migration Successful",
        description: `Successfully migrated ${contentType.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error(`Error migrating ${contentType}:`, error);
      
      toast({
        title: "Migration Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sync data
  const handleSyncData = async () => {
    if (selectedContentTypes.length === 0) {
      toast({
        title: "No Content Types Selected",
        description: "Please select at least one content type to synchronize.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setSyncErrors([]);
    setSyncProgress(null);
    setSyncSummary(null);
    
    try {
      const summary = await synchronizeData({
        contentTypes: selectedContentTypes,
        direction: syncDirection,
        onProgress: (contentType, progress, total) => {
          setSyncProgress({
            contentType,
            current: progress,
            total
          });
        },
        onError: (contentType, error) => {
          setSyncErrors(prev => [...prev, {
            contentType,
            message: error.message
          }]);
        },
        onComplete: (summary) => {
          setSyncSummary(summary);
        }
      });
    } catch (error) {
      console.error("Error synchronizing data:", error);
      
      toast({
        title: "Synchronization Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setSyncProgress(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">CMS Data Migration & Synchronization</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="setup">Setup & Connection</TabsTrigger>
            <TabsTrigger value="migrate">Local Data Migration</TabsTrigger>
            <TabsTrigger value="sync">CMS Synchronization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>CMS Connection Setup</CardTitle>
                <CardDescription>
                  Configure and test your connection to external CMS systems like Strapi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-semibold mb-1">Current CMS Configuration</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Provider:</strong> {cmsInfo.provider}</p>
                    <p><strong>Status:</strong> {cmsInfo.status}</p>
                    {cmsInfo.apiUrl && <p><strong>API URL:</strong> {cmsInfo.apiUrl}</p>}
                    {cmsInfo.adminUrl && <p><strong>Admin URL:</strong> <a href={cmsInfo.adminUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{cmsInfo.adminUrl}</a></p>}
                  </div>
                </div>
                
                {cmsInfo.provider === 'Strapi' && (
                  <div className="space-y-4">
                    <Button onClick={handleTestConnection} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing Connection...
                        </>
                      ) : (
                        "Test Connection"
                      )}
                    </Button>
                    
                    {connectionStatus.tested && (
                      <Alert variant={connectionStatus.success ? "default" : "destructive"}>
                        {connectionStatus.success ? 
                          <CheckCircle2 className="h-4 w-4" /> : 
                          <AlertTriangle className="h-4 w-4" />
                        }
                        <AlertTitle>
                          {connectionStatus.success ? "Connection Successful" : "Connection Failed"}
                        </AlertTitle>
                        <AlertDescription>
                          {connectionStatus.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="bg-amber-50 border border-amber-200 rounded p-4">
                      <h3 className="text-amber-800 font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Strapi Setup Instructions
                      </h3>
                      <p className="text-amber-700 text-sm mt-1">
                        To properly configure Strapi integration, make sure you:
                      </p>
                      <ol className="text-amber-700 text-sm mt-2 list-decimal list-inside space-y-1">
                        <li>Set <code className="bg-amber-100 px-1 rounded">VITE_CMS_PROVIDER=strapi</code> in your .env file</li>
                        <li>Set <code className="bg-amber-100 px-1 rounded">VITE_STRAPI_API_URL=http://your-strapi-server:1337/api</code> to point to your Strapi API</li>
                        <li>Set <code className="bg-amber-100 px-1 rounded">VITE_STRAPI_API_KEY=your_api_key</code> for authenticated API access</li>
                        <li>Create matching content types in your Strapi instance</li>
                        <li>Configure proper permissions for your API token in Strapi</li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/admin/settings')}>
                  Go to Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="migrate">
            <Card>
              <CardHeader>
                <CardTitle>Local Data Migration</CardTitle>
                <CardDescription>
                  Migrate sample data from static files to your local database.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  These tools will import sample data into your primary database (Supabase).
                  Use these before attempting to sync with external CMS systems.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {/* Machines Migration */}
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Machines</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        Import sample machine data into Supabase.
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleMigrate('machines')}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Migrating...
                          </>
                        ) : (
                          <>
                            <Database className="mr-2 h-4 w-4" />
                            Migrate Machines
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Technologies Migration */}
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Technologies</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        Import sample technology data into Supabase.
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleMigrate('technologies')}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Migrating...
                          </>
                        ) : (
                          <>
                            <Database className="mr-2 h-4 w-4" />
                            Migrate Technologies
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Business Goals Migration */}
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Business Goals</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        Import sample business goal data into Supabase.
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleMigrate('business_goals')}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Migrating...
                          </>
                        ) : (
                          <>
                            <Database className="mr-2 h-4 w-4" />
                            Migrate Business Goals
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {Object.keys(migrationResults).length > 0 && (
                  <div className="mt-6 bg-muted p-4 rounded-md">
                    <h3 className="font-semibold mb-2">Migration Results</h3>
                    <div className="space-y-2">
                      {Object.entries(migrationResults).map(([contentType, result]) => (
                        <div key={contentType} className="bg-background p-3 rounded border">
                          <h4 className="font-medium">{contentType.replace('_', ' ')} Migration</h4>
                          <pre className="text-xs mt-2 overflow-auto max-h-40">
                            {JSON.stringify(result, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <CardTitle>CMS Synchronization</CardTitle>
                <CardDescription>
                  Synchronize content between CMS systems.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cmsInfo.provider === 'Strapi' && cmsInfo.status === 'configured' ? (
                  <>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div className="space-y-4 w-full md:w-1/2">
                        <h3 className="font-medium">Content Types to Synchronize</h3>
                        <div className="space-y-2">
                          {syncableContentTypes.map((contentType) => (
                            <div key={contentType.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`content-${contentType.id}`} 
                                checked={selectedContentTypes.includes(contentType.id)}
                                onCheckedChange={() => handleContentTypeToggle(contentType.id)}
                              />
                              <Label 
                                htmlFor={`content-${contentType.id}`} 
                                className="cursor-pointer"
                              >
                                {contentType.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4 w-full md:w-1/2">
                        <h3 className="font-medium">Synchronization Direction</h3>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="push" 
                              name="direction" 
                              value="push"
                              checked={syncDirection === 'push'}
                              onChange={() => setSyncDirection('push')}
                              className="cursor-pointer"
                            />
                            <Label htmlFor="push" className="cursor-pointer flex items-center">
                              <ArrowUpFromLine className="h-4 w-4 mr-2" />
                              Push to Strapi (Supabase → Strapi)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="pull" 
                              name="direction" 
                              value="pull"
                              checked={syncDirection === 'pull'}
                              onChange={() => setSyncDirection('pull')}
                              className="cursor-pointer"
                            />
                            <Label htmlFor="pull" className="cursor-pointer flex items-center">
                              <ArrowDownToLine className="h-4 w-4 mr-2" />
                              Pull from Strapi (Strapi → Supabase)
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleSyncData}
                        disabled={isLoading || selectedContentTypes.length === 0}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Synchronizing Data...
                          </>
                        ) : (
                          "Start Synchronization"
                        )}
                      </Button>
                    </div>
                    
                    {syncProgress && (
                      <div className="pt-4">
                        <div className="mb-2 flex justify-between text-sm">
                          <span>Syncing {syncProgress.contentType.replace('_', ' ')}...</span>
                          <span>{syncProgress.current} of {syncProgress.total}</span>
                        </div>
                        <Progress 
                          value={(syncProgress.current / syncProgress.total) * 100}
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    {syncErrors.length > 0 && (
                      <div className="mt-4">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Synchronization Errors</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside text-sm mt-1">
                              {syncErrors.map((error, index) => (
                                <li key={index}>
                                  {error.contentType}: {error.message}
                                </li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                    
                    {syncSummary && (
                      <div className="mt-4 bg-muted p-4 rounded-md">
                        <h3 className="font-semibold mb-2">Synchronization Summary</h3>
                        <div className="text-sm">
                          <p>Start time: {syncSummary.startTime.toLocaleString()}</p>
                          <p>End time: {syncSummary.endTime.toLocaleString()}</p>
                          <p>Total items: {syncSummary.totalItems}</p>
                          <p>Success: {syncSummary.successCount}</p>
                          <p>Errors: {syncSummary.errorCount}</p>
                          
                          <h4 className="font-medium mt-2">Content Types:</h4>
                          <ul className="list-disc list-inside mt-1">
                            {syncSummary.contentTypes.map((type, index) => (
                              <li key={index}>
                                {type.type.replace('_', ' ')}: {type.success} successes, {type.errors} errors
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Alert variant="warning" className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">CMS Configuration Required</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      {cmsInfo.provider === 'Strapi' 
                        ? `Strapi CMS is not fully configured. Current status: ${cmsInfo.status}.` 
                        : 'Synchronization is only available when using Strapi as the CMS provider.'
                      }
                      <br />
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-amber-800 underline"
                        onClick={() => setActiveTab('setup')}
                      >
                        Go to Setup & Connection
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MigrateCmsData;
