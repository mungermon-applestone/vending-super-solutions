
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MachineContextType {
  selectedMachine: string | null;
  setSelectedMachine: (id: string | null) => void;
}

const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const useMachineContext = () => {
  const context = useContext(MachineContext);
  if (context === undefined) {
    throw new Error('useMachineContext must be used within a MachineProvider');
  }
  return context;
};

interface MachineProviderProps {
  children: ReactNode;
}

export const MachineProvider: React.FC<MachineProviderProps> = ({ children }) => {
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);

  return (
    <MachineContext.Provider value={{ selectedMachine, setSelectedMachine }}>
      {children}
    </MachineContext.Provider>
  );
};
