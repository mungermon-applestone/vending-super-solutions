
import React from 'react';
import { Loader2 } from 'lucide-react';

const BusinessGoalsLoader = () => {
  return (
    <div className="flex justify-center items-center py-24">
      <Loader2 className="h-12 w-12 animate-spin text-vending-blue" />
      <span className="ml-3 text-xl">Loading page content...</span>
    </div>
  );
};

export default BusinessGoalsLoader;
