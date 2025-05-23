
import React from 'react';
import MachineCard from './MachineCard';

interface MachineGridProps {
  machines: any[];
  title?: string;
}

const MachineGrid: React.FC<MachineGridProps> = ({ machines, title }) => {
  if (!machines?.length) return null;
  
  // Add logging to help diagnose thumbnail issues
  console.log(`[MachineGrid] Rendering ${machines.length} machines with title: ${title || 'Untitled'}`);
  console.log('[MachineGrid] Machines data:', machines.map(machine => ({
    id: machine.id,
    title: machine.title,
    hasThumbnail: !!machine.thumbnail,
    thumbnailUrl: machine.thumbnail?.url || 'none'
  })));
  
  return (
    <div className="mb-16">
      {title && <h3 className="text-2xl font-semibold mb-6">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>
    </div>
  );
};

export default MachineGrid;
