
import React, { useEffect } from 'react';
import { generateMigrationReport } from '@/services/cms/utils/migrationHelpers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { logDeprecation } from '@/services/cms/utils/deprecation';
import { Button } from '@/components/ui/button';

interface LegacyStatusBannerProps {
  contentType?: string;
  showDetails?: boolean;
  variant?: 'info' | 'warning';
}

/**
 * A global banner component to display migration status information
 * to be used across the application to inform users about the ongoing
 * migration to Contentful
 */
const LegacyStatusBanner: React.FC<LegacyStatusBannerProps> = ({
  contentType,
  showDetails = false,
  variant = 'info'
}) => {
  // Generate the migration report
  const report = React.useMemo(() => generateMigrationReport(), []);
  
  // Track usage of this component
  useEffect(() => {
    logDeprecation(
      'LegacyStatusBanner',
      `User viewed migration status for ${contentType || 'all content'}`,
      'Contentful directly'
    );
  }, [contentType]);
  
  // Find the status for this specific content type
  const contentTypeInfo = contentType 
    ? report.contentTypes.find(ct => 
        ct.name.toLowerCase() === contentType.toLowerCase()
      )
    : null;
  
  // Determine text color based on variant
  const textColor = variant === 'warning' ? 'text-amber-700' : 'text-blue-700';
  const bgColor = variant === 'warning' ? 'bg-amber-50' : 'bg-blue-50';
  const borderColor = variant === 'warning' ? 'border-amber-200' : 'border-blue-200';
  
  return (
    <Alert className={`${bgColor} ${borderColor} mb-6`}>
      <Info className="h-5 w-5 text-blue-600" />
      <AlertDescription>
        <div className={textColor}>
          <p className="font-medium">
            {contentType
              ? `${contentType} Migration Status: ${contentTypeInfo?.status || 'Unknown'}`
              : 'CMS Migration Status'
            }
          </p>
          
          <p className="text-sm mt-1 opacity-90">
            We are transitioning all content management to Contentful CMS. 
            {contentTypeInfo?.status === 'completed'
              ? ' This content type has been fully migrated.'
              : contentTypeInfo?.status === 'in-progress'
                ? ' This content type is currently being migrated.'
                : contentTypeInfo?.status === 'pending'
                  ? ' Migration for this content type is scheduled.'
                  : ' Please use Contentful for all content management.'
            }
          </p>
          
          {showDetails && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mt-2">
                <span>Overall migration progress: </span>
                <span className="font-semibold">{report.completionPercentage}%</span>
              </div>
              <div className="w-full bg-blue-200/50 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${report.completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex gap-2 justify-between text-xs mt-2">
                <span>{report.stats.completed} completed</span>
                <span>{report.stats.inProgress} in progress</span>
                <span>{report.stats.pending} pending</span>
              </div>
            </div>
          )}
          
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => window.open('https://app.contentful.com/', '_blank')}
            >
              Open Contentful
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default LegacyStatusBanner;
