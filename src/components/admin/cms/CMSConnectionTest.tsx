
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testContentfulConnection } from '@/services/cms/utils/connection';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

const CMSConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testContentfulConnection();

      if (result.success) {
        toast({
          title: 'Contentful Connection',
          description: result.message,
          variant: 'default',
          icon: <CheckCircle className="text-green-500" />
        });
      } else {
        toast({
          title: 'Connection Error',
          description: result.message,
          variant: 'destructive',
          icon: <AlertTriangle className="text-red-500" />
        });
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: 'Failed to test Contentful connection',
        variant: 'destructive',
        icon: <AlertTriangle className="text-red-500" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        onClick={handleConnectionTest} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Testing Connection...
          </>
        ) : (
          'Test Contentful Connection'
        )}
      </Button>
    </div>
  );
};

export default CMSConnectionTest;
