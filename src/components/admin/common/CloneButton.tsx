
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Copy } from 'lucide-react';

interface CloneButtonProps {
  onClone: () => Promise<void>;
  itemName: string;
  isCloning: boolean;
}

const CloneButton: React.FC<CloneButtonProps> = ({ onClone, itemName, isCloning }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClone}
      disabled={isCloning}
      title={`Clone ${itemName}`}
      className="flex items-center gap-1"
    >
      {isCloning ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Cloning...
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
