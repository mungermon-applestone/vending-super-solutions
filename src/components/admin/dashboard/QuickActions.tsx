
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Settings, RefreshCw } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-2">
        <Button variant="outline" asChild className="justify-start">
          <Link to="/admin/technology/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Technology
          </Link>
        </Button>
        <Button variant="outline" asChild className="justify-start">
          <Link to="/admin/settings">
            <Settings className="mr-2 h-4 w-4" />
            CMS Settings
          </Link>
        </Button>
        <Button variant="outline" asChild className="justify-start">
          <Link to="/admin/contentful">
            <RefreshCw className="mr-2 h-4 w-4" />
            Contentful Management
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
