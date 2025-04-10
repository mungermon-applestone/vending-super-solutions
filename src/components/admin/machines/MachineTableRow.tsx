
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import MachineTypeIcon from './MachineTypeIcon';
import TemperatureBadge from './TemperatureBadge';

interface MachineTableRowProps {
  machine: {
    id: string;
    title: string;
    type: string;
    temperature: string;
    slug: string;
  };
  onDeleteClick: (machine: any) => void;
}

const MachineTableRow: React.FC<MachineTableRowProps> = ({ machine, onDeleteClick }) => {
  const navigate = useNavigate();
  
  console.log(`[MachineTableRow] Machine ID: ${machine.id}, Title: ${machine.title}`);

  return (
    <TableRow>
      <TableCell className="font-medium">{machine.title}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <MachineTypeIcon type={machine.type} />
          <span className="ml-2 capitalize">{machine.type}</span>
        </div>
      </TableCell>
      <TableCell>
        <TemperatureBadge temperature={machine.temperature} />
      </TableCell>
      <TableCell className="font-mono text-sm text-gray-500">
        {machine.slug}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(`/machines/${machine.type}/${machine.slug}`)}
            title="View machine"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              console.log(`[MachineTableRow] Navigating to edit machine with ID: ${machine.id}`);
              navigate(`/admin/machines/edit/${machine.id}`);
            }}
            title="Edit machine"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDeleteClick(machine)}
            title="Delete machine"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MachineTableRow;
