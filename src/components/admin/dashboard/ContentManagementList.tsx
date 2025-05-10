
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentType {
  title: string;
  path: string;
  deprecated?: boolean;
}

interface ContentManagementListProps {
  contentTypes: ContentType[];
}

const ContentManagementList: React.FC<ContentManagementListProps> = ({ contentTypes }) => {
  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Content Management</h3>
        </div>
        
        <div className="p-4 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="h-4 w-4 text-amber-600" />
            <p className="text-amber-800 font-medium">Contentful Migration</p>
          </div>
          <p className="text-sm text-amber-700 mb-3">
            We are transitioning to Contentful for content management. Deprecated admin interfaces will be removed in future updates.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
            onClick={handleOpenContentful}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Contentful
          </Button>
        </div>
        
        <ul className="divide-y">
          {contentTypes.map((type) => (
            <li key={type.title} className={`p-4 ${type.deprecated ? 'bg-gray-50' : ''}`}>
              <Link 
                to={type.path}
                className="flex justify-between items-center group"
              >
                <span className="flex items-center">
                  <span className={type.deprecated ? 'text-gray-500' : ''}>
                    {type.title}
                  </span>
                  {type.deprecated && (
                    <span className="ml-2 bg-amber-100 text-amber-800 text-xs rounded-full px-2 py-0.5">
                      Deprecated
                    </span>
                  )}
                </span>
                <span className="text-gray-400 group-hover:text-gray-600">
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentManagementList;
