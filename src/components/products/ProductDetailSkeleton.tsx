
import React from 'react';

const ProductDetailSkeleton = () => {
  return (
    <div className="container-wide py-16">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
