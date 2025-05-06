
import React from 'react'

interface ContentfulDiagnosticsProps {
  slug: string;
  productId: string;
}

export default function ContentfulDiagnostics({ slug, productId }: ContentfulDiagnosticsProps) {
  return (
    <div className="mb-4 border border-blue-100 rounded-md bg-blue-50">
      <details className="text-blue-800">
        <summary className="p-4 cursor-pointer font-medium flex items-center">
          <span className="text-blue-600 mr-2">ℹ</span> Contentful Diagnostic Information
        </summary>
        <div className="p-4 pt-0 border-t border-blue-100 text-sm">
          <details className="mb-2">
            <summary className="cursor-pointer p-2 hover:bg-blue-100 rounded">Request Information</summary>
            <div className="pl-4 pt-2 text-gray-600">
              <p>Product Slug: {slug}</p>
              <p>Product ID: {productId}</p>
            </div>
          </details>
          <details>
            <summary className="cursor-pointer p-2 hover:bg-blue-100 rounded">Contentful Configuration</summary>
            <div className="pl-4 pt-2 text-gray-600">
              <p>Space ID: {process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}</p>
              <p>Environment: {process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'}</p>
            </div>
          </details>
        </div>
      </details>
    </div>
  )
}
