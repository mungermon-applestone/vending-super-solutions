
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MachineHeaderProps {
  onRefresh: () => void;
}

const MachineHeader: React.FC<MachineHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Machines Management</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh} title="Refresh data">
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/machines/migrate">
            <Download className="h-4 w-4 mr-2" /> Import Sample Data
          </Link>
        </Button>
        <Button asChild>
          <Link to="/admin/machines/new">
            <Plus className="h-4 w-4 mr-2" /> Add New Machine
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MachineHeader;
