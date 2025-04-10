
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';

interface ContentType {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  createPath: string;
}

interface ContentManagementListProps {
  contentTypes: ContentType[];
}

const ContentManagementList: React.FC<ContentManagementListProps> = ({ contentTypes }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-500" />
          Content Management
        </CardTitle>
        <CardDescription>
          Access all content type management interfaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {contentTypes.map((type) => (
            <li key={type.title} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                {type.icon}
                <span>{type.title}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={type.path}>Manage</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to={type.createPath}>Create</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ContentManagementList;
