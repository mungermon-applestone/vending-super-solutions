
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContentTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  createPath?: string;
  colorClass?: string;
  deprecated?: boolean;
}

const ContentTypeCard: React.FC<ContentTypeCardProps> = ({
  title,
  description,
  icon,
  path,
  createPath,
  colorClass = "bg-gray-50 border-gray-200", 
  deprecated = false
}) => {
  return (
    <Card className={`border overflow-hidden ${colorClass}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{title}</h3>
                {deprecated && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                    Deprecated
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
              {deprecated && (
                <p className="text-xs text-amber-600 mt-2">
                  Use Contentful CMS for management
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center px-6 py-4 bg-white/50 border-t">
        <Button 
          variant="outline" 
          asChild 
          size="sm"
        >
          <Link to={path}>
            View All
          </Link>
        </Button>
        
        {createPath && (
          <Button 
            asChild 
            size="sm"
            variant={deprecated ? "outline" : "default"}
            className={deprecated ? "text-amber-600 border-amber-300 hover:bg-amber-50" : ""}
          >
            <Link to={createPath}>
              <PlusCircle className="mr-1 h-4 w-4" />
              Create New
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContentTypeCard;
