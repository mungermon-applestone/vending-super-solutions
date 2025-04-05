
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAdminAlert = () => {
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin/')) {
      toast({
        title: 'Admin Mode',
        description: 'You are currently in admin mode. Changes will affect live data.',
        variant: 'default',
        duration: 5000,
      });
    }
  }, [location.pathname, toast]);
};

export default useAdminAlert;
