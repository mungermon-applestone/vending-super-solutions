
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export type TaskStatus = 'completed' | 'in-progress' | 'pending' | 'blocked';

interface MigrationTask {
  id: string;
  name: string;
  status: TaskStatus;
  description: string;
  link?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface MigrationTasksBannerProps {
  tasks: MigrationTask[];
  title?: string;
  showViewAll?: boolean;
  maxVisibleTasks?: number;
  className?: string;
}

/**
 * Banner component that shows migration tasks and their status
 * Used in the admin dashboard to highlight the remaining migration steps
 */
const MigrationTasksBanner: React.FC<MigrationTasksBannerProps> = ({
  tasks,
  title = "Content Migration Tasks",
  showViewAll = true,
  maxVisibleTasks = 3,
  className = ""
}) => {
  const navigate = useNavigate();
  
  // Compute summary stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  
  // Filter to show only the first few tasks based on maxVisibleTasks
  const visibleTasks = [...tasks].sort((a, b) => {
    // Sort by status priority: in-progress first, then pending, then completed
    const statusOrder: Record<TaskStatus, number> = {
      'in-progress': 1,
      'pending': 2,
      'blocked': 3,
      'completed': 4
    };
    return statusOrder[a.status] - statusOrder[b.status];
  }).slice(0, maxVisibleTasks);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'blocked':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const handleViewTask = (task: MigrationTask) => {
    if (task.link) {
      navigate(task.link);
    }
  };

  const handleViewAll = () => {
    navigate('/admin/migration-tasks');
  };

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="bg-gray-50 border-b pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <div className="text-sm font-normal">
            <span className="text-green-600">{completedTasks}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span>{totalTasks}</span>
            <span className="text-gray-500 ml-1">completed</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {visibleTasks.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No migration tasks found</p>
          </div>
        ) : (
          <ul className="divide-y">
            {visibleTasks.map(task => (
              <li key={task.id} className="py-3 px-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.name}</span>
                      {task.priority === 'high' && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  {task.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTask(task)}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {task.dueDate && (
                  <div className="mt-2 text-xs text-gray-500">
                    Due: {task.dueDate}
                  </div>
                )}
                <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-flex items-center gap-1.5 ${getStatusClass(task.status)}`}>
                  {getStatusIcon(task.status)}
                  <span>
                    {task.status === 'completed' ? 'Completed' : 
                     task.status === 'in-progress' ? 'In Progress' :
                     task.status === 'blocked' ? 'Blocked' : 'Pending'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {showViewAll && totalTasks > maxVisibleTasks && (
        <CardFooter className="bg-gray-50 border-t py-2 px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm w-full justify-center"
            onClick={handleViewAll}
          >
            View All Tasks ({totalTasks})
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MigrationTasksBanner;
