
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Copy } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import MachineTypeIcon from './MachineTypeIcon';
import TemperatureBadge from './TemperatureBadge';
import { CMSMachine } from '@/types/cms';
import CloneButton from '../common/CloneButton';

interface MachineTableRowProps {
  machine: {
    id: string;
    title: string;
    type: string;
    temperature: string;
    slug: string;
  };
  onDeleteClick: (machine: CMSMachine) => void;
  onCloneClick: (machine: CMSMachine) => void;
  isCloningId: string | null;
}

const MachineTableRow: React.FC<MachineTableRowProps> = ({ 
  machine, 
  onDeleteClick, 
  onCloneClick,
  isCloningId
}) => {
  const navigate = useNavigate();
  const isCloning = isCloningId === machine.id;
  
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
            variant="outline"
            size="sm"
            onClick={() => navigate(`/machines/${machine.type}/${machine.slug}`)}
            title="View machine"
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" /> View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/machines/edit/${machine.id}`)}
            title="Edit machine"
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <CloneButton
            onClone={() => onCloneClick(machine as CMSMachine)}
            itemName={machine.title}
            isCloning={isCloning}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteClick(machine as CMSMachine)}
            title="Delete machine"
            className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MachineTableRow;
