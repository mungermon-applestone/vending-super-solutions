
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { initCMS } from '@/services/cms/cmsInit';
import { useToast } from '@/hooks/use-toast';
import DeprecationMonitor from './debug/DeprecationMonitor';

/**
 * Root component for admin pages that initializes CMS and provides
 * common functionality across all admin routes
 */
const AdminRoot: React.FC = () => {
  const { toast } = useToast();
  
  // Initialize CMS when admin section is loaded
  useEffect(() => {
    const setupCms = async () => {
      try {
        await initCMS();
      } catch (error) {
        console.error('Failed to initialize CMS:', error);
        toast({
          variant: 'destructive',
          title: 'CMS Initialization Failed',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    };
    
    setupCms();
  }, [toast]);
  
  return (
    <>
      <Outlet />
      {process.env.NODE_ENV === 'development' && <DeprecationMonitor />}
    </>
  );
};

export default AdminRoot;
