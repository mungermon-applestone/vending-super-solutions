
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CloneButtonProps {
  onClone: () => Promise<void>;
  itemName: string;
  isCloning?: boolean;
}

/**
 * Reusable clone button component for admin interfaces
 */
const CloneButton: React.FC<CloneButtonProps> = ({ 
  onClone, 
  itemName, 
  isCloning = false 
}) => {
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      await onClone();
      // Note: We don't need to show a toast here as the parent component will handle that
      // This avoids duplicate toast messages
    } catch (error) {
      console.error('Error cloning item:', error);
      toast({
        title: "Error",
        description: `Failed to clone ${itemName}. ${error instanceof Error ? error.message : ''}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isCloning}
      className="flex items-center gap-1"
      title={`Clone ${itemName}`}
    >
      {isCloning ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-1" /> Cloning...
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" /> Clone
        </>
      )}
    </Button>
  );
};

export default CloneButton;
