
import React from 'react';
import DeleteEntityDialog, { EntityToDelete } from '../common/DeleteEntityDialog';

interface DeleteMachineDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  machineToDelete: { id: string; title: string } | null;
  onConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
}

const DeleteMachineDialog: React.FC<DeleteMachineDialogProps> = ({
  isOpen,
  setIsOpen,
  machineToDelete,
  onConfirmDelete,
  isDeleting
}) => {
  // Convert machineToDelete to the format expected by DeleteEntityDialog
  const entityToDelete: EntityToDelete | null = machineToDelete 
    ? { 
        id: machineToDelete.id, 
        title: machineToDelete.title, 
        slug: ''  // Machine might not have slug in this component
      } 
    : null;

  return (
    <DeleteEntityDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      entityToDelete={entityToDelete}
      onConfirmDelete={onConfirmDelete}
      isDeleting={isDeleting}
      entityType="machine"
    />
  );
};

export default DeleteMachineDialog;
