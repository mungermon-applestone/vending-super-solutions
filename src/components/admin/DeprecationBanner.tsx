
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { logDeprecation } from '@/services/cms/utils/deprecation';
import { generateMigrationReport } from '@/services/cms/utils/migrationHelpers';
import ViewInContentful from './ViewInContentful';

interface DeprecationBannerProps {
  showDetails?: boolean;
}

/**
 * Banner to display across deprecated admin interfaces
 * to inform users about the transition to Contentful
 */
const DeprecationBanner: React.FC<DeprecationBannerProps> = ({ showDetails = false }) => {
  // Track usage of the deprecated interface
  React.useEffect(() => {
    logDeprecation(
      'DeprecationBanner', 
      'User viewed a deprecated admin interface',
      'Use Contentful directly for content management'
    );
  }, []);
  
  const report = React.useMemo(() => generateMigrationReport(), []);
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
        <div>
          <h3 className="text-amber-800 font-medium">Admin Interface Migration Notice</h3>
          <p className="text-amber-700 text-sm mt-1">
            We are migrating all content management to Contentful. This admin interface 
            is in read-only mode and will be removed in a future update.
          </p>
          
          {showDetails && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-amber-700 mt-2">
                <span>Migration progress: </span>
                <span className="font-semibold">{report.completionPercentage}%</span>
              </div>
              <div className="w-full bg-amber-200/50 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-amber-500 h-1.5 rounded-full" 
                  style={{ width: `${report.completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex gap-2 justify-between text-xs mt-2 text-amber-700">
                <span>{report.stats.completed} completed</span>
                <span>{report.stats.inProgress} in progress</span>
                <span>{report.stats.pending} pending</span>
              </div>
            </div>
          )}
          
          <div className="mt-3">
            <ViewInContentful />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeprecationBanner;
