
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

type MigrationStatus = 'completed' | 'in-progress' | 'pending';

interface MigrationStatusAlertProps {
  status: MigrationStatus;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Component to display the migration status with consistent styling
 * Used in migration-related pages to indicate progress
 */
const MigrationStatusAlert: React.FC<MigrationStatusAlertProps> = ({
  status,
  title,
  description,
  className = ''
}) => {
  // Determine styling based on migration status
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          variant: 'success' as const, // Now using the success variant we added
          icon: <CheckCircle2 className="h-4 w-4" />,
          defaultTitle: 'Migration Complete',
          defaultDescription: 'This functionality has been fully migrated to Contentful.',
          text: 'text-green-800'
        };
      case 'in-progress':
        return {
          variant: 'warning' as const,
          icon: <Clock className="h-4 w-4" />,
          defaultTitle: 'Migration In Progress',
          defaultDescription: 'This functionality is currently being migrated to Contentful.',
          text: 'text-amber-800'
        };
      case 'pending':
        return {
          variant: 'default' as const,
          icon: <AlertTriangle className="h-4 w-4" />,
          defaultTitle: 'Migration Pending',
          defaultDescription: 'This functionality will be migrated to Contentful in the future.',
          text: 'text-gray-800'
        };
      default:
        return {
          variant: 'default' as const,
          icon: <AlertTriangle className="h-4 w-4" />,
          defaultTitle: 'Migration Status Unknown',
          defaultDescription: 'The status of this migration is unknown.',
          text: 'text-gray-800'
        };
    }
  };

  const statusStyles = getStatusStyles();
  const displayTitle = title || statusStyles.defaultTitle;
  const displayDescription = description || statusStyles.defaultDescription;

  return (
    <Alert 
      variant={statusStyles.variant} 
      className={className}
    >
      {statusStyles.icon}
      <AlertTitle className={`font-medium ${statusStyles.text}`}>{displayTitle}</AlertTitle>
      {displayDescription && (
        <AlertDescription className={`${statusStyles.text} opacity-90`}>
          {displayDescription}
        </AlertDescription>
      )}
    </Alert>
  );
};

export default MigrationStatusAlert;
