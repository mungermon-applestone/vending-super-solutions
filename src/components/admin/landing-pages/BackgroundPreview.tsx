
import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundPreviewProps {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  value,
  label,
  isSelected,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "h-24 rounded-md overflow-hidden cursor-pointer border-2",
        isSelected ? "border-vending-blue" : "border-transparent hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <div className={`${value} h-full w-full flex items-center justify-center p-2 text-center`}>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

export default BackgroundPreview;
