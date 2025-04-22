
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trello, Database, Box } from 'lucide-react';
import CMSConfigInfo from '@/components/admin/cms/CMSConfigInfo';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Trello className="mr-2 h-5 w-5 text-primary" />
            Product Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          Add and manage your product types, their features and benefits.
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/admin/products')}
          >
            Manage Products <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Box className="mr-2 h-5 w-5 text-primary" />
            Machine Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          Configure machines, their specifications, and deployment examples.
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/admin/machines')}
          >
            Manage Machines <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Database className="mr-2 h-5 w-5 text-primary" />
            Content Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <CMSConfigInfo />
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/admin/contentful')}
          >
            Manage Content <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuickActions;
