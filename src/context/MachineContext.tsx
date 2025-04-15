
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MachineContextType {
  selectedMachine: string | null;
  setSelectedMachine: (machine: string | null) => void;
}

const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const useMachineContext = (): MachineContextType => {
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
