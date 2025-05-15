import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachines } from '@/hooks/cms';

const Machines = () => {
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get('type') || '';
  const [currentFilterType, setCurrentFilterType] = useState(filterType);
  
  // Handle case where filter changed in URL
  if (filterType !== currentFilterType) {
    setCurrentFilterType(filterType);
  }
  
  const { machines, isLoading, error, refetch } = useMachines();
  
  // Filter by type if a filter is applied
  const filteredMachines = machines ? machines.filter(machine => 
    currentFilterType ? machine.type === currentFilterType : true
  ) : [];
  
  // Sort by display order (if available)
  const sortedMachines = [...filteredMachines].sort((a, b) => 
    (a.displayOrder || 0) - (b.displayOrder || 0)
  );
  
  // If no machines are available but user has filtered, suggest clearing filters
  const shouldSuggestClearingFilters = currentFilterType && filteredMachines.length === 0 && machines && machines.length > 0;
  
  return (
    <Layout>
      <MachinePageTemplate
        machines={sortedMachines}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        filterType={currentFilterType}
        emptyMessage={
          shouldSuggestClearingFilters
            ? `No ${currentFilterType} machines found. Try clearing your filters.`
            : "No machines available."
        }
        pageTitle={`${currentFilterType ? `${currentFilterType.charAt(0).toUpperCase() + currentFilterType.slice(1)} ` : ''}Machines`}
        pageDescription={`Explore our selection of ${currentFilterType || 'vending'} machines designed for modern businesses.`}
      />
    </Layout>
  );
};

export default Machines;
