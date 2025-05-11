
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import MigrationStatusAlert from './contentful/MigrationStatusAlert';

interface MigrationProgressBannerProps {
  contentType: string;
  status: 'in-progress' | 'completed' | 'pending';
  progress?: number;
  description?: string;
  showContentfulButton?: boolean;
  className?: string;
}

/**
 * Component to display migration progress for admin interfaces
 * Used to communicate the status of content migration to Contentful
 */
const MigrationProgressBanner: React.FC<MigrationProgressBannerProps> = ({
  contentType,
  status,
  progress = 100,
  description,
  showContentfulButton = true,
  className = ''
}) => {
  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <Card className={`shadow-sm mb-6 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {contentType} Migration Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MigrationStatusAlert 
          status={status}
          description={description || getDefaultDescription(contentType, status)}
          className="mb-4"
        />
        
        {status !== 'completed' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Migration Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {showContentfulButton && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={handleOpenContentful} 
              className="w-full sm:w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Contentful
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function getDefaultDescription(contentType: string, status: 'in-progress' | 'completed' | 'pending'): string {
  switch (status) {
    case 'completed':
      return `All ${contentType} content has been migrated to Contentful.`;
    case 'in-progress':
      return `${contentType} content is currently being migrated to Contentful.`;
    case 'pending':
      return `${contentType} content will be migrated to Contentful in the future.`;
    default:
      return '';
  }
}

export default MigrationProgressBanner;
