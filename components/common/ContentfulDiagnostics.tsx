
import React from 'react';

interface ContentfulDiagnosticsProps {
  slug?: string;
  productId?: string;
}

export default function ContentfulDiagnostics({ slug, productId }: ContentfulDiagnosticsProps) {
  return (
    <div className="text-xs bg-gray-100 p-4 rounded-md mb-4">
      <h4 className="font-bold mb-1">Contentful Diagnostic Info</h4>
      <div className="space-y-1">
        <p><strong>Next.js Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Space ID:</strong> {process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID || 'Not set'}</p>
        <p><strong>Environment:</strong> {process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || process.env.CONTENTFUL_ENVIRONMENT || 'master'}</p>
        <p><strong>Has Delivery Token:</strong> {(!!process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || !!process.env.CONTENTFUL_DELIVERY_TOKEN) ? 'Yes' : 'No'}</p>
        {slug && <p><strong>Current Slug:</strong> {slug}</p>}
        {productId && <p><strong>Product ID:</strong> {productId}</p>}
      </div>
    </div>
  );
}
