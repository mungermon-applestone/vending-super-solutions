
import React from 'react';
import { AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logDeprecation } from '@/services/cms/utils/deprecationUtils';

interface DeprecationBannerProps {
  title?: string;
  contentType?: string;
  message?: string;
  showContentfulLink?: boolean;
  showHelp?: boolean;
  variant?: 'warning' | 'info' | 'error';
  className?: string;
  onContentfulClick?: () => void;
  onHelpClick?: () => void;
}

/**
 * A standardized banner to show deprecation warnings across admin interfaces
 */
const DeprecationBanner: React.FC<DeprecationBannerProps> = ({
  title,
  contentType,
  message,
  showContentfulLink = true,
  showHelp = false,
  variant = 'warning',
  className = '',
  onContentfulClick,
  onHelpClick
}) => {
  // Determine the banner style based on variant
  const getVariantStyles = (): { bg: string; border: string; text: string; icon: React.ReactNode } => {
    switch (variant) {
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          text: 'text-blue-800',
          icon: <HelpCircle className="h-5 w-5 text-blue-500" />
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-800',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />
        };
      case 'warning':
      default:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          text: 'text-amber-800',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
        };
    }
  };

  const styles = getVariantStyles();

  // Build the title based on props or defaults
  const bannerTitle = title || (contentType 
    ? `Deprecated ${contentType} Interface`
    : "Deprecated Interface");

  // Build the message based on props or defaults
  const bannerMessage = message || (contentType
    ? `This ${contentType} management interface is deprecated and will be removed in future updates. Please use Contentful for content management.`
    : `This interface is deprecated and will be removed in future updates. Please use Contentful for content management.`);

  // Track usage of this deprecated interface
  React.useEffect(() => {
    logDeprecation(
      `DeprecationBanner-${contentType || 'unknown'}`,
      `User viewed deprecated interface for ${contentType || 'unknown'} content type`
    );
  }, [contentType]);

  // Handle opening Contentful
  const handleContentfulClick = () => {
    if (onContentfulClick) {
      onContentfulClick();
    } else {
      window.open("https://app.contentful.com/", "_blank");
    }
  };

  // Handle opening help
  const handleHelpClick = () => {
    if (onHelpClick) {
      onHelpClick();
    } else {
      window.open("/admin/contentful-migration-guide", "_blank");
    }
  };

  return (
    <div className={`${styles.bg} border ${styles.border} p-4 mb-6 rounded-md ${className}`}>
      <div className="flex items-start gap-3">
        {styles.icon}
        <div className="flex-1">
          <h3 className={`font-medium ${styles.text}`}>{bannerTitle}</h3>
          <p className={`${styles.text} mt-1 mb-3 opacity-90`}>
            {bannerMessage}
          </p>
          <div className="flex flex-wrap gap-3">
            {showContentfulLink && (
              <Button 
                variant="outline" 
                size="sm"
                className={`bg-white border-${styles.border} ${styles.text} hover:bg-opacity-80`}
                onClick={handleContentfulClick}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Contentful
              </Button>
            )}
            
            {showHelp && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={handleHelpClick}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Migration Guide
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeprecationBanner;
