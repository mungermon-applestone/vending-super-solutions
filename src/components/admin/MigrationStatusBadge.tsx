
import React from 'react';
import { MIGRATION_STATUS } from '@/services/cms/utils/deprecationConstants';

interface MigrationStatusBadgeProps {
  status: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Component to display the migration status of a content type
 */
const MigrationStatusBadge: React.FC<MigrationStatusBadgeProps> = ({
  status,
  showLabel = true,
  size = 'md'
}) => {
  // Map status to visual style
  const getStatusStyles = () => {
    switch (status) {
      case MIGRATION_STATUS.COMPLETE:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          label: 'Completed'
        };
      case MIGRATION_STATUS.IN_PROGRESS:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          label: 'In Progress'
        };
      case MIGRATION_STATUS.PENDING:
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          border: 'border-amber-200',
          label: 'Pending'
        };
      case MIGRATION_STATUS.NOT_STARTED:
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          label: 'Not Started'
        };
    }
  };

  const styles = getStatusStyles();
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1'
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full ${styles.bg} ${styles.text} ${styles.border} border ${sizeClasses[size]}`}
      title={`Migration Status: ${styles.label}`}
    >
      <span className={`rounded-full ${size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'} mr-1 ${status === MIGRATION_STATUS.COMPLETE ? 'bg-green-500' : status === MIGRATION_STATUS.IN_PROGRESS ? 'bg-blue-500' : status === MIGRATION_STATUS.PENDING ? 'bg-amber-500' : 'bg-gray-500'}`}></span>
      {showLabel && (
        <span className="font-medium">{styles.label}</span>
      )}
    </span>
  );
};

export default MigrationStatusBadge;
