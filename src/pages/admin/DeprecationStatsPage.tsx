import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  getDeprecationStats, 
  resetDeprecationTracker, 
  type DeprecationStat 
} from '@/services/cms/utils/deprecation';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const DeprecationStatsPage: React.FC = () => {
  const [stats, setStats] = useState<DeprecationStat[]>([]);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const usageStats = getDeprecationStats();
    setStats(usageStats);
  }, [isResetting]);

  const handleReset = () => {
    setIsResetting(true);
    resetDeprecationTracker();

    // Set a small delay to allow the reset to complete
    setTimeout(() => {
      setStats(getDeprecationStats());
      setIsResetting(false);
    }, 100);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Deprecation Statistics</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isResetting || stats.length === 0}
            className="h-8"
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1" />
            Reset Tracker
          </Button>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage Count
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Used
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.map(stat => (
              <tr key={stat.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{stat.item}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{stat.count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(stat.lastOccurred).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {stats.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No deprecated features have been used yet.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DeprecationStatsPage;
