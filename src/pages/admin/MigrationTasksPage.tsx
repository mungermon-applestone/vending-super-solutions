
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDeprecationUsageStats } from '@/services/cms/utils/deprecationLogger';
import MigrationTasksBanner from '@/components/admin/MigrationTasksBanner';
import DeprecationUsage from '@/components/admin/DeprecationUsage';
import { TaskStatus } from '@/components/admin/MigrationTasksBanner';
import MigrationStatusAlert from '@/components/admin/contentful/MigrationStatusAlert';
import { MIGRATION_GUIDE_URL } from '@/services/cms/constants';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';

interface MigrationTask {
  id: string;
  name: string;
  status: TaskStatus;
  description: string;
  link?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

const MigrationTasksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('tasks');
  
  // Sample migration tasks - in a real app this would come from an API or Contentful
  const migrationTasks: MigrationTask[] = [
    {
      id: 'task-1',
      name: 'Convert Product Editor to Contentful',
      status: 'completed',
      description: 'Replace the product editor with direct links to Contentful'
    },
    {
      id: 'task-2',
      name: 'Migrate Business Goal Data',
      status: 'completed',
      description: 'Migrate all business goal data to Contentful'
    },
    {
      id: 'task-3',
      name: 'Update Technology Component',
      status: 'in-progress',
      description: 'Update technology components to use Contentful data',
      dueDate: '2025-05-30',
      priority: 'high'
    },
    {
      id: 'task-4',
      name: 'Remove Strapi Integrations',
      status: 'in-progress',
      description: 'Remove all Strapi integration code and dependencies',
      priority: 'medium'
    },
    {
      id: 'task-5',
      name: 'Refactor Admin Dashboard',
      status: 'pending',
      description: 'Refactor admin dashboard to be Contentful-focused',
      dueDate: '2025-06-15'
    },
    {
      id: 'task-6',
      name: 'Document Migration Process',
      status: 'in-progress',
      description: 'Create comprehensive documentation for the migration process',
      dueDate: '2025-05-25'
    }
  ];

  // Calculate migration progress
  const totalTasks = migrationTasks.length;
  const completedTasks = migrationTasks.filter(task => task.status === 'completed').length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  // Open documentation
  const handleOpenDocs = () => {
    window.open(MIGRATION_GUIDE_URL || 'https://docs.contentful.com/migration-guides', '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Contentful Migration Tasks</h1>
          <p className="text-gray-500">
            Track progress and manage tasks related to the CMS migration to Contentful
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Migration Progress</span>
                  <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {progressPercentage}% Complete
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MigrationStatusAlert
                  status={progressPercentage === 100 ? 'completed' : 'in-progress'}
                  title={progressPercentage === 100 ? 'Migration Complete' : 'Migration In Progress'}
                  description={`${completedTasks} of ${totalTasks} tasks completed`}
                  className="mb-6"
                />
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="usage">Deprecation Usage</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tasks" className="mt-0">
                    <MigrationTasksBanner 
                      tasks={migrationTasks} 
                      title="Migration Tasks" 
                      maxVisibleTasks={10}
                      showViewAll={false}
                    />
                  </TabsContent>
                  
                  <TabsContent value="usage" className="mt-0">
                    <DeprecationUsage showChart={true} showResetButton={true} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={handleOpenDocs} 
                  className="w-full flex justify-start"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Migration Guide
                  <ExternalLink className="ml-auto h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <MigrationStatusAlert
              status="completed"
              title="Data Migration"
              description="All content data has been successfully migrated to Contentful."
            />
            
            <MigrationStatusAlert
              status="in-progress"
              title="Code Refactoring"
              description="Code changes to remove deprecated functionality are in progress."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MigrationTasksPage;
