
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Goal, Server, Database } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Commonly used admin actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col">
            <Link to="/admin/products/new">
              <Package className="h-6 w-6 mb-1" />
              <span>New Product</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col">
            <Link to="/admin/business-goals/new">
              <Goal className="h-6 w-6 mb-1" />
              <span>New Goal</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col">
            <Link to="/admin/machines/new">
              <Server className="h-6 w-6 mb-1" />
              <span>New Machine</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col">
            <Link to="/admin/machines/migrate">
              <Database className="h-6 w-6 mb-1" />
              <span>Import Data</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
