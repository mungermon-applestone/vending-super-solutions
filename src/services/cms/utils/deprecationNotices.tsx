
import React from 'react';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { MESSAGES } from './deprecationConstants';

/**
 * Centralized deprecation notice utilities
 * All deprecation-related toast messages and UI notifications should use these functions
 */

/**
 * Show an admin interface deprecation toast notice
 */
export const showAdminInterfaceDeprecationNotice = () => {
  toast.warning(
    <div className="flex flex-col">
      <div className="font-medium">Admin Interface Deprecated</div>
      <div className="text-sm mt-1">{MESSAGES.USE_CONTENTFUL_INSTEAD}</div>
    </div>,
    {
      duration: 8000,
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    }
  );
};

/**
 * Show a read-only interface toast notice
 */
export const showReadOnlyInterfaceNotice = () => {
  toast.warning(
    <div className="flex flex-col">
      <div className="font-medium">Read-Only Interface</div>
      <div className="text-sm mt-1">{MESSAGES.READ_ONLY_WARNING}</div>
    </div>,
    {
      duration: 8000,
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    }
  );
};

/**
 * Show a content type migration notice
 * @param contentType The content type name
 * @param status Migration status
 */
export const showContentTypeMigrationNotice = (contentType: string, status: string) => {
  toast.info(
    <div className="flex flex-col">
      <div className="font-medium">Content Type Migration: {contentType}</div>
      <div className="text-sm mt-1">
        Migration status: {status}. {status !== 'complete' && MESSAGES.USE_CONTENTFUL_INSTEAD}
      </div>
    </div>,
    {
      duration: 6000,
    }
  );
};

/**
 * Show a migration in progress notice
 */
export const showMigrationInProgressNotice = () => {
  toast.info(
    <div className="flex flex-col">
      <div className="font-medium">Migration In Progress</div>
      <div className="text-sm mt-1">{MESSAGES.MIGRATION_IN_PROGRESS}</div>
    </div>,
    {
      duration: 6000,
    }
  );
};

/**
 * Show a redirect to Contentful notice
 * @param contentType The content type being redirected
 */
export const showRedirectToContentfulNotice = (contentType?: string) => {
  toast.info(
    <div className="flex flex-col">
      <div className="font-medium">Redirecting to Contentful</div>
      <div className="text-sm mt-1">
        {contentType 
          ? `Please manage ${contentType} content in Contentful`
          : 'Please use Contentful for content management'}
      </div>
    </div>,
    {
      duration: 4000,
    }
  );
};
