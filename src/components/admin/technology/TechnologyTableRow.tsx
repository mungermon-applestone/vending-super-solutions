
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CMSTechnology } from '@/types/cms';
import CloneButton from '../common/CloneButton';

interface TechnologyTableRowProps {
  technology: CMSTechnology;
  onDeleteClick: (technology: CMSTechnology) => void;
  onCloneClick: (technology: CMSTechnology) => void;
  isCloningId: string | null;
}

const TechnologyTableRow: React.FC<TechnologyTableRowProps> = ({ 
  technology, 
  onDeleteClick, 
  onCloneClick,
  isCloningId
}) => {
  const navigate = useNavigate();
  const isCloning = isCloningId === technology.id;
  
  return (
    <TableRow>
      <TableCell className="font-medium">
        {technology.title}
      </TableCell>
      <TableCell className="font-mono text-sm text-gray-500">
        {technology.slug}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/technology/${technology.slug}`)}
            title="View technology"
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" /> View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/technology/edit/${technology.slug}`)}
            title="Edit technology"
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <CloneButton
            onClone={() => onCloneClick(technology)}
            itemName={technology.title}
            isCloning={isCloning}
          />
          <Button
            variant="outline" 
            size="sm"
            onClick={() => onDeleteClick(technology)}
            title="Delete technology"
            className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TechnologyTableRow;
