
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MIGRATION_STATUS } from '@/services/cms/utils/deprecationConstants';

interface MigrationStatusBadgeProps {
  status: string;
}

/**
 * Component for displaying migration status with the appropriate styling
 */
const MigrationStatusBadge: React.FC<MigrationStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case MIGRATION_STATUS.COMPLETED:
        return 'success';
      case MIGRATION_STATUS.IN_PROGRESS:
        return 'warning';
      case MIGRATION_STATUS.PENDING:
      default:
        return 'outline';
    }
  };

  const variant = getStatusBadgeVariant(status);
  
  return <Badge variant={variant as any}>{status}</Badge>;
};

export default MigrationStatusBadge;
