
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, List } from 'lucide-react';

interface ContentTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  createPath: string;
  colorClass?: string;
}

const ContentTypeCard: React.FC<ContentTypeCardProps> = ({
  title,
  description,
  icon,
  path,
  createPath,
  colorClass = "bg-gray-50 border-gray-200"
}) => {
  return (
    <Card className={`border ${colorClass} hover:shadow-md transition-shadow overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div>{icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      
      <CardFooter className="bg-card border-t p-2 flex justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to={path}>
            <List className="h-4 w-4 mr-2" />
            Manage
          </Link>
        </Button>
        
        <Button asChild variant="ghost" size="sm">
          <Link to={createPath}>
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentTypeCard;
