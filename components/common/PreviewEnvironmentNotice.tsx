
import { Check } from 'lucide-react';

export default function PreviewEnvironmentNotice() {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 mx-4 mt-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Check className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">Preview Environment Detected</h3>
          <p className="text-sm text-green-700 mt-1">
            Using Contentful credentials for preview environment. Space ID: {spaceId}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Ready
          </span>
        </div>
      </div>
    </div>
  );
}
