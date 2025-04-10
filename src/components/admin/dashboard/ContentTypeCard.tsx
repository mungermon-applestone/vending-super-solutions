
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContentTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  createPath: string;
  colorClass: string;
}

const ContentTypeCard: React.FC<ContentTypeCardProps> = ({
  title,
  description,
  icon,
  path,
  createPath,
  colorClass,
}) => {
  return (
    <Card className={`shadow-sm border ${colorClass}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-white shadow-sm border">
            {icon}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to={createPath} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> New
            </Link>
          </Button>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Create, edit, and manage {title.toLowerCase()} content types.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={path}>Manage {title}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentTypeCard;
