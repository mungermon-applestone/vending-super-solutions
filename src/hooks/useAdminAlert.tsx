
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAdminAlert = () => {
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin/')) {
      const isNewProduct = location.pathname.includes('/products/new');
      const isEditProduct = location.pathname.includes('/products/edit');
      
      let title = 'Admin Mode';
      let description = 'You are currently in admin mode. Changes will affect live data.';
      
      if (isNewProduct) {
        title = 'Creating New Product';
        description = 'You are creating a new product. This will be visible on the site after saving.';
      } else if (isEditProduct) {
        title = 'Editing Product';
        description = 'You are editing an existing product. Changes will be visible on the site after saving.';
      }
      
      toast({
        title,
        description,
        variant: 'default',
        duration: 5000,
      });
    }
  }, [location.pathname, toast]);
};

export default useAdminAlert;
