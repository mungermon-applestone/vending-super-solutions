
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import DeprecatedInterfaceWarning from '@/components/admin/DeprecatedInterfaceWarning';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { businessGoalOperations } from '@/services/cms/contentTypes/businessGoals';
import { CMSBusinessGoal } from '@/types/cms';

const BusinessGoalsPage = () => {
  const navigate = useNavigate();
  const [showDeprecated, setShowDeprecated] = useState(true);

  // Use the query function that conforms to tanstack/react-query requirements
  const { data: businessGoals, isLoading, error } = useQuery({
    queryKey: ['businessGoals'],
    queryFn: async () => {
      return await businessGoalOperations.fetchAll();
    }
  });

  const handleContentfulRedirect = () => {
    window.open('https://app.contentful.com/', '_blank');
  };

  const handleViewExisting = (slug: string) => {
    navigate(`/business-goals/${slug}`);
  };

  return (
    <DeprecatedAdminLayout
      title="Business Goals"
      description="Business Goals have been moved to Contentful CMS"
      backPath="/admin"
    >
      {showDeprecated && (
        <DeprecatedInterfaceWarning
          contentType="Business Goals"
          message="Business Goals management has been migrated to Contentful CMS. This interface is read-only and will be removed in a future update."
          showContentfulLink={true}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Business Goals List</h2>
          <p className="text-muted-foreground">View existing business goals or manage them in Contentful</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleContentfulRedirect}
            className="bg-green-600 hover:bg-green-700"
          >
            Manage in Contentful
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Business Goals</h3>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
        </div>
      ) : (
        <div className="bg-white border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Icon</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {businessGoals && businessGoals.length > 0 ? (
                businessGoals.map(goal => (
                  <tr key={goal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{goal.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{goal.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{goal.icon || 'N/A'}</td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewExisting(goal.slug)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No business goals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DeprecatedAdminLayout>
  );
};

export default BusinessGoalsPage;
