
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';
import MigrationTasksBanner, { TaskStatus } from '@/components/admin/MigrationTasksBanner';
import MigrationStatusAlert from '@/components/admin/contentful/MigrationStatusAlert';

// Sample migration tasks - in a real app this would come from an API
const migrationTasks = [
  {
    id: 'task-1',
    name: 'Replace write operations with read-only implementations',
    status: 'completed' as TaskStatus,
    description: 'Replace direct database write operations with Contentful management',
    priority: 'high' as const
  },
  {
    id: 'task-2',
    name: 'Add toast notifications for deprecated functionality',
    status: 'completed' as TaskStatus,
    description: 'Show toast notifications when users attempt to use deprecated features',
  },
  {
    id: 'task-3',
    name: 'Create tracking system for deprecated function usage',
    status: 'completed' as TaskStatus,
    description: 'Track which deprecated functions are still being used in the application',
  },
  {
    id: 'task-4',
    name: 'Implement redirects from admin edit routes to Contentful',
    status: 'completed' as TaskStatus,
    description: 'Redirect users from legacy admin routes to appropriate Contentful pages',
  },
  {
    id: 'task-5',
    name: 'Consolidate utility functions into central modules',
    status: 'completed' as TaskStatus,
    description: 'Move utility functions to centralized modules for better organization',
  },
  {
    id: 'task-6',
    name: 'Add adapter compatibility layer for method naming conventions',
    status: 'completed' as TaskStatus,
    description: 'Create compatibility layer to bridge different adapter method names',
  },
  {
    id: 'task-7',
    name: 'Remove legacy configuration files',
    status: 'in-progress' as TaskStatus,
    description: 'Remove or replace redundant configuration files for deprecated systems',
    dueDate: 'June 15, 2025',
  },
  {
    id: 'task-8',
    name: 'Convert admin forms to read-only views',
    status: 'in-progress' as TaskStatus,
    description: 'Update admin interfaces to be read-only with Contentful redirects',
    dueDate: 'June 30, 2025',
  },
  {
    id: 'task-9',
    name: 'Remove legacy database schemas',
    status: 'pending' as TaskStatus,
    description: 'Remove database schemas after confirming all data is migrated to Contentful',
    dueDate: 'July 15, 2025',
  },
  {
    id: 'task-10',
    name: 'Update API endpoints to use Contentful directly',
    status: 'pending' as TaskStatus,
    description: 'Update all API endpoints to fetch data directly from Contentful',
    dueDate: 'July 30, 2025',
  },
  {
    id: 'task-11',
    name: 'Complete removal of deprecated adapters',
    status: 'pending' as TaskStatus,
    description: 'Remove all deprecated adapters after confirming no code dependencies',
    dueDate: 'August 15, 2025',
  },
  {
    id: 'task-12',
    name: 'Final testing of all functionality',
    status: 'pending' as TaskStatus,
    description: 'Complete end-to-end testing of all functionality with Contentful',
    dueDate: 'September 15, 2025',
  }
];

/**
 * Page displaying the detailed migration tasks and progress
 */
const MigrationTasksPage: React.FC = () => {
  // Calculate progress stats
  const totalTasks = migrationTasks.length;
  const completedTasks = migrationTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = migrationTasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = migrationTasks.filter(task => task.status === 'pending').length;
  
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <DeprecatedAdminLayout
      title="Migration Tasks"
      description="Track the progress of our migration to Contentful CMS"
      contentType="Migration"
      backPath="/admin/dashboard"
    >
      <div className="mb-6">
        <MigrationStatusAlert
          status={progressPercentage === 100 ? 'completed' : 'in-progress'}
          title={`Migration Progress: ${progressPercentage}% Complete`}
          description={`${completedTasks} completed, ${inProgressTasks} in progress, ${pendingTasks} pending`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="bg-green-50 pb-3">
            <CardTitle className="text-green-800 text-base">Completed</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="text-2xl font-bold">{completedTasks}</div>
            <div className="text-sm text-gray-500">tasks completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-amber-50 pb-3">
            <CardTitle className="text-amber-800 text-base">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <div className="text-sm text-gray-500">tasks in progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50 pb-3">
            <CardTitle className="text-gray-800 text-base">Pending</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <div className="text-sm text-gray-500">tasks pending</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Migration Tasks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {migrationTasks.map(task => (
              <li key={task.id} className="py-4 px-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {task.status === 'completed' && <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Completed</span>}
                      {task.status === 'in-progress' && <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">In Progress</span>}
                      {task.status === 'pending' && <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">Pending</span>}
                      {task.priority === 'high' && <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">High Priority</span>}
                    </div>
                    <h3 className="font-medium">{task.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default MigrationTasksPage;
