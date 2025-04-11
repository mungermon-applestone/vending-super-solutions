
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import MachineTableRow from './MachineTableRow';

describe('MachineTableRow component', () => {
  const mockMachine = {
    id: 'test-id',
    title: 'Test Machine',
    type: 'vending',
    temperature: 'ambient',
    slug: 'test-machine'
  };

  const mockHandlers = {
    onDeleteClick: vi.fn(),
    onCloneClick: vi.fn()
  };

  it('renders machine details correctly', () => {
    render(
      <MachineTableRow 
        machine={mockMachine} 
        onDeleteClick={mockHandlers.onDeleteClick} 
        onCloneClick={mockHandlers.onCloneClick}
        isCloningId={null}
      />
    );
    
    expect(screen.getByText('Test Machine')).toBeInTheDocument();
    expect(screen.getByText('vending')).toBeInTheDocument();
    expect(screen.getByText('ambient')).toBeInTheDocument();
    expect(screen.getByText('test-machine')).toBeInTheDocument();
  });

  it('calls onDeleteClick when delete button is clicked', () => {
    render(
      <MachineTableRow 
        machine={mockMachine} 
        onDeleteClick={mockHandlers.onDeleteClick} 
        onCloneClick={mockHandlers.onCloneClick}
        isCloningId={null}
      />
    );
    
    const deleteButton = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDeleteClick).toHaveBeenCalledTimes(1);
  });
});
