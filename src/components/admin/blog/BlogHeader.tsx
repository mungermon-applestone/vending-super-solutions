
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface BlogHeaderProps {
  onRefresh: () => void;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Blog Posts</h1>
        <p className="text-muted-foreground">Manage blog posts and updates</p>
      </div>
      
      <div className="flex gap-2 mt-2 sm:mt-0">
        <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        
        <Button asChild className="flex items-center gap-2">
          <Link to="/admin/blog/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BlogHeader;
