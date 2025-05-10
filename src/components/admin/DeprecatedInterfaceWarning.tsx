
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DeprecatedInterfaceWarningProps {
  contentType: string;
  message?: string;
}

const DeprecatedInterfaceWarning: React.FC<DeprecatedInterfaceWarningProps> = ({
  contentType,
  message = "This admin interface is deprecated and will be removed in a future version."
}) => {
  return (
    <Alert variant="warning">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>Deprecated {contentType} Interface</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default DeprecatedInterfaceWarning;
