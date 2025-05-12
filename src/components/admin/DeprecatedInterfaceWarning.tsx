
import React, { useEffect } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logDeprecation, getContentfulRedirectUrl } from '@/services/cms/utils/deprecationUtils';

interface DeprecatedInterfaceWarningProps {
  contentType?: string;
  contentTypeId?: string;
  title?: string;
  message?: string;
  showContentfulLink?: boolean;
  variant?: 'warning' | 'info' | 'error';
  expectedRemovalDate?: string;
  onContentfulClick?: () => void;
}

/**
 * A standardized warning component for deprecated interfaces
 * Provides clear messaging and links to Contentful
 */
const DeprecatedInterfaceWarning: React.FC<DeprecatedInterfaceWarningProps> = ({ 
  contentType,
  contentTypeId,
  title,
  message,
  showContentfulLink = true,
  variant = 'warning',
  expectedRemovalDate = 'July 2025',
  onContentfulClick
}) => {
  // Use title+contentType for header or default to "Deprecated Interface"
  const displayTitle = title || (contentType ? `Deprecated ${contentType} Interface` : "Deprecated Interface");
  
  // Build the message based on provided props
  const defaultMessage = contentType 
    ? `This ${contentType} interface is deprecated and will be removed in ${expectedRemovalDate}. Please use Contentful for content management.`
    : `This interface is deprecated and will be removed in ${expectedRemovalDate}. Please use Contentful for content management.`;
  
  const displayMessage = message || defaultMessage;
  
  // Set the actual content type ID if not provided
  const actualContentTypeId = contentTypeId || 
    (contentType ? contentType.toLowerCase().replace(/\s+/g, '-') : undefined);

  // Track usage of this deprecated interface
  useEffect(() => {
    logDeprecation(
      `DeprecatedInterfaceWarning-${contentType || 'unknown'}`,
      `User viewed deprecated interface for ${contentType || 'unknown'} content type`,
      "Use Contentful directly"
    );
  }, [contentType]);
  
  const handleOpenContentful = () => {
    if (onContentfulClick) {
      onContentfulClick();
    } else {
      const url = actualContentTypeId 
        ? getContentfulRedirectUrl(actualContentTypeId) 
        : "https://app.contentful.com/";
      
      window.open(url, "_blank");
    }
  };

  // Get style variables based on variant
  const getVariantStyles = () => {
    switch(variant) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-400',
          text: 'text-red-800',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          text: 'text-blue-800',
          icon: <ExternalLink className="h-5 w-5 text-blue-500" />
        };
      case 'warning':
      default:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-400',
          text: 'text-amber-800',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.bg} border-l-4 ${styles.border} p-4 mb-6 rounded-r-md`}>
      <div className="flex items-start gap-3">
        {styles.icon}
        <div className="flex-1">
          <h3 className={`font-medium ${styles.text}`}>{displayTitle}</h3>
          <p className={`${styles.text} mt-1 mb-3 opacity-90`}>
            {displayMessage}
          </p>
          {showContentfulLink && (
            <Button 
              variant="outline" 
              size="sm"
              className={`bg-white border-${styles.border} ${styles.text} hover:bg-opacity-80`}
              onClick={handleOpenContentful}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {contentType ? `Open ${contentType} in Contentful` : 'Open Contentful'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeprecatedInterfaceWarning;
