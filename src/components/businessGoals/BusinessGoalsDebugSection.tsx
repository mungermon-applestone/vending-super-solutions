
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { BusinessGoalsPageContent } from '@/hooks/cms/useBusinessGoalsPageContent';

interface BusinessGoalsDebugSectionProps {
  content: BusinessGoalsPageContent | null;
  isLoading: boolean;
  error: unknown;
}

const BusinessGoalsDebugSection: React.FC<BusinessGoalsDebugSectionProps> = ({
  content,
  isLoading,
  error
}) => {
  const queryClient = useQueryClient();
  
  // Check if we're in development/staging environment
  const isDevelopment = import.meta.env.DEV || window.location.host.includes('staging') || window.location.host.includes('netlify') || window.location.host.includes('localhost');
  
  if (!isDevelopment) {
    return null;
  }
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['contentful', 'businessGoalsPageContent'] });
  };
  
  return (
    <section className="py-8 bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Debug: Business Goals Page Content</h3>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Refresh Content
            </Button>
          </div>
          
          {isLoading && (
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-gray-600">Loading content...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded">
              <p className="font-semibold">Error loading content:</p>
              <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          )}
          
          {content && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Field</th>
                    <th className="px-4 py-2 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(content).map(([key, value]) => (
                    <tr key={key}>
                      <td className="px-4 py-2 font-medium">{key}</td>
                      <td className="px-4 py-2">
                        {Array.isArray(value) ? (
                          <ul className="list-disc pl-5">
                            {value.map((item, i) => (
                              <li key={i}>{String(item)}</li>
                            ))}
                          </ul>
                        ) : (
                          typeof value === 'object' ? JSON.stringify(value) : String(value || 'null')
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!content && !isLoading && !error && (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
              <p>No content found. Please make sure you have created and published the BusinessGoalsPageContent in Contentful.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsDebugSection;
