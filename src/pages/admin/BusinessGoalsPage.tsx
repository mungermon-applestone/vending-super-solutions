
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getBusinessGoals } from '@/services/cms/businessGoals';
import { CMSBusinessGoal } from '@/types/cms';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import DeprecationBanner from '@/components/admin/DeprecationBanner';
import { logDeprecation } from '@/services/cms/utils/deprecation';
import ContentfulButton from '@/components/admin/ContentfulButton';
import LegacyStatusBanner from '@/components/admin/LegacyStatusBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BusinessGoalsPage = () => {
  const { data: businessGoals, isLoading, error } = useQuery({
    queryKey: ['businessGoals'],
    queryFn: async () => {
      // Log deprecated usage of this page
      logDeprecation(
        'BusinessGoalsPage',
        'Accessing the deprecated Business Goals admin page',
        'Contentful directly for business goal management'
      );
      
      return await getBusinessGoals();
    }
  });

  return (
    <DeprecatedAdminLayout
      title="Business Goals"
      description="View and manage business goals"
      contentType="Business Goals"
    >
      <DeprecationBanner showDetails={true} />
      
      <LegacyStatusBanner 
        contentType="Business Goals" 
        showDetails={true} 
        variant="info" 
      />
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Business Goals</h2>
        <div className="flex space-x-2">
          <ContentfulButton 
            contentType="businessGoal"
            action="manage"
            variant="outline"
            size="sm"
          />
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800">
          Error loading business goals: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {businessGoals?.map((goal: CMSBusinessGoal) => (
            <Card key={goal.id} className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {goal.description || 'No description provided'}
                </p>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-xs"
                  >
                    <Link to={`/admin/business-goals/${goal.slug}`}>
                      View Details
                    </Link>
                  </Button>
                  
                  <ContentfulButton 
                    contentType="businessGoal"
                    contentTypeId={goal.id}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DeprecatedAdminLayout>
  );
};

export default BusinessGoalsPage;
