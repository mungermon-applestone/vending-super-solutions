
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  SyncOptions, 
  SyncStatus, 
  SyncSummary,
  useCMSSynchronization, 
  syncableContentTypes
} from '@/services/cms/utils/dataSynchronization';
import { 
  ArrowLeftRight, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  AlertCircle, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';

const ContentSynchronization: React.FC = () => {
  const { synchronizeData, canSynchronizeData } = useCMSSynchronization();
  const cmsInfo = getCMSInfo();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [direction, setDirection] = useState<'push' | 'pull'>('push');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    inProgress: false,
    progress: null,
    errors: []
  });
  
  const handleSelectType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleSelectAll = () => {
    if (selectedTypes.length === syncableContentTypes.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(syncableContentTypes.map(t => t.id));
    }
  };

  const handleStartSync = async () => {
    if (selectedTypes.length === 0) return;
    
    setSyncStatus({
      inProgress: true,
      progress: null,
      errors: []
    });
    
    try {
      const summary = await synchronizeData({
        contentTypes: selectedTypes,
        direction,
        onProgress: (contentType, progress, total) => {
          setSyncStatus(prev => ({
            ...prev,
            progress: { contentType, current: progress, total }
          }));
        },
        onError: (contentType, error) => {
          setSyncStatus(prev => ({
            ...prev,
            errors: [...prev.errors, { contentType, message: error.message }]
          }));
        }
      });
      
      setSyncStatus(prev => ({
        ...prev,
        inProgress: false,
        summary
      }));
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        inProgress: false,
        errors: [...prev.errors, { 
          contentType: 'general', 
          message: error instanceof Error ? error.message : String(error)
        }]
      }));
    }
  };

  if (!canSynchronizeData()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Synchronization</CardTitle>
          <CardDescription>
            Transfer content between CMS providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              Content synchronization requires both Strapi and Supabase to be configured. 
              Please configure your Strapi integration in the CMS settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Synchronization</CardTitle>
            <CardDescription>
              Transfer content between {cmsInfo.provider === 'Strapi' ? 'Supabase and Strapi' : 'CMS providers'}
            </CardDescription>
          </div>
          <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Sync Direction</h3>
          <div className="flex gap-4">
            <Button
              variant={direction === 'push' ? "default" : "outline"}
              onClick={() => setDirection('push')}
              className="flex-1"
              disabled={syncStatus.inProgress}
            >
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Push to {cmsInfo.provider}
            </Button>
            
            <Button
              variant={direction === 'pull' ? "default" : "outline"}
              onClick={() => setDirection('pull')}
              className="flex-1"
              disabled={syncStatus.inProgress}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Pull from {cmsInfo.provider}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {direction === 'push' ? 
              `Push content from Supabase to ${cmsInfo.provider}` : 
              `Pull content from ${cmsInfo.provider} to Supabase`}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Content Types</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSelectAll}
              disabled={syncStatus.inProgress}
            >
              {selectedTypes.length === syncableContentTypes.length ? "Deselect all" : "Select all"}
            </Button>
          </div>
          
          <div className="space-y-2">
            {syncableContentTypes.map(type => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type.id}`}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => handleSelectType(type.id)}
                  disabled={syncStatus.inProgress}
                />
                <label 
                  htmlFor={`type-${type.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {syncStatus.inProgress && syncStatus.progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Syncing {syncStatus.progress.contentType}
              </span>
              <span>
                {syncStatus.progress.current}/{syncStatus.progress.total}
              </span>
            </div>
            <Progress 
              value={(syncStatus.progress.current / syncStatus.progress.total) * 100} 
            />
          </div>
        )}

        {syncStatus.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium">Errors occurred during synchronization:</div>
              <ul className="list-disc pl-5 mt-2 text-sm">
                {syncStatus.errors.map((error, i) => (
                  <li key={i}>
                    {error.contentType !== 'general' && <span className="font-medium">{error.contentType}: </span>}
                    {error.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {syncStatus.summary && (
          <Alert variant="default" className={
            syncStatus.summary.errorCount > 0 
              ? "bg-yellow-50 border-yellow-200" 
              : "bg-green-50 border-green-200"
          }>
            {syncStatus.summary.errorCount > 0 ? (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={
              syncStatus.summary.errorCount > 0 
                ? "text-yellow-700"
                : "text-green-700"
            }>
              <div className="font-medium">
                {syncStatus.summary.errorCount > 0 
                  ? "Synchronization completed with some issues:" 
                  : "Synchronization completed successfully:"}
              </div>
              <div className="mt-1 text-sm">
                ✓ {syncStatus.summary.successCount} items synced successfully
                {syncStatus.summary.errorCount > 0 && (
                  <div>✗ {syncStatus.summary.errorCount} items failed to sync</div>
                )}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Completed in {
                  Math.round((syncStatus.summary.endTime.getTime() - syncStatus.summary.startTime.getTime()) / 100) / 10
                } seconds
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleStartSync} 
          disabled={syncStatus.inProgress || selectedTypes.length === 0}
          className="w-full"
        >
          {syncStatus.inProgress ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Synchronizing...
            </>
          ) : (
            <>
              {direction === 'push' ? (
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
              ) : (
                <ArrowDownToLine className="mr-2 h-4 w-4" />
              )}
              Start Synchronization
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentSynchronization;
