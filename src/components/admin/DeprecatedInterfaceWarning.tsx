
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import ViewInContentful from './ViewInContentful';
import { logDeprecation } from '@/services/cms/utils/deprecation';

interface DeprecatedInterfaceWarningProps {
  contentType: string;
  contentTypeId?: string;
  variant?: 'warning' | 'error' | 'info';
  message?: string;
  showContentfulButton?: boolean;
}

/**
 * Standardized warning component for deprecated admin interfaces
 */
const DeprecatedInterfaceWarning: React.FC<DeprecatedInterfaceWarningProps> = ({
  contentType,
  contentTypeId,
  variant = 'warning',
  message,
  showContentfulButton = true
}) => {
  // Track usage of the deprecated interface
  React.useEffect(() => {
    logDeprecation(
      `DeprecatedInterface-${contentType}`,
      `User accessed deprecated ${contentType} interface`,
      'Use Contentful directly'
    );
  }, [contentType]);
  
  // Determine styling based on variant
  const getStyles = () => {
    switch (variant) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <Info className="h-5 w-5 text-blue-600" />
        };
      case 'warning':
      default:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />
        };
    }
  };
  
  const styles = getStyles();
  const defaultMessage = `This ${contentType} interface is deprecated and will be removed in a future release. Please use Contentful directly for content management.`;
  
  return (
    <Alert className={`${styles.bg} ${styles.border} mb-6`}>
      {styles.icon}
      <AlertTitle className={styles.text}>
        {variant === 'error' ? 'Error:' : 'Migration Notice:'}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className={`${styles.text} opacity-90 mb-4`}>
          {message || defaultMessage}
        </p>
        
        {showContentfulButton && (
          <div className="mt-4">
            <ViewInContentful 
              contentType={contentTypeId || contentType.toLowerCase()}
              variant={variant === 'error' ? 'destructive' : 'default'}
              size="sm"
            />
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DeprecatedInterfaceWarning;
