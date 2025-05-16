
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { LandingPage } from '@/types/landingPage';
import { Badge } from '@/components/ui/badge';

interface LandingPageTableRowProps {
  page: LandingPage;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
}

const LandingPageTableRow: React.FC<LandingPageTableRowProps> = ({
  page,
  onEdit,
  onDelete,
  onPreview,
}) => {
  return (
    <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50">
      <div className="col-span-3 font-medium">{page.page_name}</div>
      <div className="col-span-3">
        <Badge variant="outline" className="bg-gray-100">
          {page.page_key}
        </Badge>
      </div>
      <div className="col-span-3 truncate">{page.hero_content.title}</div>
      <div className="col-span-3 flex justify-end space-x-2">
        <Button variant="ghost" size="icon" onClick={onPreview} title="Preview">
          <Eye size={18} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
          <Edit size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete} 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
};

export default LandingPageTableRow;
